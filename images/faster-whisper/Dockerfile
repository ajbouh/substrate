# https://gitlab.com/nvidia/container-images/cuda/-/blob/master/doc/supported-tags.md
ARG CUDA_IMAGE="11.8.0-cudnn8-runtime-ubuntu22.04"
FROM docker.io/nvidia/cuda:${CUDA_IMAGE}

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    python3 python3-pip git \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install the dependencies
COPY images/faster-whisper/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the source code to the container
COPY images/faster-whisper/. .

ENV PYTHONUNBUFFERED=1
ENTRYPOINT ["uvicorn", "app:app", "--host", "0.0.0.0"]
