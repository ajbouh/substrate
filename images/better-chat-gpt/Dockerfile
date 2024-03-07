FROM node:alpine

RUN addgroup -S appgroup && \
  adduser -S appuser -G appgroup && \
  mkdir -p /home/appuser/app && \
  chown appuser:appgroup /home/appuser/app
USER appuser

RUN yarn config set prefix ~/.yarn && \
  yarn global add serve

WORKDIR /home/appuser/app
COPY --chown=appuser:appgroup images/better-chat-gpt/package.json images/better-chat-gpt/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY --chown=appuser:appgroup images/better-chat-gpt/. .
RUN yarn build

ARG VITE_DEFAULT_SYSTEM_MESSAGE
ENV VITE_DEFAULT_SYSTEM_MESSAGE=${VITE_DEFAULT_SYSTEM_MESSAGE}
ARG VITE_OPENAI_API_KEY
ENV VITE_OPENAI_API_KEY=${VITE_OPENAI_API_KEY}
ARG VITE_DEFAULT_API_ENDPOINT
ENV VITE_DEFAULT_API_ENDPOINT=${VITE_DEFAULT_API_ENDPOINT}

EXPOSE 8080
CMD ["/home/appuser/.yarn/bin/serve", "-s", "dist", "-l", "8080"]
