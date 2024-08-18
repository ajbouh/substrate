## Substrate container images

Each subdirectory in this folder at least one container image.

The images are used for:
- dynamically-loaded services in Substrate
- always-running daemons in SubstrateOS
- build tools

## Dynamically loaded services in Substrate

Substrate dynamically loads services to satisfy incoming HTTP requests. Any traffic that arrives is parsed according to this pattern: `/:service/*rest`.

Consider the URL `/foo/bar`. Substrate will look in the cue files in the top-level `defs/` directory. It will use the value of `services.foo` to determine what container image, command, environment variables, and volume mounts to set.

If Substrate hasn't already started a matching container, it will launch a new one.

Containers are started with a `PORT` environment variable. Substrate polls this port until it accepts a connection. After that, all requests for this service will be reverse proxied to this container.

The general algorithm Substrate uses is:

1. Buffer incoming request.
2. Canonicalize the service identifier, look up instance.
3. If we have an instance, proxy traffic to it (stripping the `/:service` prefix from the URL path)
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

    imagespecs: "foo": {
        image: "\(#var.image_prefix)foo"
        build: dockerfile: "images/foo/Dockerfile"
    }

    services: "foo": {
        instances: [string]: {
            environment: {
                SOME_VARIABLE: "some_value"
            }
        }
    }
    ```

4. Run `./dev.sh systemd-reload` or `./remote ./dev.sh systemd-reload`
5. Visit https://substrate.home.arpa/foo/

## Persistent storage

Substrate provides a mechanism for containers to request persistent storage. This mechanism is called a "space".

Spaces can be created, checkpointed, and forked.

By default checkpoints and forks are done in the naive and O(N) way, but once we settle on a checkpointable filesystem for persistent data, they will be O(1).

### Spaces in action: an example

To see these in action, visit https://substrate.home.arpa/gotty.

You should notice you are redirected to another URL that includes a bit of text that looks like "data=sp-...". This means substrate has allocated a space and aliased it to the "data" slot in the container.

You can visit this new URL in multiple browsers and see that each connection is to the same container instance.

Anything stored in /spaces/data/tree will survive that container's restart.
