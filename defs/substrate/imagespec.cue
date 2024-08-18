package imagespec

import (
  "strings"
)

#ImageSpec: {
  image: string
  build ?: {
    dockerfile !: string
    args: {[string]: string} | *{}
    context ?: string
    target ?: string
  }

  if build != _|_ {
    #podman_build_options: strings.Join([
      "--layers",
      "--tag", image,
      "--file", build.dockerfile,
      if build.target != _|_ {
        "--target=\(build.target)",
      }
      for k, v in build.args {
        "--build-arg=\(k)=\(v)",
      }
      if build.context != _|_ {
        build.context,
      }
      if build.context == _|_ {
        ".",
      }
    ], " ")
  }
}

#DockerComposeService: {
  #imagespec: #ImageSpec

  #out: {
    if #imagespec.build != _|_ { "build": #imagespec.build }
    if #imagespec.image != _|_ { "image": #imagespec.image }
  }
}
