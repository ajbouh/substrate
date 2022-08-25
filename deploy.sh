#!/bin/bash

set -eo pipefail
set -x

HERE=$(cd $(dirname $0); pwd)

# These are not properly configurable yet.
FLY_ORG=personal
: ${NAMESPACE:=substrate-nobody}

cue_export() {
  NAMESPACE=$NAMESPACE $HERE/tools/cue-export.sh "$@"
}

dasel() {
  $HERE/tools/dasel "$@"
}

jamsocket() {
  $HERE/tools/jamsocket.sh "$@"
}

jamsocket_ensure_services() {
  EXISTING_SERVICES="$(jamsocket service list | jq --raw-input --slurp)"
  MISSING_SERVICES="$(cue_export text $CUE_MODULE:deploy "(jamsocket.#services_delta & {#var: existing: $EXISTING_SERVICES}).#out")"
  for service in $MISSING_SERVICES; do
    if [ -n "$service" ]; then
      jamsocket service create $service
    fi
  done
}

CUE_MODULE=github.com/ajbouh/substrate

github_docker_auth() {
  GITHUB_REGISTRY_USERNAME=$(cue_export text $CUE_MODULE:external "github[\"$NAMESPACE\"].registry_username")
  GITHUB_REGISTRY_PASSWORD=$(cue_export text $CUE_MODULE:external "github[\"$NAMESPACE\"].registry_password")

  echo $GITHUB_REGISTRY_PASSWORD | docker login \
    --username $GITHUB_REGISTRY_USERNAME \
    --password-stdin \
    $GITHUB_REGISTRY
}

jamsocket_docker_auth() {
  JAMSOCKET_REGISTRY_USERNAME=$(cue_export text $CUE_MODULE:external 'jamsocket.registry_username')
  JAMSOCKET_REGISTRY_PASSWORD=$(cue_export text $CUE_MODULE:external 'jamsocket.registry_password')

  echo $JAMSOCKET_REGISTRY_PASSWORD | docker login \
    --username $JAMSOCKET_REGISTRY_USERNAME \
    --password-stdin \
    $JAMSOCKET_REGISTRY
}

jamsocket_deploy_services() {
  jamsocket_ensure_services

  jamsocket_docker_auth
  docker_compose push
}

flyctl_ssh() {
  FLY_APP_NAME=$1
  shift
  flyctl ssh console -a $FLY_APP_NAME --command "$(echo $@)"
}

flyctl_ensure_launched() {
  BASENAME=$1
  FLY_APP_NAME=$2

  if ! flyctl list apps $FLY_APP_NAME | cut -f1 -d'|' | grep -E "^ *$FLY_APP_NAME *\$"; then
    fly_app_region="$(cue_export text $CUE_MODULE:deploy "fly.apps[\"$BASENAME\"].#regions.app[0]")"
    flyctl launch --no-deploy --name $FLY_APP_NAME --org $FLY_ORG --region $fly_app_region --path /tmp/$FLY_APP_NAME
  fi
}

flyctl_ensure_ips() {
  BASENAME=$1
  FLY_APP_NAME=$2

  if [ $(cue_export text $CUE_MODULE:deploy "\"\(len(fly.apps[\"$BASENAME\"].services))\"") -gt 0 ]; then
    if ! flyctl ips list -a $FLY_APP_NAME | grep v4 | grep public; then
      flyctl ips allocate-v4 -a $FLY_APP_NAME
    fi
  fi
}

flyctl_ensure_scaled() {
  BASENAME=$1
  FLY_APP_NAME=$2

  for group in $(cue_export text $CUE_MODULE:deploy "fly.apps[\"$BASENAME\"].#out.#groups_expr"); do
    flyctl scale -a $FLY_APP_NAME vm $(cue_export text $CUE_MODULE:deploy "fly.apps[\"$BASENAME\"].#scale.$group.vm")
  done 
  flyctl scale -a $FLY_APP_NAME count $(cue_export text $CUE_MODULE:deploy "fly.apps[\"$BASENAME\"].#out.#scale_count_cli_expr")
}

flyctl_ensure_secrets() {
  BASENAME=$1
  FLY_APP_NAME=$2

  # Overwrite all secrets every time, but if there's no change we need to ignore the error...
  FLY_SECRETS=$(cue_export text $CUE_MODULE:deploy "fly.apps[\"$BASENAME\"].#out.#secrets_import_expr")
  echo "$FLY_SECRETS" | flyctl -a $FLY_APP_NAME secrets import --stage || true
}

flyctl_ensure_volumes() {
  BASENAME=$1
  FLY_APP_NAME=$2

  EXISTING_MOUNTS="$(flyctl volumes -a $FLY_APP_NAME list --json | dasel -r json --pretty=false -w json)"
  MISSING_VOLUMES="$(cue_export text $CUE_MODULE:deploy "(fly.apps[\"$BASENAME\"].#out.#app_volume_mounts & {#var: existing: $EXISTING_MOUNTS}).#out.missing_lines")"
  for volume in $MISSING_VOLUMES; do
    if [ -n "$volume" ]; then
      fly_app_region="$(cue_export text $CUE_MODULE:deploy "fly.apps[\"$BASENAME\"].#regions.app[0]")"
      flyctl -a $FLY_APP_NAME volumes create --region $fly_app_region $volume
    fi
  done
}

flyctl_ensure_regions() {
  BASENAME=$1
  FLY_APP_NAME=$2

  # Apps that use volumes use the region for the volume
  fly_app_num_mounts="$(cue_export text $CUE_MODULE:deploy "\"\\(len(fly.apps[\"$BASENAME\"].mounts))\"")"
  if [ $fly_app_num_mounts -eq 0 ]; then
    fly_app_group="app"
    fly_app_regions="$(cue_export text $CUE_MODULE:deploy "strings.Join(fly.apps[\"$BASENAME\"].#regions[\"$fly_app_group\"], \" \")")"
    flyctl -a $FLY_APP_NAME regions set --group $fly_app_group $fly_app_regions
  fi
}

flyctl_ensure_deployed() {
  BASENAME=$1
  FLY_APP_NAME=$2
  shift 2

  FLY_CONFIG=$HERE/.gen/fly/$FLY_APP_NAME/fly.toml
  mkdir -p $(dirname $FLY_CONFIG)

  cue_export toml $CUE_MODULE:deploy fly.apps[\"$BASENAME\"] > $FLY_CONFIG

  fly_app_image=$(cue_export text $CUE_MODULE:deploy "fly.apps[\"$BASENAME\"].build.image")
  fly_app_image_repo_digest=$(docker inspect ${fly_app_image} --format "{{index .RepoDigests 0}}")

  flyctl -c $FLY_CONFIG \
    -a $FLY_APP_NAME \
    deploy \
      --image $fly_app_image_repo_digest \
      "$@"
}

flyctl_ensure() {
  basename=$1
  shift
  fly_app_name=$(cue_export text $CUE_MODULE:deploy "fly.apps[\"$basename\"].app")

  flyctl_ensure_launched $basename $fly_app_name
  flyctl_ensure_regions $basename $fly_app_name
  flyctl_ensure_ips $basename $fly_app_name
  flyctl_ensure_volumes $basename $fly_app_name
  flyctl_ensure_scaled $basename $fly_app_name
  flyctl_ensure_secrets $basename $fly_app_name
  flyctl_ensure_deployed $basename $fly_app_name
}

docker_compose() {
  docker_compose_yml=$1
  shift
  docker compose \
    -p $(basename $docker_compose_yml .yml) \
    --project-directory $HERE \
    -f $docker_compose_yml "$@"
}

flyctl_ensure_launched_apps() {
  fly_app_basenames=()
  for fly_app_basename in $(cue_export text $CUE_MODULE:deploy "strings.Join([for app, def in fly.apps { app }], \" \")"); do
    fly_app_basenames+=("$fly_app_basename")
  done

  for fly_app_basename in ${fly_app_basenames[@]}; do
    fly_app_name=$(cue_export text $CUE_MODULE:deploy "fly.apps[\"$fly_app_basename\"].app")
    flyctl_ensure_launched $fly_app_basename $fly_app_name
  done
}

flyctl_deploy_apps() {
  for fly_app_basename in $(cue_export text $CUE_MODULE:deploy "strings.Join([for app, def in fly.apps { app }], \" \")"); do
    flyctl_ensure $fly_app_basename
  done
}

nomad_deploy_job() {
  NOMAD_JOB=$HERE/.gen/nomad/nomad-job-$NAMESPACE.json
  mkdir -p $(dirname $NOMAD_JOB)

  nomad_server_url=$1
  nomad_job_name=$2
  shift 2

  base_job_expr="nomad.jobs[\"$nomad_job_name\"]"
  job_expr="$base_job_expr"

  nomad_job_services=()
  for nomad_job_service in $(cue_export text $CUE_MODULE:deploy "strings.Join(list.Concat([for tg in ($base_job_expr).taskgroups {[for t in tg.tasks { t.name }]}]), \" \")"); do
    nomad_job_services+=("$nomad_job_service")
  done

  # Unify the job expression with specific repo digests so that the job is exactly what we expect.
  for nomad_job_service in "${nomad_job_services[@]}"; do
    nomad_job_image=$(cue_export text $CUE_MODULE:deploy "$base_job_expr.#tasks[\"$nomad_job_service\"].config.image")
    repo_digest=$(docker inspect ${nomad_job_image} --format "{{index .RepoDigests 0}}")
    job_expr="$job_expr & {#tasks: \"${nomad_job_service}\": config: image: \"$repo_digest\"}"
  done

  # Trim the leading "nomad" characters from given expr, so we can use the unified expression instead
  # NB there's probably a more general way to do this, but this hack works for now.
  cue_export json $CUE_MODULE:deploy "{Job: (${job_expr})}" > $NOMAD_JOB

  curl < $NOMAD_JOB --request POST --data @- $nomad_server_url/v1/jobs
}

JAMSOCKET_REGISTRY=$(cue_export text $CUE_MODULE:external 'jamsocket.registry')
JAMSOCKET_ACCOUNT=$(cue_export text $CUE_MODULE:external 'jamsocket.account')

# TODO parameterize this in external
GITHUB_REGISTRY=ghcr.io

dc_deploy_build=$HERE/.gen/docker/docker-compose-$NAMESPACE-deploy-build.yml
mkdir -p $(dirname $dc_deploy_build)
cue_export yaml $CUE_MODULE:deploy docker_compose > $dc_deploy_build

docker_compose $dc_deploy_build build

# Auth docker with various registries
github_docker_auth
jamsocket_docker_auth
flyctl auth docker

# # Need push targets to already exist
jamsocket_ensure_services
flyctl_ensure_launched_apps

# Need to push before the repo digests are available
docker_compose $dc_deploy_build push

# Deploy substrate to fly
flyctl_deploy_apps

DRONE_IP=$(cue_export text $CUE_MODULE:external 'tailscale.drone_ip')
NOMAD_SERVER_HOSTNAME=$DRONE_IP
NOMAD_SERVER_URL=http://$NOMAD_SERVER_HOSTNAME:4646

# Deploy plane-drone and substratefs to nomad
nomad_deploy_job $NOMAD_SERVER_URL jamsocket_drone

# Deploy plane-drone and substratefs to nomad
nomad_deploy_job $NOMAD_SERVER_URL substratefs_redis
