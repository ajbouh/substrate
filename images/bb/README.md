<center><h1><code>bb</code></h1></center>

## What is it?

`bb` is a service just like any other service in substrate. It is lazily spawned on first request.

When it receives a request, `bb` looks at the current set of defs it has and finds all services that might serve matching requests. It issues requests back to substrate for all of them. By default, the first valid response is returned to the requester.

## Why is it?

The world of AI models moves very quickly. Sometimes a new model is announced that obsoletes everything else out there. Sometimes someone discovers a new way to use an existing model. Other times someone discovers how to distill a giant model into a relatively tiny execution environment.

This changing landscape makes it hard to build applications that are both maintainable and continue to benefit from the state of the art.

`bb` provides a stable API to build on top of todays models *and* models that don't exist yet.

Applications that use `bb` can be shifted to use the latest models and model inference techniques without needing to be modified.

`TODO give an example`

Since matches are based on a short, JSON-like syntax, it is reasonable to expect the system itself to generate possible matches.

`TODO give an example`

## How does it work?

There's an endpoint inside of substrate at `/substrate/v1/defs`. This endpoint is formatted as a `text/event-stream` and emits data every time any substrate def changes. That data contains a large JSON object of all the .cue files that define the substrate defs.

When it boots, `bb` subscribes to `/substrate/v1/defs`, evaluates them on each update, and uses that for all new incoming requests. Note that it waits for the first def announcement before it serves any requests.


## How is it used?

`TODO`
