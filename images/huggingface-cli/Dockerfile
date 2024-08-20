FROM alpine AS app
WORKDIR /app
RUN --mount=type=cache,target=/root/.cache/pip \
  apk add --no-cache python3 py3-pip \
  && pip install --target=/app huggingface_hub
ENTRYPOINT ["/app/bin/huggingface-cli"]

FROM scratch AS resourcedir
ARG TYPE
ARG REPO
ARG REVISION
ARG FILE
WORKDIR /huggingface
RUN \
  --mount=type=bind,source=/bin,target=/bin,from=app \
  --mount=type=bind,source=/usr,target=/usr,from=app \
  --mount=type=bind,source=/lib,target=/lib,from=app \
  --mount=type=bind,source=/app,target=/app,from=app \
  PYTHONPATH=/app \
  /app/bin/huggingface-cli \
    download \
    --repo-type=${TYPE} \
    --revision=${REVISION} \
    --cache-dir="/huggingface/cache" \
    --local-dir="/huggingface/local" \
    --local-dir-use-symlinks=True \
    ${REPO} ${FILE}
