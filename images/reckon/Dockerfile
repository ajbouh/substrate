FROM docker.io/node:20.11-bookworm-slim as dev

WORKDIR /app
COPY images/reckon/package.json images/reckon/package-lock.json ./
COPY images/reckon/patches/. ./patches/
RUN npm install
COPY images/reckon/. .
RUN npm run build
ENV OBSERVABLE_TELEMETRY_DISABLE=1
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]
