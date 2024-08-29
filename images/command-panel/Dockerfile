FROM docker.io/node:18-alpine3.18 AS node
ENV NPM_CONFIG_UPDATE_NOTIFIER false

FROM node AS deps

WORKDIR /app
COPY images/command-panel/package.json images/command-panel/package-lock.json ./
RUN npm i

FROM deps AS build
COPY images/command-panel/src ./src
COPY images/command-panel/static ./static
COPY images/command-panel/*.sh images/command-panel/*.js images/command-panel/*.ts images/command-panel/*.json images/command-panel/*.cjs images/command-panel/.npmrc ./
RUN npm run build

FROM node AS dev
WORKDIR /app
RUN apk update && apk add ca-certificates && rm -rf /var/cache/apk/*
COPY --from=deps /app/ ./
COPY --from=build /app/.svelte-kit/__package__ ./.svelte-kit/__package__
COPY images/command-panel/*.sh images/command-panel/*.js images/command-panel/*.ts images/command-panel/*.json images/command-panel/*.cjs images/command-panel/.npmrc ./

ENTRYPOINT ["npm", "run", "dev", "--", "--host=0.0.0.0"]

FROM dev AS dist
# FROM node AS dist
# WORKDIR /app
# RUN apk update && apk add --no-cache ca-certificates && rm -rf /var/cache/apk/*
# COPY --from=build /app/package.json ./
# RUN npm i --omit=dev
# COPY --from=build /app/build ./
# COPY images/command-panel/run.sh ./

# ENTRYPOINT ["/app/run.sh"]

# ENTRYPOINT ["npm", "run", "preview", "--", "--host=0.0.0.0"]
