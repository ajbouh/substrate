# https://gitlab.com/nvidia/container-images/cuda/-/blob/master/doc/supported-tags.md
ARG CUDA_IMAGE="11.8.0-cudnn8-runtime-ubuntu22.04"
FROM docker.io/nvidia/cuda:${CUDA_IMAGE}

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    gcc g++ python3-dev \
    python3 python3-pip git \
    espeak-ng \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install the dependencies
COPY images/styletts2/requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip \
  pip install -r requirements.txt

# Copy the source code to the container
COPY images/styletts2/. .

ENV PYTHONUNBUFFERED=1
ENTRYPOINT ["uvicorn", "app:app", "--host", "0.0.0.0"]
