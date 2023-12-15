package services

containerspecs: "datasette": {
  disabled: true
  build: args: VERSION: "0.64.1"
}

"lenses": "datasette": {
  disabled: true
  spawn: {}
  spawn: schema: data: type: "space"
}
