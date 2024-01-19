# https://gitlab.com/nvidia/container-images/cuda/-/blob/master/doc/supported-tags.md
ARG CUDA_IMAGE="11.8.0-cudnn8-runtime-ubuntu22.04"
FROM docker.io/nvidia/cuda:${CUDA_IMAGE}

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    python3 python3-pip git \
    libsndfile-dev \
  && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the container
COPY services/asr-faster-whisper/requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the source code to the container
COPY services/asr-faster-whisper/. .
COPY pkg/asr substrate/asr

# Expose the port on which the application will run (default is 8080)
EXPOSE 8080
ENV PYTHONUNBUFFERED=1

# Start the application with Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]
