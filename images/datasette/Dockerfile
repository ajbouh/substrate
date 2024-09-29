FROM python:3.11-alpine AS build

# Version of Datasette to install, e.g. 0.55
#   docker build . -t datasette --build-arg VERSION=0.55
ARG VERSION


RUN pip install https://github.com/simonw/datasette/archive/refs/tags/${VERSION}.zip && \
    find /usr/local/lib -name '__pycache__' | xargs rm -r && \
    rm -rf /root/.cache/pip

WORKDIR /app
COPY images/datasette/run.sh .

CMD ["/app/run.sh"]
