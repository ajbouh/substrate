#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

cd $SCRIPT_DIR/../models
# https://huggingface.co/TheBloke/Airoboros-L2-13B-2.1-GGML/tree/main
wget --content-disposition "https://huggingface.co/TheBloke/Airoboros-L2-13B-2.1-GGML/resolve/main/airoboros-l2-13b-2.1.ggmlv3.Q2_K.bin?download=true"