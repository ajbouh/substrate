package openai

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/adrg/frontmatter"
)

func CompleteWithFrontmatter(promptWithFrontmatter string) (string, error) {
	endpoint, command, req, err := parseFrontmatter(promptWithFrontmatter)
	if err != nil {
		return "", err
	}
	return Complete(endpoint, command, req)
}

func parseFrontmatter(input string) (string, string, *CompletionRequest, error) {
	var req requestFrontmatter
	prompt, err := frontmatter.Parse(strings.NewReader(input), &req)
	if err != nil {
		return "", "", nil, err
	}
	req.Prompt = string(prompt)
	if req.MaxTokens == 0 {
		req.MaxTokens = 4096
	}
	req.MaxTokens -= TokenCount(string(prompt))
	return req.Endpoint, req.Command, &req.CompletionRequest, nil
}

type requestFrontmatter struct {
	CompletionRequest `yaml:",inline"`
	Endpoint          string `json:"endpoint"`
	Command           string `json:"command"`
}

func Complete(endpoint, command string, req *CompletionRequest) (string, error) {
	resp, err := doCompletion(endpoint, command, req)
	if err != nil {
		return "", err
	}
	if len(resp.Choices) == 0 {
		return "", fmt.Errorf("choices was empty")
	}
	return resp.Choices[0].Text, nil
}

// TODO replace this with an accurate count of tokens, e.g.:
// https://github.com/pkoukk/tiktoken-go#counting-tokens-for-chat-api-calls
func TokenCount(msg string) int {
	return len(msg)
}

func indentJSONString(b []byte) string {
	var buf bytes.Buffer
	json.Indent(&buf, b, "", "  ")
	return buf.String()
}
