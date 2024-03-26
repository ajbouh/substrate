package assistant

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/ajbouh/substrate/images/bridge2/assistant/prompts"
	"github.com/ajbouh/substrate/images/bridge2/tracks"
	"github.com/ajbouh/substrate/images/bridge2/transcribe"
)

var recordAssistantText = tracks.EventRecorder[*AssistantTextEvent]("assistant-text")

type AssistantTextEvent struct {
	SourceEvent tracks.ID
	Name        string
	Input       string
	Response    string
	Error       string
}

type Client interface {
	Call(assistant, speaker, prompt string) (string, error)
}

type Agent struct {
	Assistants map[string]Client
}

func (a *Agent) HandleEvent(annot tracks.Event) {
	if annot.Type != "transcription" {
		return
	}
	in := annot.Data.(*transcribe.Transcription)

	if len(in.Segments) == 0 || len(in.Segments[0].Words) == 0 {
		log.Printf("assistant: transcription had no segments or words")
		return
	}
	text := strings.TrimSpace(in.Text())
	names := a.matchAssistants(text)
	log.Printf("assistant: matched %v for: %s", names, text)
	for _, name := range names {
		go a.respond(annot, name, text)
	}
}

func (a *Agent) matchAssistants(text string) []string {
	var matched []string
	text = strings.ToLower(text)
	for name := range a.Assistants {
		if strings.Contains(text, name) {
			matched = append(matched, name)
		}
	}
	return matched
}

func (a *Agent) respond(annot tracks.Event, name, input string) {
	out := AssistantTextEvent{
		SourceEvent: annot.ID,
		Name:        name,
		Input:       input,
	}
	// TODO get speaker name from transcription
	log.Printf("assistant: about to call %s", name)
	resp, err := a.call(name, "user", input)
	if err != nil {
		log.Printf("assistant: %s error: %v", name, err)
		out.Error = "error calling assistant"
	} else {
		log.Printf("assistant: %s response: %s", name, resp)
		out.Response = resp
	}
	recordAssistantText(annot.Span(), &out)
}

func (a *Agent) call(name, speaker, prompt string) (string, error) {
	client := a.Assistants[name]
	return client.Call(name, speaker, prompt)
}

type OpenAIClient struct {
	Endpoint      string
	SystemMessage string
}

// TODO replace this with an accurate count of tokens, e.g.:
// https://github.com/pkoukk/tiktoken-go#counting-tokens-for-chat-api-calls
func tokenCount(msg string) int {
	return len(msg)
}

func DefaultSystemMessageForName(name string) string {
	return strings.ReplaceAll(`
A chat between ASSISTANT (named {}) and a USER.

{} is a conversational, vocal, artificial intelligence assistant.

{}'s job is to converse with humans to help them accomplish goals.

{} is able to help with a wide variety of tasks from answering questions to assisting the human with creative writing.

Overall {} is a powerful system that can help humans with a wide range of tasks and provide valuable insights as well as taking actions for the human.
`, "{}", name)
}

func (a *OpenAIClient) Call(assistant, speaker, input string) (string, error) {
	maxTokens := 4096
	systemMessage := a.SystemMessage
	prompt, err := prompts.Render("complete", map[string]any{
		"SystemMessage": systemMessage,
		"UserInput":     input,
		"AssistantName": assistant,
		"SpeakerName":   speaker,
	})
	if err != nil {
		return "", err
	}
	req := CompletionRequest{
		MaxTokens: maxTokens - tokenCount(systemMessage),
		Prompt:    prompt,
	}
	resp, err := doCompletion(a.Endpoint, &req)
	if err != nil {
		return "", err
	}
	if len(resp.Choices) == 0 {
		return "", fmt.Errorf("choices was empty")
	}
	if r, err := json.MarshalIndent(resp, "", " "); err == nil {
		log.Printf("assistant: response: %s", r)
	}
	return resp.Choices[0].Text, nil
}

func doChatRequest(endpoint string, request *ChatCompletionRequest) (*ChatCompletionResponse, error) {
	return doRequest[ChatCompletionResponse](endpoint, request)
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
	log.Println("assistant: request:", indentJSONString(payloadBytes))

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
	log.Println("assistant: response:", indentJSONString(body))
	return &response, err
}
