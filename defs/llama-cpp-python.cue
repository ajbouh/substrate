package defs

// This is disabled. We don't really have a clean end-to-end way to choose between different images based on CUDA memory.
// We *do* have a way to select between images we *already have built*, but we need a more sophisticated build process
// to ensure we build all images with *might* need. But as we don't have an immediate need for this anymore, put.

enable: "llama-cpp-python-cpu": false
enable: "llama-cpp-python-cuda": false

imagespecs: "llama-cpp-python-cpu": {
    image: "\(#var.image_prefix)llama-cpp-python-cpu"
    build: dockerfile: "images/llama-cpp-python/Dockerfile.cpu"
}

imagespecs: "llama-cpp-python-cuda": {
    image: "\(#var.image_prefix)llama-cpp-python-cuda"
    build: dockerfile: "images/llama-cpp-python/Dockerfile.cuda"
}

// if system.#cuda_memory_total_mb > 0 {
//     imagespecs: "llama-cpp-python": imagespecs["llama-cpp-python-cuda"]
// }

// if (system.#cuda_memory_total_mb == _|_) || (system.#cuda_memory_total_mb == 0) {
//     imagespecs: "llama-cpp-python": imagespecs["llama-cpp-python-cpu"]
// }
