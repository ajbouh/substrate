package defs

enable: "vllm-cuda": true

imagespecs: "vllm-cuda": {
    build: dockerfile: "images/vllm/Dockerfile.cuda"
}

if system.#cuda_memory_total_mb > 0 {
    image_tags: "vllm": imagespecs["vllm-cuda"].image
}

image_tags: "vllm": imagespecs["vllm-cuda"].image
