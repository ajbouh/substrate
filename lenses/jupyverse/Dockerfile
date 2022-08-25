FROM alpine:latest as quartofetch
ARG QUARTO_VERSION="1.2.335"
ARG QUARTO_URL="https://github.com/quarto-dev/quarto-cli/releases/download/v${QUARTO_VERSION}/quarto-${QUARTO_VERSION}-linux-amd64.deb"
WORKDIR /
RUN wget -O quarto.deb ${QUARTO_URL}

FROM pytorch/pytorch:1.13.1-cuda11.6-cudnn8-runtime as quarto
COPY --from=quartofetch /quarto.deb ./
RUN dpkg -x quarto*.deb /

FROM pytorch/pytorch:1.13.1-cuda11.6-cudnn8-runtime as dist

RUN apt update && \
  apt install -y -V --no-install-recommends \
  git wget && \
  apt clean && \
  rm -rf /var/lib/apt/lists/*

COPY --from=quarto /opt/quarto /opt/quarto
ENV PATH /opt/conda/bin:/opt/quarto/bin:$PATH

WORKDIR /content
COPY lenses/jupyverse/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY lenses/jupyverse/run.sh .
COPY lenses/jupyverse/jupyterconfig /content/jupyterconfig

WORKDIR /content/data
COPY lenses/jupyverse/data .

CMD ["/opt/conda/bin/conda", "run", "-n", "base", "/content/run.sh"]
