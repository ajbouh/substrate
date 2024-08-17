package defs

enable: "llama-cpp-python": true
enable: "llama-cpp-python-cpu": true
enable: "llama-cpp-python-cuda": true

imagespecs: "llama-cpp-python-cpu": {
    image: "\(#var.image_prefix)llama-cpp-python-cpu"
    build: dockerfile: "images/llama-cpp-python/Dockerfile.cpu"
}

imagespecs: "llama-cpp-python-cuda": {
    image: "\(#var.image_prefix)llama-cpp-python-cuda"
    build: dockerfile: "images/llama-cpp-python/Dockerfile.cuda"
}

if system.#cuda_memory_total_mb > 0 {
    imagespecs: "llama-cpp-python": imagespecs["llama-cpp-python-cuda"]
}

if (system.#cuda_memory_total_mb == _|_) || (system.#cuda_memory_total_mb == 0) {
    imagespecs: "llama-cpp-python": imagespecs["llama-cpp-python-cpu"]
}
