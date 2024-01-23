FROM alpine as build
RUN apk add --no-cache python3 py3-pip \
  && mkdir /dist \
  && pip install --no-cache-dir --target=/dist huggingface_hub

FROM alpine as dist
RUN apk add --no-cache python3
COPY --from=build /dist /app
ENV PYTHONPATH=/app
ENTRYPOINT ["/app/bin/huggingface-cli"]
