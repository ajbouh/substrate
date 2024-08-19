FROM docker.io/node:20.11-bookworm-slim AS dev

WORKDIR /app
COPY images/bb-ui/package.json images/bb-ui/package-lock.json ./
COPY images/bb-ui/patches/. ./patches/
RUN npm install
COPY images/bb-ui/. .
RUN npm run build
ENV OBSERVABLE_TELEMETRY_DISABLE=1
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]
