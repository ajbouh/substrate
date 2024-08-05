package openai

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/adrg/frontmatter"
)

func CompleteWithFrontmatter(promptWithFrontmatter string) (string, error) {
	endpoint, req, err := parseFrontmatter(promptWithFrontmatter)
	if err != nil {
		return "", err
	}
	return Complete(endpoint, req)
}

func parseFrontmatter(input string) (string, *CompletionRequest, error) {
	var req requestFrontmatter
	prompt, err := frontmatter.Parse(strings.NewReader(input), &req)
	if err != nil {
		return "", nil, err
	}
	req.Prompt = string(prompt)
	if req.MaxTokens == 0 {
		req.MaxTokens = 4096
	}
	req.MaxTokens -= TokenCount(string(prompt))
	return req.Endpoint, &req.CompletionRequest, nil
}

type requestFrontmatter struct {
	CompletionRequest `yaml:",inline"`
	Endpoint          string `json:"endpoint"`
}

func Complete(endpoint string, req *CompletionRequest) (string, error) {
	resp, err := doCompletion(endpoint, req)
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

func doRequest[Resp, Req any](endpoint string, request Req) (*Resp, error) {
	payloadBytes, err := json.Marshal(request)
	if err != nil {
		return nil, err
	}
	log.Println("openai: request:", indentJSONString(payloadBytes))

	resp, err := http.Post(endpoint, "application/json", bytes.NewBuffer(payloadBytes))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("assistant: unexpected status %d: %s", resp.StatusCode, body)
	}
	var response Resp
	err = json.Unmarshal(body, &response)
	log.Println("openai: response:", indentJSONString(body))
	return &response, err
}
