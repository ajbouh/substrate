FROM docker.io/node:20.11-bookworm-slim AS base

FROM base AS deps
WORKDIR /app
COPY images/primers/package.json images/primers/package-lock.json ./
COPY images/primers/patches/. ./patches/
RUN npm install

FROM deps AS figma-fix
COPY images/primers/. .
RUN npm install --dev
ENTRYPOINT [ "node", "/app/tools/figma-fix.js"]

FROM deps AS build
COPY images/primers/. .
RUN npm run build

FROM build AS dev
ENV OBSERVABLE_TELEMETRY_DISABLE=1
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]
