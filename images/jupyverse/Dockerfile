FROM docker.io/library/alpine:latest as quartofetch
ARG QUARTO_VERSION="1.5.7"
ARG QUARTO_URL="https://github.com/quarto-dev/quarto-cli/releases/download/v${QUARTO_VERSION}/quarto-${QUARTO_VERSION}-linux-amd64.deb"
WORKDIR /
RUN wget -O quarto.deb ${QUARTO_URL}

# FROM docker.io/pytorch/pytorch:2.2.0-cuda12.1-cudnn8-runtime as quarto
# COPY --from=quartofetch /quarto.deb ./
# RUN dpkg -x quarto*.deb /

# FROM docker.io/pytorch/pytorch:2.2.0-cuda12.1-cudnn8-runtime as dist
# ENV PATH /opt/conda/bin:/opt/quarto/bin:$PATH
# CMD ["/opt/conda/bin/conda", "run", "-n", "base", "/content/run.sh"]

FROM docker.io/python:3.11-bookworm as quarto
COPY --from=quartofetch /quarto.deb ./
RUN dpkg -x quarto*.deb /

FROM docker.io/python:3.11-bookworm as dist
ENV PATH /opt/quarto/bin:$PATH

RUN apt update && \
  apt install -y -V --no-install-recommends \
  git wget && \
  apt clean && \
  rm -rf /var/lib/apt/lists/*

COPY --from=quarto /opt/quarto /opt/quarto

WORKDIR /content
COPY images/jupyverse/requirements.jupyverse.txt .
RUN pip install --no-cache-dir -r requirements.jupyverse.txt

COPY images/jupyverse/run.sh .
COPY images/jupyverse/jupyterconfig /content/jupyterconfig

WORKDIR /content/data
COPY images/jupyverse/data .

ENV PYTHONUNBUFFERED=1
CMD ["/content/run.sh"]
