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
	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
)

var RecordAssistantText = tracks.EventRecorder[*AssistantTextEvent]("assistant-text")
var recordAssistantPrompt = tracks.EventRecorder[*AssistantPromptEvent]("assistant-set-prompt")

type AssistantPromptEvent struct {
	Name           string
	PromptTemplate string
}

// TODO send events when the prompt changes, but need to update those
// functions to have access to a queue
// type AssistantPromptNotification tracks.EventT[*AssistantPromptEvent]

type AssistantTextEvent struct {
	SourceEvent tracks.ID
	Name        string
	Prompt      string
	Response    *string
	Error       *string
}

type AssistantTextNotification tracks.EventT[*AssistantTextEvent]

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
	NotifyQueue            *notify.Queue
	AssistantTextNotifiers []notify.Notifier[AssistantTextNotification]

	Session           *tracks.Session
	StoragePaths      *tracks.SessionStoragePaths
	DefaultAssistants map[string]string
	defaultAssistants []Client
	Runner            commands.DefRunner
	NewClient         func(_ commands.DefRunner, name, promptTemplate string) (Client, error)
}

type Void struct{}

func (a *Agent) Commands(ctx context.Context) commands.Source {
	sess := a.Session
	return commands.Prefixed("assistant:", commands.List[commands.Source](
		handle.Command(
			"add",
			"Add an assistant to the session",
			func(ctx context.Context, t *struct{}, args struct {
				Name           string `json:"name" doc:"The assistant's name"`
				PromptTemplate string `json:"prompt_template" doc:"Template for assistant prompts"`
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
		handle.Command(
			"remove",
			"Remove an assistant from the session",
			func(ctx context.Context, t *struct{}, args struct {
				Name string `json:"name" doc:"The assistant's name"`
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
			NewClient: func(name, promptTemplate string) (Client, error) {
				return a.NewClient(a.Runner, name, promptTemplate)
			},
			assistants:      make(map[string]eventClient),
			recordTextEvent: a.recordTextEvent,
		}
		for _, e := range promptEvents {
			agent.handleSetPrompt(e)
		}
		sess.Listen(agent)
	}

	for name, prompt := range a.DefaultAssistants {
		client, err := a.NewClient(a.Runner, name, prompt)
		if err != nil {
			log.Fatalf("assistant: error creating default client %q: %s", name, err)
		}
		a.defaultAssistants = append(a.defaultAssistants, client)
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
	handleTranscription(a.defaultAssistants, annot, a.recordTextEvent)
}

func (a *Agent) recordTextEvent(span tracks.Span, data *AssistantTextEvent) {
	ev := RecordAssistantText(span, data)
	notify.Later(a.NotifyQueue, a.AssistantTextNotifiers, AssistantTextNotification{
		EventMeta: ev.EventMeta,
		TrackID:   ev.Track().ID,
		Data:      ev.Data.(*AssistantTextEvent),
	})
}

type sessionAgent struct {
	mu              sync.RWMutex
	NewClient       func(name, promptTemplate string) (Client, error)
	assistants      map[string]eventClient
	recordTextEvent func(tracks.Span, *AssistantTextEvent)
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
		handleTranscription(a.getAssistants(), annot, a.recordTextEvent)
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

func handleTranscription(clients []Client, annot tracks.Event, record func(tracks.Span, *AssistantTextEvent)) {
	in := annot.Data.(*transcribe.Transcription)

	if len(in.Segments) == 0 || len(in.Segments[0].Words) == 0 {
		log.Printf("assistant: transcription had no segments or words")
		return
	}
	text := strings.TrimSpace(in.Text())
	for _, client := range clients {
		go respond(client, annot, text, record)
	}
}

func matchesAssistantName(client Client, text string) bool {
	return strings.Contains(strings.ToLower(text), client.AssistantName())
}

func stringPtr(s string) *string {
	return &s
}

func respond(client Client, annot tracks.Event, input string, record func(tracks.Span, *AssistantTextEvent)) {
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
	record(annot.Span(), &out)
}

func DefaultPromptTemplateForName(name string) (string, error) {
	return prompts.Render("complete", map[string]any{
		"AssistantName": name,
	})
}

type OpenAIClient struct {
	Name     string
	Template *template.Template
	Runner   commands.DefRunner
}

func OpenAIClientGenerator(runner commands.DefRunner, name, promptTemplate string) (Client, error) {
	tmpl, err := prompts.ParseTemplate(promptTemplate)
	if err != nil {
		return nil, err
	}
	return OpenAIClient{
		Name:     name,
		Template: tmpl,
		Runner:   runner,
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
	resp, err := openai.CompleteWithFrontmatter(a.Runner, prompt)
	return prompt, resp, err
}
