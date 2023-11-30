
+++
disableToc = false
title = "✍️ Constrained grammars"
weight = 6
+++

The chat endpoint accepts an additional `grammar` parameter which takes a [BNF defined grammar](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form).

This allows the LLM to constrain the output to a user-defined schema, allowing to generate `JSON`, `YAML`, and everything that can be defined with a BNF grammar.

{{% notice note %}}
This feature works only with models compatible with the [llama.cpp](https://github.com/ggerganov/llama.cpp) backend (see also [Model compatibility]({{%relref "model-compatibility" %}})). For details on how it works, see the upstream PRs: https://github.com/ggerganov/llama.cpp/pull/1773, https://github.com/ggerganov/llama.cpp/pull/1887
{{% /notice %}}

## Setup

Follow the setup instructions from the [LocalAI functions]({{%relref "features/openai-functions" %}}) page.

## 💡 Usage example

For example, to constrain the output to either `yes`, `no`:

```bash
curl http://localhost:8080/v1/chat/completions -H "Content-Type: application/json" -d '{
  "model": "gpt-4",
  "messages": [{"role": "user", "content": "Do you like apples?"}],
  "grammar": "root ::= (\"yes\" | \"no\")"
}'
```
