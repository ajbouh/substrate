package assistant

import (
	"context"
	"errors"
	"fmt"
	"log"
	"log/slog"
	"strings"
	"sync"
	"text/template"
	"time"

	"github.com/ajbouh/substrate/images/bridge/assistant/openai"
	"github.com/ajbouh/substrate/images/bridge/assistant/prompts"
	"github.com/ajbouh/substrate/images/bridge/reaction"
	"github.com/ajbouh/substrate/images/bridge/tracks"
	"github.com/ajbouh/substrate/images/bridge/transcribe"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
)

var RecordAssistantText = tracks.EventRecorder[*AssistantTextEvent]("assistant-text")
var recordAssistantPrompt = tracks.EventRecorder[*AssistantPromptEvent]("assistant-set-prompt")

type AssistantPromptEvent struct {
	Name           string
	PromptTemplate string
}

type AssistantPromptNotification tracks.EventT[*AssistantPromptEvent]

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
	mu         sync.RWMutex
	assistants map[string]eventClient

	Session           *tracks.Session
	Reactor           *reaction.Reactor
	StoragePaths      *tracks.SessionStoragePaths
	DefaultAssistants map[string]string
	Runner            commands.DefRunner
	NewClient         func(_ commands.DefRunner, name, promptTemplate string) (Client, error)
}

type Void struct{}

func (a *Agent) Reactions(ctx context.Context) []reaction.CommandRuleInput {
	return []reaction.CommandRuleInput{
		a.Reactor.Rule("assistant:handle-transcription", "transcription"),
		a.Reactor.Rule("assistant:handle-prompt-event", "assistant/prompt/"),
	}
}

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
		reaction.Command(a.Reactor, "handle-transcription",
			"Respond to transcriptions",
			func(ctx context.Context, events []transcribe.Event) ([]tracks.PathEvent, error) {
				assistants := a.getAssistants()
				var results []tracks.PathEvent
				for _, e := range events {
					events, err := handleTranscription(ctx, assistants, e)
					if err != nil {
						return nil, err
					}
					results = append(results, events...)
				}
				return results, nil
			},
		),
		reaction.CommandSingle(a.Reactor, "handle-prompt-event",
			"Respond to transcriptions",
			func(ctx context.Context, annot AssistantPromptNotification) ([]tracks.PathEvent, error) {
				in := annot.Data
				err := a.setPrompt(ctx, &annot.EventMeta, in.Name, in.PromptTemplate)
				return nil, err
			},
		),
	))
}

func (a *Agent) Initialize() {
	sess := a.Session
	ctx := context.TODO()

	for name, prompt := range a.DefaultAssistants {
		if err := a.setPrompt(ctx, nil, name, prompt); err != nil {
			log.Fatalf("assistant: error creating default client %q: %s", name, err)
		}
	}

	// FIXME query for latest prompt events by name

	if a.StoragePaths != nil {
		sync := newFSSync(sess, a.StoragePaths.Dir("assistant"), 500*time.Millisecond)
		sess.Listen(sync)
	}
}

type eventClient struct {
	Client Client
	Event  *tracks.EventMeta
}

func eventBefore(a, b *tracks.EventMeta) bool {
	if a == nil {
		return true
	}
	if b == nil {
		return false
	}
	if a.Start < b.Start {
		return true
	}
	if a.Start > b.Start {
		return false
	}
	return a.ID.Compare(b.ID) < 0
}

func (a *Agent) setPrompt(ctx context.Context, meta *tracks.EventMeta, name, promptTemplate string) error {
	a.mu.Lock()
	defer a.mu.Unlock()
	prev, hasPrev := a.assistants[name]
	if hasPrev && eventBefore(meta, prev.Event) {
		slog.InfoContext(ctx, "assistant: not updating, have existing newer client", "name", name, "existing", prev.Event, "new", meta)
		return nil
	}
	record := eventClient{
		Event: meta,
	}
	if promptTemplate != "" {
		var err error
		record.Client, err = a.NewClient(a.Runner, name, promptTemplate)
		if err != nil {
			slog.InfoContext(ctx, "assistant: error creating client", "name", name, "event", meta, "error", err)
			return err
		}
	}
	if hasPrev {
		slog.InfoContext(ctx, "assistant: replacing client", "name", name, "existing", prev.Event, "new", meta)
	} else {
		slog.InfoContext(ctx, "assistant: adding client", "name", name, "new", meta)
	}
	if a.assistants == nil {
		a.assistants = make(map[string]eventClient)
	}
	a.assistants[name] = record
	return nil
}

func (a *Agent) getAssistants() []Client {
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

func handleTranscription(ctx context.Context, clients []Client, annot transcribe.Event) ([]tracks.PathEvent, error) {
	in := annot.Data
	if len(in.Segments) == 0 || len(in.Segments[0].Words) == 0 {
		slog.InfoContext(ctx, "assistant: transcription had no segments or words")
		return nil, nil
	}
	outCh := make(chan tracks.PathEvent)
	text := strings.TrimSpace(in.Text())
	var wg sync.WaitGroup
	wg.Add(len(clients))
	for _, client := range clients {
		go func() {
			r := respond(client, annot, text)
			if r != nil {
				outCh <- tracks.PathEvent{
					EventMeta: tracks.EventMeta{
						ID:    tracks.NewID(),
						Start: annot.Start,
						End:   annot.End,
						Type:  "assistant-text",
					},
					Path:    "/assistant/text",
					TrackID: annot.TrackID,
					Data:    r,
				}
			}
			wg.Done()
		}()
	}
	go func() {
		wg.Wait()
		close(outCh)
	}()
	var out []tracks.PathEvent
	for ev := range outCh {
		out = append(out, ev)
	}
	return out, nil
}

func matchesAssistantName(client Client, text string) bool {
	return strings.Contains(strings.ToLower(text), client.AssistantName())
}

func stringPtr(s string) *string {
	return &s
}

func respond(client Client, annot transcribe.Event, input string) *AssistantTextEvent {
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
		return nil
	}
	if err != nil {
		log.Printf("assistant: %s error: %v", name, err)
		out.Error = stringPtr("error calling assistant")
	} else {
		log.Printf("assistant: %s response: %s", name, response)
		out.Response = &response
	}
	return &out
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
