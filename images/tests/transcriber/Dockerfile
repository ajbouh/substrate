FROM docker.io/library/golang:1.21 as test
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    python3 python3-pip git \
    libsndfile-dev \
  && rm -rf /var/lib/apt/lists/*  

WORKDIR /test
