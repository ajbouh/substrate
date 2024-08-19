FROM docker.io/node:18-alpine3.18 AS node

FROM node AS deps

WORKDIR /app
COPY images/visualizer/package.json ./
RUN npm i

FROM deps AS build
COPY images/visualizer/src ./src
COPY images/visualizer/*.json ./
RUN npm run build

FROM node AS dist
WORKDIR /
RUN apk update && apk add --no-cache ca-certificates && rm -rf /var/cache/apk/*
COPY --from=build /app/package.json /app/
COPY --from=build /app/index.js /app/

ENTRYPOINT ["node", "/app/index.js"]
