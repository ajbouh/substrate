## Substrate container images

Each subdirectory in this folder at least one container image.

The images are used for:
- dynamically-loaded services in Substrate
- always-running daemons in SubstrateOS
- build tools

## Dynamically loaded services in Substrate

Substrate dynamically loads services to satisfy requests for these subsystems:

- `/gw/:service/*rest`

Containers are started with a `PORT` environment variable. Substrate polls this port until it accepts a connection. After that, all requests for this service will be reverse proxied to this container.

### `/gw/:service/*rest`
This is the generic gateway. It starts a single instance of a backing service to serve incoming requests.

1. Buffer incoming request.
2. Canonicalize the service identifier, look up instance.
3. If we have an instance, proxy traffic to it (stripping the `/gw/:service` prefix from the URL path)
4. If the instance is gone or something goes wrong, pretend we never had one
5. If we don't have one, start one, proxy this request to it and remember it for future requests.

To add a service named `foo`:

1. Create a Dockerfile at `images/foo/Dockerfile`.
2. If you have any `COPY` commands in your `Dockerfile`, be sure they are relative to the repository root. For example `COPY images/foo/. /work/`.
2. Add any additional files required by your `Dockerfile` to `images/foo`.
3. Create a `defs/foo.cue` file like this:

    ```
    package defs

    enable: "foo": true

    imagespecs: "foo": {}

    lenses: "foo": {
        spawn: {
            environment: {
                SOME_VARIABLE: "some_value"
            }
        }
    }
    ```

4. Run `./dev.sh systemd-reload` or `./remote ./dev.sh systemd-reload`
5. Visit https://substrate.home.arpa/gw/foo/
