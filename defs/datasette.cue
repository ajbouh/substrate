package defs

enable: "datasette": false

imagespecs: "datasette": {
  build: args: VERSION: "0.64.1"
}

services: "datasette": {
  instances: [string]: {}
  instance: schema: data: type: "space"
}
