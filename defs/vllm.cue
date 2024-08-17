package defs

enable: "vllm": true
enable: "vllm-cuda": true

imagespecs: "vllm-cuda": {
    image: "\(#var.image_prefix)vllm-cuda"
    build: dockerfile: "images/vllm/Dockerfile.cuda"
}

if system.#cuda_memory_total_mb > 0 {
    imagespecs: "vllm": imagespecs["vllm-cuda"]
}

imagespecs: "vllm": imagespecs["vllm-cuda"]
