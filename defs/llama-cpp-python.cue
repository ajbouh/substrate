package defs

enable: "llama-cpp-python-cpu": true
enable: "llama-cpp-python-cuda": true

imagespecs: "llama-cpp-python-cpu": {
    build: dockerfile: "images/llama-cpp-python/Dockerfile.cpu"
}

imagespecs: "llama-cpp-python-cuda": {
    build: dockerfile: "images/llama-cpp-python/Dockerfile.cuda"
}

if system.#cuda_memory_total_mb > 0 {
    images: "llama-cpp-python": imagespecs["llama-cpp-python-cuda"].image
}

if system.#cuda_memory_total_mb == 0 {
    images: "llama-cpp-python": imagespecs["llama-cpp-python-cpu"].image
}
