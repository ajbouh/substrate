# Substrate

Substrate has a small number of "always available" servers running at well known addresses. These are:
- launcher
- gateway 

All other services are assigned ephemeral hostnames that expire when the service completes its work or becomes idle.

Under the hood, substrate runs ephemeral backends via plane.

The primary user-visible abstractions in substrate are the "service" and the "workspace".

A "service" is a docker image that's been registered with substrate and can be started and retired as needed.

A "workspace" is a directory on a global filesystem (currently backed by S3 via the juicefs project)

## What are Maxwell's equations of collaborative media?

### Actions
- creating (start a new document, new repository, new post)
- forking (copy an existing document, fork an existing repository, remix someone's post)
- collections (includes favoriting, reactions)
- contributing (includes merging, commenting, reactions)
- embedding (includes importing, citing, )

### Experiences
- something i'm doing is visible to others
- something others are doing is visible to me
- someone interacted with a thing i made or did
- external evidence that something happened within the system


# Definitions
- space: (noun) a checkpointable, forkable directory on substratefs
- lens: (noun) a container that provides web UI or API based on access to zero or more spaces
- view: (noun) a composition of {0, 1} lens(es) and 0+ spaces. it may be concrete or abstract.
  - concrete view: (noun): 1 lens and 0+ spaces. it can be launched and will not create any new spaces.
  - abstract view: (noun): {0, 1} lens(es) and 0+ spaces. it may be incomplete and require additional information to be launched.
- viewspec: (noun) a string that describes concrete or abstract view
  - abstract viewspec: (noun) a string that describes an abstract view
  - contract viewspec: (noun) a string that describes a concrete view

  examples:
  ```
  somelens[foo=sp-12sdfasc] means: lens is "somelens", view named foo bound to space "sp-12sdfasc"
  somelens[foo=~sp-12sdfasc] means: lens is "somelens", view named foo bound to a fork of space "sp-12sdfasc"
  [foo=~sp-12sdfasc] means: lens is unknown, view named foo bound to a fork of space "sp-12sdfasc"
  ```

GET    /api/v1/backend/jamsocket/:backend/status/stream
GET    /api/v1/events
GET    /api/v1/lenses
GET    /api/v1/lenses/:lens
GET    /api/v1/spaces
DELETE /api/v1/spaces/:space
PATCH  /api/v1/spaces/:space
GET    /api/v1/spaces/:space
GET    /api/v1/activities
POST   /api/v1/activities
GET    /api/v1/activities/:viewspec
GET    /api/v1/collections/:owner
GET    /api/v1/collections/:owner/:name
POST   /api/v1/collections/:owner/:name/spaces
GET    /api/v1/collections/:owner/:name/spaces
DELETE /api/v1/collections/:owner/:name/spaces/:space
POST   /api/v1/collections/:owner/:name/lenses
DELETE /api/v1/collections/:owner/:name/lenses/:lensspec
GET    /api/v1/collections/:owner/:name/lensspecs

collections:

system/preview
  :space + :lensspec

system/preview
set *if not yet set* lensspec

# See https://docs.docker.com/engine/extend/

# Update docker plugin on drone
set -xo pipefail
work=~/hacking/mieco-engine-room/infra/substrate && \
out=$work/.docker/plugin/docker-volume-substratefs && \
pluginrootfs=ghcr.io/ajbouh/docker-volume-substratefs:rootfs && \
plugintag=ghcr.io/ajbouh/docker-volume-substratefs:latest && \
rootfs=$out/rootfs && \
config=$out/config.json && \
docker build \
  -f $work/pkg/substratefs/docker-volume-substratefs/cmd/Dockerfile \
  -t $pluginrootfs \
  $work && \
id=$(docker create $pluginrootfs true) && \
rm -rf $out && \
mkdir -p $out/rootfs && \
cp $work/pkg/substratefs/docker-volume-substratefs/config.json $out/
docker export "$id" | tar -x -C $out/rootfs && \
docker rm -vf "$id" && \
(docker plugin rm -f $plugintag || true) && \
docker plugin create $plugintag $out && \
docker plugin push $plugintag

# docker plugin enable $plugintag
# 
# docker run -it --rm --privileged --pid=host justincormack/nsenter1
# 
# runc --root /run/docker/runtime-runc/plugins.moby list
# 
plugintag=ghcr.io/ajbouh/docker-volume-substratefs:latest
testvol=samplevol
sudo docker volume create \
  --driver $plugintag \
  $testvol && \
sudo docker run --rm -it \
  -v $testvol:/data \
  ubuntu:22.04 

 
 # 8xa100
DRONE_IP=100.64.51.49

ssh -t $DRONE_IP 'sudo docker plugin rm -f substratefs && \
sudo docker plugin install --grant-all-permissions --alias substratefs ghcr.io/ajbouh/docker-volume-substratefs:latest \
  DEBUG=1 \
  JUICEFS_NAME=substratefs \
  JUICEFS_SOURCE=sqlite3://substratefs.db \
  JUICEFS_MOUNTPOINT=/substrate'


# Update docker wrapper on drone
docker build \
  -t ghcr.io/ajbouh/plane-data-substratefs \
  -f services/plane-data-substratefs/cmd/Dockerfile \
  ~/hacking/mieco-engine-room/infra/substrate && \
docker push ghcr.io/ajbouh/plane-data-substratefs:latest && \
ssh -t $DRONE_IP \
  sudo docker run --rm -it \
    --pull=always \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /var/run/sockguard:/var/run/sockguard \
    -e AWS_REGION=us-east-2 \
    -e "AWS_ACCESS_KEY_ID=AKIA4F3AS3PBLJQMD2V2" \
    -e "AWS_SECRET_ACCESS_KEY=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" \
    ghcr.io/ajbouh/plane-data-substratefs:latest \
    --upstream-socket /var/run/docker.sock \
    --filename /var/run/sockguard/sockguard.sock \
    --create-stub-prefix s3://mieco-dev-adamb-us-east-2/1/create/stubs





mkdir -p /mnt/test && fuse_sqlfs -d /mnt/test &
fuse_sqlfs_replicated /tmp/fsdata /mnt/test
echo 1 > /mnt/test/f

# pascal
DRONE_IP=100.81.145.66

# 8xa100
DRONE_IP=100.118.203.118

export LITESTREAM_ACCESS_KEY_ID="AKIA4F3AS3PBLJQMD2V2"
export LITESTREAM_SECRET_ACCESS_KEY="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"

docker build . -t ghcr.io/ajbouh/plane-mount && \
docker push ghcr.io/ajbouh/plane-mount:latest && \
ssh -t $DRONE_IP \
  sudo docker run --rm -it \
    --pull=always \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /var/run/sockguard:/var/run/sockguard \
    -e AWS_REGION=us-east-2 \
    -e "AWS_ACCESS_KEY_ID=AKIA4F3AS3PBLJQMD2V2" \
    -e "AWS_SECRET_ACCESS_KEY=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" \
    --mount type=bind,source=/mnt/sqlfs,target=/mnt/sqlfs,bind-propagation=shared \
    --cap-add SYS_ADMIN \
    --device /dev/fuse \
    --security-opt apparmor:unconfined \
    ghcr.io/ajbouh/plane-mount:latest \
    --upstream-socket /var/run/docker.sock \
    --filename /var/run/sockguard/sockguard.sock \
    --litestream-replication-prefix s3://mieco-dev-adamb-us-east-2/1/sqlfs/replicas \
    --create-stub-prefix s3://mieco-dev-adamb-us-east-2/1/create/stubs

docker push ghcr.io/ajbouh/plane-mount:latest

cd ~/hacking/mieco-engine-room/infra/http-file-server && \
docker build . -t ghcr.io/ajbouh/plane-browse-data:latest && \
../cluster0/jamsocket.sh push browse-data ghcr.io/ajbouh/plane-browse-data:latest


cd ~/hacking/mieco-engine-room/infra/http-file-server && \
docker build . -t ghcr.io/ajbouh/plane-browse-data:latest && \
docker run --rm -it -p 8080:8080 ghcr.io/ajbouh/plane-browse-data:latest


cd ~/hacking/mieco-engine-room/infra/jamsocket-jupyter-notebook && \
docker build . -t ghcr.io/ajbouh/plane-nb:latest && \
../cluster0/jamsocket.sh push nb-test ghcr.io/ajbouh/plane-nb:latest

docker build . -t ghcr.io/ajbouh/plane-nb:latest && \
../cluster0/jamsocket.sh push nb-test ghcr.io/ajbouh/plane-nb:latest



docker build . \
  -t ghcr.io/ajbouh/plane-mount \
  && \
  docker run \
    --rm \
    -it \
    --cap-add SYS_ADMIN \
    --device /dev/fuse \
    ghcr.io/ajbouh/plane-mount /bin/bash

env \
  JAMSOCKET_SERVER_API=https://api.jamsocket.xyz \
  JAMSOCKET_SERVER_TOKEN='LSDyCaTNAxiSFe0a.YOteb7ELwNh9KTn1EDyBJojVk2UmO2' \
  JAMSOCKET_SERVER_ACCOUNT='adamb' \
  JAMSOCKET_SPAWN_STUBS_URL_PREFIX=s3://mieco-dev-adamb-us-east-2/1/create/stubs \
  AWS_ACCESS_KEY_ID='AKIA4F3AS3PBLJQMD2V2' \
  AWS_SECRET_ACCESS_KEY='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' \
  AWS_REGION=us-east-2 \
  npm run dev



docker build . -t ghcr.io/ajbouh/plane-service-proxy && \
  docker run --rm \
    -e "JAMSOCKET_SERVER_API=https://api.jamsocket.xyz" \
    -e "JAMSOCKET_SERVER_TOKEN=LSDyCaTNAxiSFe0a.YOteb7ELwNh9KTn1EDyBJojVk2UmO2" \
    -e "JAMSOCKET_SERVER_ACCOUNT=adamb" \
    -p '8080:8080' \
    ghcr.io/ajbouh/plane-service-proxy