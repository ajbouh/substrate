
+++
disableToc = false
title = "Advanced"
weight = 6
+++

### Advanced configuration with YAML files

In order to define default prompts, model parameters (such as custom default `top_p` or `top_k`), LocalAI can be configured to serve user-defined models with a set of default parameters and templates.

You can create multiple `yaml` files in the models path or either specify a single YAML configuration file. 
Consider the following `models` folder in the `example/chatbot-ui`:

```
base ❯ ls -liah examples/chatbot-ui/models 
36487587 drwxr-xr-x 2 mudler mudler 4.0K May  3 12:27 .
36487586 drwxr-xr-x 3 mudler mudler 4.0K May  3 10:42 ..
36465214 -rw-r--r-- 1 mudler mudler   10 Apr 27 07:46 completion.tmpl
36464855 -rw-r--r-- 1 mudler mudler   ?G Apr 27 00:08 luna-ai-llama2-uncensored.ggmlv3.q5_K_M.bin
36464537 -rw-r--r-- 1 mudler mudler  245 May  3 10:42 gpt-3.5-turbo.yaml
36467388 -rw-r--r-- 1 mudler mudler  180 Apr 27 07:46 chat.tmpl
```

In the `gpt-3.5-turbo.yaml` file it is defined the `gpt-3.5-turbo` model which is an alias to use `luna-ai-llama2` with pre-defined options.

For instance, consider the following that declares `gpt-3.5-turbo` backed by the `luna-ai-llama2` model:

```yaml
name: gpt-3.5-turbo
# Default model parameters
parameters:
  # Relative to the models path
  model: luna-ai-llama2-uncensored.ggmlv3.q5_K_M.bin
  # temperature
  temperature: 0.3
  # all the OpenAI request options here..

# Default context size
context_size: 512
threads: 10
# Define a backend (optional). By default it will try to guess the backend the first time the model is interacted with.
backend: llama-stable # available: llama, stablelm, gpt2, gptj rwkv

# Enable prompt caching
prompt_cache_path: "alpaca-cache"
prompt_cache_all: true

# stopwords (if supported by the backend)
stopwords:
- "HUMAN:"
- "### Response:"
# define chat roles
roles:
  assistant: '### Response:'
  system: '### System Instruction:'
  user: '### Instruction:'
template:
  # template file ".tmpl" with the prompt template to use by default on the endpoint call. Note there is no extension in the files
  completion: completion
  chat: chat
```

Specifying a `config-file` via CLI allows to declare models in a single file as a list, for instance:

```yaml
- name: list1
  parameters:
    model: testmodel
  context_size: 512
  threads: 10
  stopwords:
  - "HUMAN:"
  - "### Response:"
  roles:
    user: "HUMAN:"
    system: "GPT:"
  template:
    completion: completion
    chat: chat
- name: list2
  parameters:
    model: testmodel
  context_size: 512
  threads: 10
  stopwords:
  - "HUMAN:"
  - "### Response:"
  roles:
    user: "HUMAN:"
    system: "GPT:"
  template:
    completion: completion
   chat: chat
```

See also [chatbot-ui](https://github.com/go-skynet/LocalAI/tree/master/examples/chatbot-ui) as an example on how to use config files.

### Full config model file reference

```yaml
# Model name.
# The model name is used to identify the model in the API calls.
name: gpt-3.5-turbo

# Default model parameters.
# These options can also be specified in the API calls
parameters:
  # Relative to the models path
  model: luna-ai-llama2-uncensored.ggmlv3.q5_K_M.bin
  # temperature
  temperature: 0.3
  # all the OpenAI request options here..
  top_k: 
  top_p: 
  max_tokens:
  ignore_eos: true
  n_keep: 10
  seed: 
  mode: 
  step:
  negative_prompt:
  typical_p:
  tfz:
  frequency_penalty:
  mirostat_eta:
  mirostat_tau:
  mirostat: 
  rope_freq_base:
  rope_freq_scale:
  negative_prompt_scale:

# Default context size
context_size: 512
# Default number of threads
threads: 10
# Define a backend (optional). By default it will try to guess the backend the first time the model is interacted with.
backend: llama-stable # available: llama, stablelm, gpt2, gptj rwkv
# stopwords (if supported by the backend)
stopwords:
- "HUMAN:"
- "### Response:"
# string to trim space to
trimspace:
- string
# Strings to cut from the response
cutstrings:
- "string"

# Directory used to store additional assets
asset_dir: ""

# define chat roles
roles:
  user: "HUMAN:"
  system: "GPT:"
  assistant: "ASSISTANT:"
template:
  # template file ".tmpl" with the prompt template to use by default on the endpoint call. Note there is no extension in the files
  completion: completion
  chat: chat
  edit: edit_template
  function: function_template

function:
   disable_no_action: true
   no_action_function_name: "reply"
   no_action_description_name: "Reply to the AI assistant"

system_prompt:
rms_norm_eps:
# Set it to 8 for llama2 70b
ngqa: 1
## LLAMA specific options
# Enable F16 if backend supports it
f16: true
# Enable debugging
debug: true
# Enable embeddings
embeddings: true
# Mirostat configuration (llama.cpp only)
mirostat_eta: 0.8
mirostat_tau: 0.9
mirostat: 1
# GPU Layers (only used when built with cublas)
gpu_layers: 22
# Enable memory lock
mmlock: true
# GPU setting to split the tensor in multiple parts and define a main GPU
# see llama.cpp for usage
tensor_split: ""
main_gpu: ""
# Define a prompt cache path (relative to the models)
prompt_cache_path: "prompt-cache"
# Cache all the prompts
prompt_cache_all: true
# Read only
prompt_cache_ro: false
# Enable mmap
mmap: true
# Enable low vram mode (GPU only)
low_vram: true
# Set NUMA mode (CPU only)
numa: true
# Lora settings
lora_adapter: "/path/to/lora/adapter"
lora_base: "/path/to/lora/base"
# Disable mulmatq (CUDA)
no_mulmatq: true
```

### Prompt templates 

The API doesn't inject a default prompt for talking to the model. You have to use a prompt similar to what's described in the standford-alpaca docs: https://github.com/tatsu-lab/stanford_alpaca#data-release.

<details>
You can use a default template for every model present in your model path, by creating a corresponding file with the `.tmpl` suffix next to your model. For instance, if the model is called `foo.bin`, you can create a sibling file, `foo.bin.tmpl` which will be used as a default prompt and can be used with alpaca:

```
The below instruction describes a task. Write a response that appropriately completes the request.

### Instruction:
{{.Input}}

### Response:
```

See the [prompt-templates](https://github.com/go-skynet/LocalAI/tree/master/prompt-templates) directory in this repository for templates for some of the most popular models.


For the edit endpoint, an example template for alpaca-based models can be:

```yaml
Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

### Instruction:
{{.Instruction}}

### Input:
{{.Input}}

### Response:
```

</details>

### Install models using the API

Instead of installing models manually, you can use the LocalAI API endpoints and a model definition to install programmatically via API models in runtime.

A curated collection of model files is in the [model-gallery](https://github.com/go-skynet/model-gallery) (work in progress!). The files of the model gallery are different from the model files used to configure LocalAI models. The model gallery files contains information about the model setup, and the files necessary to run the model locally.

To install for example `lunademo`, you can send a POST call to the `/models/apply` endpoint with the model definition url (`url`) and the name of the model should have in LocalAI (`name`, optional):

```bash
curl --location 'http://localhost:8080/models/apply' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "TheBloke/Luna-AI-Llama2-Uncensored-GGML/luna-ai-llama2-uncensored.ggmlv3.q5_K_M.bin",
    "name": "lunademo"
}'
```


### Preloading models during startup

In order to allow the API to start-up with all the needed model on the first-start, the model gallery files can be used during startup. 

```bash
PRELOAD_MODELS='[{"url": "https://raw.githubusercontent.com/go-skynet/model-gallery/main/gpt4all-j.yaml","name": "gpt4all-j"}]' local-ai
```

`PRELOAD_MODELS` (or `--preload-models`) takes a list in JSON with the same parameter of the API calls of the `/models/apply` endpoint.

Similarly it can be specified a path to a YAML configuration file containing a list of models with `PRELOAD_MODELS_CONFIG` ( or `--preload-models-config` ):

```yaml
- url: https://raw.githubusercontent.com/go-skynet/model-gallery/main/gpt4all-j.yaml
  name: gpt4all-j
# ...
```

### Automatic prompt caching

LocalAI can automatically cache prompts for faster loading of the prompt. This can be useful if your model need a prompt template with prefixed text in the prompt before the input.

To enable prompt caching, you can control the settings in the model config YAML file:

```yaml

# Enable prompt caching
prompt_cache_path: "cache"
prompt_cache_all: true

```

`prompt_cache_path` is relative to the models folder. you can enter here a name for the file that will be automatically create during the first load if `prompt_cache_all` is set to `true`.

### Configuring a specific backend for the model

By default LocalAI will try to autoload the model by trying all the backends. This might work for most of models, but some of the backends are NOT configured to autoload.

The available backends are listed in the [model compatibility table]({{%relref "model-compatibility" %}}).

In order to specify a backend for your models, create a model config file in your `models` directory specifying the backend:

```yaml
name: gpt-3.5-turbo

# Default model parameters
parameters:
  # Relative to the models path
  model: ...

backend: llama-stable
# ...
```

### Connect external backends

LocalAI backends are internally implemented using `gRPC` services. This also allows `LocalAI` to connect to external `gRPC` services on start and extend LocalAI functionalities via third-party binaries.

The `--external-grpc-backends` parameter in the CLI can be used either to specify a local backend (a file) or a remote URL. The syntax is `<BACKEND_NAME>:<BACKEND_URI>`. Once LocalAI is started with it, the new backend name will be available for all the API endpoints.

So for instance, to register a new backend which is a local file:

```
./local-ai --debug --external-grpc-backends "my-awesome-backend:/path/to/my/backend.py"
```

Or a remote URI:

```
./local-ai --debug --external-grpc-backends "my-awesome-backend:host:port"
```

### Environment variables

When LocalAI runs in a container,
there are additional environment variables available that modify the behavior of LocalAI on startup:

| Environment variable       | Default | Description                                                                                                |
|----------------------------|---------|------------------------------------------------------------------------------------------------------------|
| `REBUILD`                  | `false` | Rebuild LocalAI on startup                                                                                 |
| `BUILD_TYPE`               |         | Build type. Available: `cublas`, `openblas`, `clblas`                                                      |
| `GO_TAGS`                  |         | Go tags. Available: `stablediffusion`                                                                      |
| `HUGGINGFACEHUB_API_TOKEN` |         | Special token for interacting with HuggingFace Inference API, required only when using the `langchain-huggingface` backend |

Here is how to configure these variables:

```bash
# Option 1: command line
docker run --env REBUILD=true localai
# Option 2: set within an env file
docker run --env-file .env localai
```
