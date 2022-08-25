# Substrate

Substrate has a small number of "always available" servers running at well known addresses. These are:
- launcher
- gateway 

All other services are assigned ephemeral hostnames that expire when the service completes its work or becomes idle.

Under the hood, substrate runs ephemeral backends via plane.

The primary user-visible abstractions in substrate are the "service" and the "workspace".

A "service" is a docker image that's been registered with substrate and can be started and retired as needed.

A "workspace" is a directory on a global filesystem (currently backed by S3 via the juicefs project)

## What are Maxwell's equations of collaborative media?

### Actions
- creating (start a new document, new repository, new post)
- forking (copy an existing document, fork an existing repository, remix someone's post)
- collections (includes favoriting, reactions)
- contributing (includes merging, commenting, reactions)
- embedding (includes importing, citing, )

### Experiences
- something i'm doing is visible to others
- something others are doing is visible to me
- someone interacted with a thing i made or did
- external evidence that something happened within the system


# Definitions
- space: (noun) a checkpointable, forkable directory on substratefs
- lens: (noun) a container that provides web UI or API based on access to zero or more spaces
- view: (noun) a composition of {0, 1} lens(es) and 0+ spaces. it may be concrete or abstract.
  - concrete view: (noun): 1 lens and 0+ spaces. it can be launched and will not create any new spaces.
  - abstract view: (noun): {0, 1} lens(es) and 0+ spaces. it may be incomplete and require additional information to be launched.
- viewspec: (noun) a string that describes concrete or abstract view
  - abstract viewspec: (noun) a string that describes an abstract view
  - contract viewspec: (noun) a string that describes a concrete view

  examples:
  ```
  somelens[foo=sp-12sdfasc] means: lens is "somelens", view named foo bound to space "sp-12sdfasc"
  somelens[foo=~sp-12sdfasc] means: lens is "somelens", view named foo bound to a fork of space "sp-12sdfasc"
  [foo=~sp-12sdfasc] means: lens is unknown, view named foo bound to a fork of space "sp-12sdfasc"
  ```

GET    /api/v1/backend/jamsocket/:backend/status/stream
GET    /api/v1/events
GET    /api/v1/lenses
GET    /api/v1/lenses/:lens
GET    /api/v1/spaces
DELETE /api/v1/spaces/:space
PATCH  /api/v1/spaces/:space
GET    /api/v1/spaces/:space
GET    /api/v1/activities
POST   /api/v1/activities
GET    /api/v1/activities/:viewspec
GET    /api/v1/collections/:owner
GET    /api/v1/collections/:owner/:name
POST   /api/v1/collections/:owner/:name/spaces
GET    /api/v1/collections/:owner/:name/spaces
DELETE /api/v1/collections/:owner/:name/spaces/:space
POST   /api/v1/collections/:owner/:name/lenses
DELETE /api/v1/collections/:owner/:name/lenses/:lensspec
GET    /api/v1/collections/:owner/:name/lensspecs

collections:

system/preview
  :space + :lensspec

system/preview
set *if not yet set* lensspec
