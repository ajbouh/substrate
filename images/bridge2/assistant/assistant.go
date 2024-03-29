package assistant

import (
	"bytes"
	"cmp"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"slices"
	"strings"
	"sync"

	"github.com/ajbouh/substrate/images/bridge2/assistant/prompts"
	"github.com/ajbouh/substrate/images/bridge2/tracks"
	"github.com/ajbouh/substrate/images/bridge2/transcribe"
)

var recordAssistantText = tracks.EventRecorder[*AssistantTextEvent]("assistant-text")
var recordAssistantPrompt = tracks.EventRecorder[*AssistantPromptEvent]("assistant-set-prompt")

type AssistantPromptEvent struct {
	Name          string
	SystemMessage string
}

type AssistantTextEvent struct {
	SourceEvent tracks.ID
	Name        string
	Input       string
	Response    string
	Error       string
}

func AddAssistant(span tracks.Span, name, systemMessage string) tracks.Event {
	return recordAssistantPrompt(span, &AssistantPromptEvent{
		Name:          name,
		SystemMessage: systemMessage,
	})
}

func RemoveAssistant(span tracks.Span, name string) tracks.Event {
	return recordAssistantPrompt(span, &AssistantPromptEvent{
		Name:          name,
		SystemMessage: "",
	})
}

type Client interface {
	AssistantName() string
	Complete(speaker, input string) (string, error)
}

type Agent struct {
	DefaultAssistants []Client
	NewClient         func(name, prompt string) Client
}

func (a *Agent) HandleSessionInit(sess *tracks.Session) {
	if a.NewClient == nil {
		return
	}
	var promptEvents []tracks.Event
	for _, t := range sess.Tracks() {
		promptEvents = append(promptEvents, t.Events("assistant-set-prompt")...)
	}
	// sort in reverse order to create clients based on the latest prompt first
	// then we'll skip initializing clients for older prompts
	slices.SortFunc(promptEvents, func(a, b tracks.Event) int {
		return -cmp.Compare(a.Start, b.Start)
	})
	agent := &sessionAgent{
		NewClient:  a.NewClient,
		assistants: make(map[string]eventClient),
	}
	for _, e := range promptEvents {
		agent.handleSetPrompt(e)
	}
	sess.Listen(agent)
}

func (a *Agent) HandleEvent(annot tracks.Event) {
	if annot.Type != "transcription" {
		return
	}
	handleTranscription(a.DefaultAssistants, annot)
}

type sessionAgent struct {
	mu         sync.RWMutex
	NewClient  func(name, prompt string) Client
	assistants map[string]eventClient
}

type eventClient struct {
	Client Client
	Event  tracks.EventMeta
}

func (a *sessionAgent) HandleEvent(annot tracks.Event) {
	switch annot.Type {
	case "assistant-set-prompt":
		a.handleSetPrompt(annot)
	case "transcription":
		handleTranscription(a.getAssistants(), annot)
	}
}

func eventBefore(a, b tracks.EventMeta) bool {
	if a.Start < b.Start {
		return true
	}
	if a.Start > b.Start {
		return false
	}
	return a.ID.Compare(b.ID) < 0
}

func (a *sessionAgent) handleSetPrompt(annot tracks.Event) {
	a.mu.Lock()
	defer a.mu.Unlock()
	in := annot.Data.(*AssistantPromptEvent)
	prev, hasPrev := a.assistants[in.Name]
	if hasPrev && eventBefore(annot.EventMeta, prev.Event) {
		log.Printf("assistant: not updating %q, existing client from %s newer than %s", in.Name, prev.Event.Start, annot.Start)
		return
	}
	record := eventClient{
		Event: annot.EventMeta,
	}
	if in.SystemMessage != "" {
		record.Client = a.NewClient(in.Name, in.SystemMessage)
	}
	if hasPrev {
		log.Printf("assistant: replacing %q client from %s with newer %s", in.Name, prev.Event.Start, annot.Start)
	} else {
		log.Printf("assistant: adding %q client at %s", in.Name, annot.Start)
	}
	a.assistants[in.Name] = record
}

func (a *sessionAgent) getAssistants() []Client {
	a.mu.RLock()
	defer a.mu.RUnlock()
	out := make([]Client, 0, len(a.assistants))
	for _, client := range a.assistants {
		if client.Client != nil {
			out = append(out, client.Client)
		}
	}
	return out
}

func handleTranscription(clients []Client, annot tracks.Event) {
	in := annot.Data.(*transcribe.Transcription)

	if len(in.Segments) == 0 || len(in.Segments[0].Words) == 0 {
		log.Printf("assistant: transcription had no segments or words")
		return
	}
	text := strings.TrimSpace(in.Text())
	names := matchAssistants(clients, text)
	log.Printf("assistant: matched %v for: %s", names, text)
	for name, client := range names {
		go respond(client, annot, name, text)
	}
}

func matchAssistants(clients []Client, text string) map[string]Client {
	matched := make(map[string]Client)
	text = strings.ToLower(text)
	for _, client := range clients {
		if strings.Contains(text, client.AssistantName()) {
			matched[client.AssistantName()] = client
		}
	}
	return matched
}

func respond(client Client, annot tracks.Event, name, input string) {
	out := AssistantTextEvent{
		SourceEvent: annot.ID,
		Name:        name,
		Input:       input,
	}
	// TODO get speaker name from transcription
	log.Printf("assistant: about to call %s", name)
	resp, err := client.Complete("user", input)
	if err != nil {
		log.Printf("assistant: %s error: %v", name, err)
		out.Error = "error calling assistant"
	} else {
		log.Printf("assistant: %s response: %s", name, resp)
		out.Response = resp
	}
	recordAssistantText(annot.Span(), &out)
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

type OpenAIClient struct {
	Name          string
	Endpoint      string
	SystemMessage string
}

func OpenAIClientGenerator(endpoint string) func(name, systemMessage string) Client {
	return func(name, systemMessage string) Client {
		return OpenAIClient{
			Name:          name,
			Endpoint:      endpoint,
			SystemMessage: systemMessage,
		}
	}
}

func (a OpenAIClient) AssistantName() string {
	return a.Name
}

func (a OpenAIClient) Complete(speaker, input string) (string, error) {
	maxTokens := 4096
	systemMessage := a.SystemMessage
	prompt, err := prompts.Render("complete", map[string]any{
		"SystemMessage": systemMessage,
		"UserInput":     input,
		"AssistantName": a.Name,
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
