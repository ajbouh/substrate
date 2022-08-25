#!/bin/bash

set -eo pipefail
set -x

default_git_user_email="you@example.com"
default_git_user_name="Your Name"
default_git_commit_message="latest"
default_ssh_keygen_type=ed25519

default_git_branch=master
default_git_host=https://github.com
default_git_user=ajbouh
default_git_repo=$default_git_host/$default_git_user/substrate-export

config_space_tree=/spaces/config/tree

ssh_key_file=$config_space_tree/ssh/id
ssh_config_file=$config_space_tree/ssh/config

export XDG_CONFIG_HOME=$config_space_tree

git_config_quiet() {
  git >/dev/null 2>/dev/null config "$@"
}

git_export_config_init() {
  if [ ! -f $XDG_CONFIG_HOME/git/config ]; then
    mkdir -p $XDG_CONFIG_HOME/git
    touch $XDG_CONFIG_HOME/git/config
  fi

  # Lazily init global git config
  git_config_quiet --global --get user.email || git config --global user.email "$default_git_user_email"
  git_config_quiet --global --get user.name || git config --global user.name "$default_git_user_name"

  git_config_quiet --global --get export.repo || git config --global export.repo "$default_git_repo"
  git_config_quiet --global --get export.branch || git config --global export.branch "$default_git_branch"

  # Lazily init ssh key
  if [ ! -f $ssh_key_file ]; then
    mkdir -p $(dirname $ssh_key_file)
    ssh-keygen </dev/null -q \
      -N '' \
      -t $default_ssh_keygen_type \
      -f $ssh_key_file \
      -C $(git config --global --get user.email)
  fi

  # Lazily init ssh config
  if [ ! -f $ssh_config_file ]; then
    cat > $ssh_config_file <<EOF
Host $default_git_host
  User $default_git_user
  IdentityFile $ssh_key_file
EOF
  fi

  # Symlink ssh config
  mkdir -p ~/.ssh
  ln -s $ssh_config_file ~/.ssh/config
}

git_export_spaces() {
  exported_dir=$1
  git_repo=$(git config --global --get export.repo)
  git_branch=$(git config --global --get export.branch)

  git_dir=/export.git

  spaces=$(find $exported_dir -mindepth 1 -maxdepth 1 -type d)
  space_basenames=$(for space in $spaces; do echo $(basename $space); done)

  export GIT_DISCOVERY_ACROSS_FILESYSTEM=1

  # Keep our post-clone git commands simple
  git_() {
    git "--git-dir=$git_dir" "--work-tree=$exported_dir" "$@"
  }

  # https://git-scm.com/docs/git-clone#Documentation/git-clone.txt---filterltfilter-specgt
  git clone --depth=1 --filter=blob:none --no-checkout --bare "$git_repo" "$git_dir"

  cd $exported_dir

  # Populate the files we don't have
  git_ read-tree -m HEAD

  # Add the spaces that we are exporting
  git_ add --verbose --all -- $space_basenames

  # Commit if we have anything
  if ! git_ diff-index --quiet HEAD -- $space_basenames; then
    git_ commit -m "$default_git_commit_message"
    git_ push origin "+HEAD:$git_branch"
  fi
}

case "$1" in
  init)
    git_export_config_init
    shift
    exec "$@"
  ;;
  export)
    git_export_spaces /spaces/data
  ;;
esac
