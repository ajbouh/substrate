ARG REDIS_VERSION=6.2.6
FROM redis:${REDIS_VERSION}-alpine

COPY services/redis/start-redis-server.sh /usr/bin/start-redis-server.sh

CMD ["/usr/bin/start-redis-server.sh"]
