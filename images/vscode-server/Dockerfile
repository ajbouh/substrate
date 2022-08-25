FROM docker.io/codercom/code-server:latest

USER root
RUN sudo apt-get update \
  && apt-get install -y \
    podman \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /home/workspace
ENTRYPOINT ["/usr/bin/entrypoint.sh"]
