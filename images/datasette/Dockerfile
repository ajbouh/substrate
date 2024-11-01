FROM python:3.12-bookworm AS build

# Version of Datasette to install, e.g. 0.55
#   docker build . -t datasette --build-arg VERSION=0.55
ARG VERSION


RUN echo "deb http://deb.debian.org/debian trixie main" >>/etc/apt/sources.list && \
    set -x && apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y libsqlite3-dev/trixie

RUN pip install \
        https://github.com/simonw/datasette/archive/refs/tags/${VERSION}.zip \
        sqlite-vec==0.1.4a2 && \
    datasette install datasette-sqlite-vec && \
    find /usr/local/lib -name '__pycache__' | xargs rm -r && \
    rm -rf /root/.cache/pip

WORKDIR /app
COPY images/datasette/run.sh .

CMD ["/app/run.sh"]
