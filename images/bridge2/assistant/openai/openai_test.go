package openai

import (
	"testing"

	"gotest.tools/assert"
)

func TestFrontmatter(t *testing.T) {
	endpoint, req, err := parseFrontmatter(`---
endpoint: "endpoint_url"
model: "/res/model/huggingface/local"
max_tokens: 100
---
prompt content
`)
	assert.Assert(t, err)
	assert.Equal(t, "endpoint_url", endpoint)
	assert.Equal(t, "/res/model/huggingface/local", req.Model)
	assert.DeepEqual(t, &CompletionRequest{
		Prompt:    "prompt content\n",
		Model:     "/res/model/huggingface/local",
		MaxTokens: 100 - TokenCount(req.Prompt),
	}, req)
}
