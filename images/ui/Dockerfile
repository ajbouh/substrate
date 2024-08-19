FROM docker.io/node:18-alpine3.18 AS node
ENV NPM_CONFIG_UPDATE_NOTIFIER false

FROM node AS deps

WORKDIR /app
COPY images/ui/patches ./patches
COPY images/ui/package.json images/ui/package-lock.json ./
RUN npm i

FROM deps AS build
COPY images/ui/src ./src
COPY images/ui/static ./static
COPY images/ui/*.sh images/ui/*.js images/ui/*.json images/ui/*.cjs images/ui/.npmrc ./
RUN npm run build

FROM node AS dev
WORKDIR /app
RUN apk update && apk add ca-certificates && rm -rf /var/cache/apk/*
COPY --from=deps /app/ ./
COPY images/ui/*.sh images/ui/*.js images/ui/*.json images/ui/*.cjs images/ui/.npmrc ./

ENTRYPOINT ["npm", "run", "dev", "--", "--host=0.0.0.0"]

FROM node AS dist
WORKDIR /app
RUN apk update && apk add --no-cache ca-certificates && rm -rf /var/cache/apk/*
COPY --from=build /app/package.json ./
RUN npm i --omit=dev
COPY --from=build /app/build ./
COPY images/ui/run.sh ./

ENTRYPOINT ["/app/run.sh"]
