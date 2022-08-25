package lens

name: "git-export"

spawn: schema: {
  config: {
    type: "space"
  }
  data: {
    type: "spaces"
    optional: true
  }
}

activities: {
  export: {
    activity: "user:collection:space"
    label: "export spaces to git repository"
    // description: string

    request: {
      path: "/runs/export/"
      method: "POST"
    }
  }
  init: {
    activity: "user:collection:space"
    label: "set up config space for git export"
    // description: string

    request: {
      path: "/runs/init/"
      method: "POST"
    }
  }
}
