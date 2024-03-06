FROM docker.io/node:20.11-bookworm-slim as dev

WORKDIR /app
COPY images/primers/package.json images/primers/package-lock.json ./
COPY images/primers/patches/. ./patches/
RUN npm install
COPY images/primers/. .
RUN npm run build
ENV OBSERVABLE_TELEMETRY_DISABLE=1
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]
