# https://gitlab.com/nvidia/container-images/cuda/-/blob/master/doc/supported-tags.md
ARG CUDA_IMAGE="12.2.2-cudnn8-runtime-ubuntu22.04"
FROM docker.io/nvidia/cuda:${CUDA_IMAGE}

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    python3 python3-pip git \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install the dependencies
COPY images/faster-whisper/requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip \
  pip install -r requirements.txt

# Copy the source code to the container
COPY images/faster-whisper/. .

ENV PYTHONUNBUFFERED=1
ENTRYPOINT ["fastapi", "dev", "/app/app.py", "--host", "0.0.0.0"]
