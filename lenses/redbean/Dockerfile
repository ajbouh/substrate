FROM alpine:latest as build

ARG DOWNLOAD_FILENAME=redbean-original-2.2.com

RUN apk add --no-cache --update zip bash
RUN wget https://redbean.dev/${DOWNLOAD_FILENAME} -O redbean.com
RUN chmod +x redbean.com

# Drop the runtime requirement for bash
RUN sh /redbean.com --assimilate

FROM scratch

COPY --from=build /redbean.com /
# HACK we are relying on the fact that redbean defaults to 8080
CMD ["/redbean.com", "-vv"]
