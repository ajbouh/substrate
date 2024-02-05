FROM docker.io/denoland/deno:distroless

WORKDIR /app
COPY images/treehouse/. /app/
RUN ["/bin/deno", "task", "build"]
ENTRYPOINT ["/bin/deno", "task", "serve"]
