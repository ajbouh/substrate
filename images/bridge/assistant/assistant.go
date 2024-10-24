package assistant

import (
	"cmp"
	"context"
	"errors"
	"fmt"
	"log"
	"slices"
	"strings"
	"sync"
	"text/template"
	"time"

	"github.com/ajbouh/substrate/images/bridge/assistant/openai"
	"github.com/ajbouh/substrate/images/bridge/assistant/prompts"
	"github.com/ajbouh/substrate/images/bridge/tracks"
	"github.com/ajbouh/substrate/images/bridge/transcribe"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
)

var RecordAssistantText = tracks.EventRecorder[*AssistantTextEvent]("assistant-text")
var recordAssistantPrompt = tracks.EventRecorder[*AssistantPromptEvent]("assistant-set-prompt")

type AssistantPromptEvent struct {
	Name           string
	PromptTemplate string
}

type AssistantTextEvent struct {
	SourceEvent tracks.ID
	Name        string
	Prompt      string
	Response    *string
	Error       *string
}

func AddAssistant(span tracks.Span, name, promptTemplate string) tracks.Event {
	return recordAssistantPrompt(span, &AssistantPromptEvent{
		Name:           name,
		PromptTemplate: promptTemplate,
	})
}

func RemoveAssistant(span tracks.Span, name string) tracks.Event {
	return recordAssistantPrompt(span, &AssistantPromptEvent{
		Name:           name,
		PromptTemplate: "",
	})
}

var ErrNoMatch = fmt.Errorf("input does not match assistant")

type Client interface {
	AssistantName() string
	Complete(speaker, input string) (prompt, response string, err error)
}

type Agent struct {
	Session           *tracks.Session
	StoragePaths      *tracks.SessionStoragePaths
	DefaultAssistants []Client
	NewClient         func(name, promptTemplate string) (Client, error)
}

type Void struct{}

func (a *Agent) Commands(ctx context.Context) commands.Source {
	sess := a.Session
	return commands.Prefixed("assistant:", commands.List(
		commands.Command(
			"add",
			"Add an assistant to the session",
			func(ctx context.Context, t *struct{}, args struct {
				Name           string `json:"name" desc:"The assistant's name"`
				PromptTemplate string `json:"prompt_template" desc:"Template for assistant prompts"`
			}) (Void, error) {
				name := args.Name
				name = strings.ToLower(name)
				prompt := args.PromptTemplate
				if prompt == "" {
					var err error
					prompt, err = DefaultPromptTemplateForName(name)
					if err != nil {
						return Void{}, err
					}
				}
				AddAssistant(sess.SpanNow(), name, prompt)
				return Void{}, nil
			}),
		commands.Command(
			"remove",
			"Remove an assistant from the session",
			func(ctx context.Context, t *struct{}, args struct {
				Name string `json:"name" desc:"The assistant's name"`
			}) (Void, error) {
				name := args.Name
				name = strings.ToLower(name)
				RemoveAssistant(sess.SpanNow(), name)
				return Void{}, nil
			}),
	))
}
func (a *Agent) Initialize() {
	sess := a.Session
	if a.NewClient != nil {
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

	if a.StoragePaths != nil {
		sync := newFSSync(sess, a.StoragePaths.Dir("assistant"), 500*time.Millisecond)
		sess.Listen(sync)
	}
}

func (a *Agent) HandleEvent(annot tracks.Event) {
	if annot.Type != "transcription" {
		return
	}
	handleTranscription(a.DefaultAssistants, annot)
}

type sessionAgent struct {
	mu         sync.RWMutex
	NewClient  func(name, promptTemplate string) (Client, error)
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
	if in.PromptTemplate != "" {
		var err error
		record.Client, err = a.NewClient(in.Name, in.PromptTemplate)
		if err != nil {
			log.Printf("assistant: error creating client %q at %s: %s", in.Name, annot.Start, err)
			return
		}
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
	for _, client := range clients {
		go respond(client, annot, text)
	}
}

func matchesAssistantName(client Client, text string) bool {
	return strings.Contains(strings.ToLower(text), client.AssistantName())
}

func stringPtr(s string) *string {
	return &s
}

func respond(client Client, annot tracks.Event, input string) {
	name := client.AssistantName()
	// TODO get speaker name from transcription
	speaker := "user"
	prompt, response, err := client.Complete(speaker, input)
	out := AssistantTextEvent{
		SourceEvent: annot.ID,
		Name:        name,
		Prompt:      prompt,
	}
	if errors.Is(err, ErrNoMatch) {
		log.Printf("assistant: client %q did not match: %s", name, input)
		return
	}
	if err != nil {
		log.Printf("assistant: %s error: %v", name, err)
		out.Error = stringPtr("error calling assistant")
	} else {
		log.Printf("assistant: %s response: %s", name, response)
		out.Response = &response
	}
	RecordAssistantText(annot.Span(), &out)
}

func DefaultPromptTemplateForName(name string) (string, error) {
	return prompts.Render("complete", map[string]any{
		"AssistantName": name,
	})
}

type OpenAIClient struct {
	Name     string
	Template *template.Template
}

func OpenAIClientGenerator(name, promptTemplate string) (Client, error) {
	tmpl, err := prompts.ParseTemplate(promptTemplate)
	if err != nil {
		return nil, err
	}
	return OpenAIClient{
		Name:     name,
		Template: tmpl,
	}, nil
}

func (a OpenAIClient) AssistantName() string {
	return a.Name
}

func (a OpenAIClient) BuildPrompt(speaker, input string) (string, error) {
	return prompts.RenderToString(a.Template, map[string]any{
		"UserInput":   input,
		"SpeakerName": speaker,
	})
}

func (a OpenAIClient) Complete(speaker, input string) (string, string, error) {
	if !matchesAssistantName(a, input) {
		return "", "", ErrNoMatch
	}
	prompt, err := a.BuildPrompt(speaker, input)
	if err != nil {
		return prompt, "", err
	}
	resp, err := openai.CompleteWithFrontmatter(prompt)
	return prompt, resp, err
}
