package defs

enable: "vllm": true

imagespecs: "vllm": {
    image: "\(#var.image_prefix)vllm-cuda"
    build: dockerfile: "images/vllm/Dockerfile.cuda"
}
