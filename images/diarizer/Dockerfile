# https://gitlab.com/nvidia/container-images/cuda/-/blob/master/doc/supported-tags.md
ARG CUDA_IMAGE="12.2.2-cudnn8-runtime-ubuntu22.04"
FROM docker.io/nvidia/cuda:${CUDA_IMAGE}

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  python3 python3-pip git \
  libsndfile-dev \
  && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the source code to the container
COPY images/diarizer/requirements.txt .

# Install the dependencies
RUN --mount=type=cache,target=/root/.cache/pip \
  pip install -r requirements.txt

# Copy the source code to the container
COPY images/diarizer/. /app

RUN python3 /app/model_download.py

ENV PYTHONUNBUFFERED=1
ENTRYPOINT ["fastapi", "dev", "/app/app.py", "--host", "0.0.0.0"]
