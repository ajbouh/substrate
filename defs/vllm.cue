package defs

enable: "vllm-cuda": true

imagespecs: "vllm-cuda": {
    build: dockerfile: "images/vllm/Dockerfile.cuda"
}

if system.#cuda_memory_total_mb > 0 {
    images: "vllm": imagespecs["vllm-cuda"].image
}

images: "vllm": imagespecs["vllm-cuda"].image
