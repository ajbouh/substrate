package dev

enable: "datasette": false

imagespecs: "datasette": {
  build: args: VERSION: "0.64.1"
}

"lenses": "datasette": {
  spawn: {}
  spawn: schema: data: type: "space"
}
