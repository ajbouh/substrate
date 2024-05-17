# https://gitlab.com/nvidia/container-images/cuda/-/blob/master/doc/supported-tags.md
ARG CUDA_IMAGE="12.1.1-devel-ubuntu22.04"
FROM docker.io/nvidia/cuda:${CUDA_IMAGE}

RUN export DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC \
  && apt-get update \
  && apt-get install -y software-properties-common \
  && add-apt-repository -y ppa:deadsnakes/ppa \
  && apt-get update \
  && apt-get install -y --no-install-recommends \
    gcc g++ python3.11-dev \
    python3.11 python3.11-venv git \
    libtcmalloc-minimal4 libxxf86vm1 libxfixes3 libxi6 libxkbcommon0 libgl1 libxrender1 libsm6 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install the dependencies
COPY images/primer-scene/requirements.txt .
RUN python3.11 -m ensurepip \
  && pip3.11 install --no-cache-dir -r requirements.txt

# Copy the source code to the container
COPY images/primer-scene/. .

ENV PYTHONUNBUFFERED=1
# ENV LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libtcmalloc_minimal.so.4
ENTRYPOINT ["python3.11", "-m", "uvicorn", "app:app", "--host", "0.0.0.0"]
