package defs

enable: "datasette": false

imagespecs: "datasette": {
  build: args: VERSION: "0.64.1"
}

services: "datasette": {
  spawn: {}
  spawn: schema: data: type: "space"
}
