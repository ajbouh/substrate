#!/bin/sh

set -ex

MARKER=.firstrun
NOTEBOOK=
DATA=/spaces/data

if ! [ -e $DATA/$MARKER ]; then
  mkdir -p $DATA
  if [ -n "$JAMSOCKET_DATA_IMPORT_URL" ]; then
    NOTEBOOK="index.ipynb"
    curl $JAMSOCKET_DATA_IMPORT_URL > $DATA/$NOTEBOOK
  elif [ -n "$JAMSOCKET_DATA_GIT_CLONE_URL" ]; then
    git clone $JAMSOCKET_DATA_GIT_CLONE_URL $DATA/.
  else
    NOTEBOOK="index.ipynb"
    cp -R /content/data/. $DATA/
  fi

  # Save notebook name so we know what to load on next start.
  echo $NOTEBOOK > $DATA/$MARKER
else
  NOTEBOOK=$(cat $DATA/$MARKER)
fi

export HF_DATASETS_CACHE=/cache/huggingface/datasets
mkdir -p ${HF_DATASETS_CACHE}

export HUGGINGFACE_HUB_CACHE=/cache/huggingface/hub
mkdir -p ${HUGGINGFACE_HUB_CACHE}

export HF_HOME=/cache/huggingface
mkdir -p ${HF_HOME}

cd $DATA/

export JUPYTER_CONFIG_DIR=/content/jupyterconfig

# https://github.com/jupyter/jupyter_core/blob/main/jupyter_core/paths.py
export JUPYTER_DATA_DIR=$DATA/.jupyter/data
mkdir -p $JUPYTER_DATA_DIR

# if [ -n $JAMSOCKET_IFRAME_DOMAIN ]; then
#   # to embed jupyter lab in an iframe ...
#   echo "c.ServerApp.tornado_settings = {'headers': {'Content-Security-Policy': 'frame-ancestors \'self\' ${JAMSOCKET_IFRAME_DOMAIN};'}}" >> $JUPYTER_CONFIG_DIR/jupyter_lab_config.py
# fi

if [ -n "$NOTEBOOK" ]; then
  echo "c.NotebookApp.default_url = '$SUBSTRATE_URL_PREFIX/retro/notebooks/${NOTEBOOK}'" >> $JUPYTER_CONFIG_DIR/jupyter_lab_config.py
fi

jupyverse \
  --set auth.mode=noauth \
  --set "frontend.base_url=${SUBSTRATE_URL_PREFIX}/" \
  --allow-origin=$ORIGIN \
  --host=0.0.0.0 \
  --port=$PORT
