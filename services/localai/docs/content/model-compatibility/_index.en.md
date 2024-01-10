
+++
disableToc = false
title = "Model compatibility"
weight = 4
+++

LocalAI is compatible with the models supported by [llama.cpp](https://github.com/ggerganov/llama.cpp) supports also [GPT4ALL-J](https://github.com/nomic-ai/gpt4all) and [cerebras-GPT with ggml](https://huggingface.co/lxe/Cerebras-GPT-2.7B-Alpaca-SP-ggml).

{{% notice note %}}

LocalAI will attempt to automatically load models which are not explicitly configured for a specific backend. You can specify the backend to use by configuring a model with a YAML file. See [the advanced section]({{%relref "advanced" %}}) for more details.

{{% /notice %}}

### Hardware requirements

Depending on the model you are attempting to run might need more RAM or CPU resources. Check out also [here](https://github.com/ggerganov/llama.cpp#memorydisk-requirements) for `gguf` based backends. `rwkv` is less expensive on resources.

### Model compatibility table

Besides llama based models, LocalAI is compatible also with other architectures. The table below lists all the compatible models families and the associated binding repository.

| Backend and Bindings                                                             | Compatible models     | Completion/Chat endpoint | Capability | Embeddings support                | Token stream support | Acceleration |
|----------------------------------------------------------------------------------|-----------------------|--------------------------|---------------------------|-----------------------------------|----------------------|--------------|
| [llama.cpp]({{%relref "model-compatibility/llama-cpp" %}})        | Vicuna, Alpaca, LLaMa | yes                      | GPT and Functions                        | yes** | yes                  | CUDA, openCL, cuBLAS, Metal |
| [gpt4all-llama](https://github.com/nomic-ai/gpt4all)      | Vicuna, Alpaca, LLaMa | yes                      | GPT                        | no                                | yes                  | N/A  |
| [gpt4all-mpt](https://github.com/nomic-ai/gpt4all)          | MPT                   | yes                      | GPT                        | no                                | yes                  | N/A  |
| [gpt4all-j](https://github.com/nomic-ai/gpt4all)           | GPT4ALL-J             | yes                      | GPT                        | no                                | yes                  | N/A  |
| [falcon-ggml](https://github.com/ggerganov/ggml) ([binding](https://github.com/go-skynet/go-ggml-transformers.cpp))        | Falcon (*)             | yes                      | GPT                        | no                                | no                   | N/A |
| [gpt2](https://github.com/ggerganov/ggml) ([binding](https://github.com/go-skynet/go-ggml-transformers.cpp))             | GPT2, Cerebras    | yes                      | GPT                        | no                                | no                   | N/A |
| [dolly](https://github.com/ggerganov/ggml) ([binding](https://github.com/go-skynet/go-ggml-transformers.cpp))            | Dolly                 | yes                      | GPT                        | no                                | no                   | N/A |
| [gptj](https://github.com/ggerganov/ggml) ([binding](https://github.com/go-skynet/go-ggml-transformers.cpp))        | GPTJ             | yes                      | GPT                        | no                                | no                   | N/A |
| [mpt](https://github.com/ggerganov/ggml) ([binding](https://github.com/go-skynet/go-ggml-transformers.cpp))         | MPT     | yes                      | GPT                        | no                                | no                   | N/A |
| [replit](https://github.com/ggerganov/ggml) ([binding](https://github.com/go-skynet/go-ggml-transformers.cpp))        | Replit             | yes                      | GPT                        | no                                | no                   | N/A |
| [gptneox](https://github.com/ggerganov/ggml) ([binding](https://github.com/go-skynet/go-ggml-transformers.cpp))        | GPT NeoX, RedPajama, StableLM             | yes                      | GPT                        | no                                | no                   | N/A |
| [starcoder](https://github.com/ggerganov/ggml) ([binding](https://github.com/go-skynet/go-ggml-transformers.cpp))        | Starcoder             | yes                      | GPT                        | no                                | no                   | N/A|
| [bloomz](https://github.com/NouamaneTazi/bloomz.cpp) ([binding](https://github.com/go-skynet/bloomz.cpp))       | Bloom                 | yes                      | GPT                        | no                                | no                   | N/A |
| [rwkv](https://github.com/saharNooby/rwkv.cpp) ([binding](https://github.com/donomii/go-rwkv.cpp))       | rwkv                 | yes                      | GPT                        | no                                | yes                   | N/A  |
| [bert](https://github.com/skeskinen/bert.cpp) ([binding](https://github.com/go-skynet/go-bert.cpp)) | bert                  | no                       | Embeddings only                  | yes                               | no                   | N/A |
| [whisper](https://github.com/ggerganov/whisper.cpp)         | whisper               | no                       | Audio                 | no                                | no                   | N/A |
| [stablediffusion](https://github.com/EdVince/Stable-Diffusion-NCNN) ([binding](https://github.com/mudler/go-stable-diffusion))        | stablediffusion               | no                       | Image                 | no                                | no                   | N/A |
| [langchain-huggingface](https://github.com/tmc/langchaingo)                                                                    | Any text generators available on HuggingFace through API | yes                      | GPT                        | no                                | no                   | N/A |
| [piper](https://github.com/rhasspy/piper) ([binding](https://github.com/mudler/go-piper))                                                                     | Any piper onnx model | no                      | Text to voice                        | no                                | no                   | N/A |
| [falcon](https://github.com/cmp-nct/ggllm.cpp/tree/c12b2d65f732a0d8846db2244e070f0f3e73505c) ([binding](https://github.com/mudler/go-ggllm.cpp))                                                                      | Falcon *** | yes                      | GPT                        | no                                | yes                   | CUDA |
| [sentencetransformers](https://github.com/UKPLab/sentence-transformers) | BERT                   | no                       | Embeddings only                  | yes                               | no                   | N/A |
| `bark`  | bark                   | no                       | Audio generation                  | no                               | no                   | yes |
| `autogptq` | GPTQ                   | yes                       | GPT                  | yes                               | no                   | N/A |
| `exllama`  | GPTQ                   | yes                       | GPT only                  | no                               | no                   | N/A |
| `diffusers`  | SD,...                   | no                       | Image generation    | no                               | no                   | N/A |
| `vall-e-x` | Vall-E    | no                       | Audio generation and Voice cloning    | no                               | no                   | CPU/CUDA |
| `vllm` | Various GPTs and quantization formats | yes                      | GPT             | no | no                  | CPU/CUDA |
| `exllama2`  | GPTQ                   | yes                       | GPT only                  | no                               | no                   | N/A |
| `transformers-musicgen`  |                    | no                       | Audio generation                | no                               | no                   | N/A |
| [tinydream](https://github.com/symisc/tiny-dream#tiny-dreaman-embedded-header-only-stable-diffusion-inference-c-librarypixlabiotiny-dream)         | stablediffusion               | no                       | Image                 | no                                | no                   | N/A |
| `coqui` | Coqui    | no                       | Audio generation and Voice cloning    | no                               | no                   | CPU/CUDA |
| `petals` | Various GPTs and quantization formats | yes                      | GPT             | no | no                  | CPU/CUDA |

Note: any backend name listed above can be used in the `backend` field of the model configuration file (See [the advanced section]({{%relref "advanced" %}})).

- \* 7b ONLY
- ** doesn't seem to be accurate
- *** 7b and 40b with the `ggccv` format, for instance: https://huggingface.co/TheBloke/WizardLM-Uncensored-Falcon-40B-GGML

Tested with:

- [X] Automatically by CI with OpenLLAMA and GPT4ALL.
- [X] LLaMA 🦙
- [X] [Vicuna](https://github.com/ggerganov/llama.cpp/discussions/643#discussioncomment-5533894)
- [Alpaca](https://github.com/ggerganov/llama.cpp#instruction-mode-with-alpaca)
- [X] [GPT4ALL](https://gpt4all.io) (see also [using GPT4All](https://github.com/ggerganov/llama.cpp#using-gpt4all))
- [X] [GPT4ALL-J](https://gpt4all.io/models/ggml-gpt4all-j.bin) (no changes required)
- [X] [Koala](https://bair.berkeley.edu/blog/2023/04/03/koala/) 🐨
- [X] Cerebras-GPT
- [X] [WizardLM](https://github.com/nlpxucan/WizardLM)
- [X] [RWKV](https://github.com/BlinkDL/RWKV-LM) models with [rwkv.cpp](https://github.com/saharNooby/rwkv.cpp)
- [X] [bloom.cpp](https://github.com/NouamaneTazi/bloomz.cpp)
- [X] [Chinese LLaMA / Alpaca](https://github.com/ymcui/Chinese-LLaMA-Alpaca)
- [X] [Vigogne (French)](https://github.com/bofenghuang/vigogne)
- [X] [OpenBuddy 🐶 (Multilingual)](https://github.com/OpenBuddy/OpenBuddy)
- [X] [Pygmalion 7B / Metharme 7B](https://github.com/ggerganov/llama.cpp#using-pygmalion-7b--metharme-7b)
- [X] [HuggingFace Inference](https://huggingface.co/inference-api) models available through API
- [X] Falcon

Note: You might need to convert some models from older models to the new format, for indications, see [the README in llama.cpp](https://github.com/ggerganov/llama.cpp#using-gpt4all) for instance to run `gpt4all`.
