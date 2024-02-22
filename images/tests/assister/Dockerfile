FROM alpine as test
RUN apk add --no-cache python3 py3-pip \
  && mkdir /venv \
  && python3 -m venv /venv \
  && /venv/bin/pip install --no-cache-dir pyyaml openai

WORKDIR /test
