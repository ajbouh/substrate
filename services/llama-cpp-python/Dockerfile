ARG CUDA_IMAGE="12.1.1-devel-ubuntu22.04"
FROM nvidia/cuda:${CUDA_IMAGE}

# We need to set the host to 0.0.0.0 to allow outside access
ENV HOST 0.0.0.0

RUN apt-get update && apt-get upgrade -y \
    && apt-get install -y git build-essential \
    python3 python3-pip gcc wget \
    ocl-icd-opencl-dev opencl-headers clinfo \
    libclblast-dev libopenblas-dev \
    && mkdir -p /etc/OpenCL/vendors && echo "libnvidia-opencl.so.1" > /etc/OpenCL/vendors/nvidia.icd

# Install depencencies
RUN python3 -m pip install --upgrade pip pytest cmake scikit-build setuptools fastapi uvicorn sse-starlette pydantic-settings starlette-context huggingface_hub pyyaml

COPY services/llama-cpp-python/README.md services/llama-cpp-python/pyproject.toml services/llama-cpp-python/CMakeLists.txt .
COPY services/llama-cpp-python/vendor/llama.cpp vendor/llama.cpp
COPY services/llama-cpp-python/llama_cpp llama_cpp

# setting build related env vars
ENV CUDA_DOCKER_ARCH=all
ENV LLAMA_CUBLAS=1

# HACK make a fake git repo
RUN cd vendor/llama.cpp \
    && git init . \
    && git config user.email "you@example.com" \
    && git config user.name "Your Name" \
    && git commit -m "Initial commit" --allow-empty

# Install llama-cpp-python (build with cuda)
RUN CMAKE_ARGS="-DLLAMA_CUBLAS=on" FORCE_CMAKE=1 pip install .

# Run the server
ENTRYPOINT ["python3", "-m", "llama_cpp.server"]
CMD ["--hf_model=TheBloke/Airoboros-L2-13B-2.2-GGUF/airoboros-l2-13b-2.2.Q5_K_M.gguf", "--n_gpu_layers=43"]
