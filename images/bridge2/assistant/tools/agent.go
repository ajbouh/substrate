package tools

import (
	"encoding/json"
	"fmt"
	"log"
	"strings"

	"github.com/ajbouh/substrate/images/bridge2/assistant"
	"github.com/ajbouh/substrate/images/bridge2/assistant/openai"
	"github.com/ajbouh/substrate/images/bridge2/assistant/prompts"
	"github.com/ajbouh/substrate/images/bridge2/tracks"
	"github.com/ajbouh/substrate/images/bridge2/transcribe"
)

var recordOffer = tracks.EventRecorder[*OfferEvent]("tool-offer")

type OfferEvent struct {
	SourceID tracks.ID
	Name     string
	Prompt   string
	// TODO record the list of tool definitions too so that we can pass those
	// along when we pass it back for summarization?
	Calls []Call[any]
}

var recordTrigger = tracks.EventRecorder[*TriggerEvent]("tool-trigger")

type TriggerEvent struct {
	SourceID tracks.ID
	OfferID  tracks.ID
	Name     string
	Call     Call[any]
}

var recordCall = tracks.EventRecorder[*CallEvent]("tool-call")

type CallEvent struct {
	SourceID  tracks.ID
	TriggerID tracks.ID
	Name      string
	Call      Call[any]
	Response  Response[any]
	// TODO error here or inside the response?
}

func NewAgent(name string, registry Registry, endpoint string) tracks.Handler {
	return handlers{
		handlers: []tracks.Handler{
			&Agent{
				Name:      name,
				Registry:  registry,
				Completer: openAICompleter("tool-select", endpoint),
			},
			AutoCallAgent{},
			&CallAgent{
				Name:   name,
				Runner: registry,
			},
			&Summarizer{
				Name:     name,
				Complete: templateCompleter("tool-response-simple"),
			},
		},
	}
}

type handlers struct {
	// Tractor crashes if the component is not a struct, so wrap it in a struct
	// instead of just using the slice as the type directly.
	handlers []tracks.Handler
}

func (h handlers) HandleEvent(event tracks.Event) {
	for _, handler := range h.handlers {
		handler.HandleEvent(event)
	}
}

type Agent struct {
	Name      string
	Registry  ToolLister
	Completer func(any) (string, string, error)
}

func (a *Agent) HandleEvent(event tracks.Event) {
	switch event.Type {
	case "transcription":
		in := event.Data.(*transcribe.Transcription)
		text := in.Text()
		if !strings.Contains(strings.ToLower(text), a.Name) {
			return
		}
		prompt, calls, err := a.CompleteTool(text)
		if err != nil {
			log.Printf("tools: error completing tool: %v", err)
			return
		}
		recordOffer(event.Span(), &OfferEvent{
			SourceID: event.ID,
			Name:     a.Name,
			Prompt:   prompt,
			Calls:    calls,
		})
	}
}

func (a *Agent) CompleteTool(input string) (string, []Call[any], error) {
	defs := a.Registry.ListTools()
	prompt, resp, err := a.Completer(map[string]any{
		"UserInput": input,
		"ToolDefs":  defs,
	})
	if err != nil {
		return prompt, nil, err
	}
	log.Printf("tools:\n\n>>>input: %s\n\n<<<response: %s", input, resp)
	_, after, found := strings.Cut(resp, "<tool_call>")
	if !found {
		return prompt, nil, fmt.Errorf("tools: no <tool_call> found: %q", resp)
	}
	inside, _, found := strings.Cut(after, "</tool_call>")
	if !found {
		return prompt, nil, fmt.Errorf("tools: no </tool_call> found: %q", resp)
	}
	var out Call[any]
	if err := json.Unmarshal([]byte(inside), &out); err != nil {
		return prompt, nil, err
	}
	return prompt, []Call[any]{out}, nil
}

type AutoCallAgent struct{}

func (a AutoCallAgent) HandleEvent(event tracks.Event) {
	switch event.Type {
	case "tool-offer":
		offer := event.Data.(*OfferEvent)
		if len(offer.Calls) == 0 {
			return
		}
		recordTrigger(event.Span(), &TriggerEvent{
			SourceID: offer.SourceID,
			OfferID:  event.ID,
			Name:     offer.Name,
			Call:     offer.Calls[0],
		})
	}
}

type CallAgent struct {
	Name   string
	Runner Runner
}

func (a *CallAgent) HandleEvent(event tracks.Event) {
	switch event.Type {
	case "tool-trigger":
		trigger := event.Data.(*TriggerEvent)
		if trigger.Name != a.Name {
			return
		}
		result, err := a.Runner.RunTool(trigger.Call)
		if err != nil {
			return // FIXME
		}
		recordCall(event.Span(), &CallEvent{
			SourceID:  trigger.SourceID,
			TriggerID: event.ID,
			Call:      trigger.Call,
			Response: Response[any]{
				Content: result,
			},
		})
	}
}

type Summarizer struct {
	Name     string
	Complete func(any) (string, string, error)
}

func (a *Summarizer) HandleEvent(event tracks.Event) {
	switch event.Type {
	case "tool-call":
		result := event.Data.(*CallEvent)
		prompt, resp, err := a.Complete(result)
		out := assistant.AssistantTextEvent{
			SourceEvent: result.SourceID,
			Name:        a.Name,
			Prompt:      prompt,
		}
		if err != nil {
			log.Printf("tools: %s error: %v", a.Name, err)
			out.Error = stringPtr("error calling tool")
		} else {
			log.Printf("tools: %s response: %s", a.Name, resp)
			out.Response = &resp
		}
		assistant.RecordAssistantText(event.Span(), &out)
	}
}

func templateCompleter(template string) func(any) (string, string, error) {
	return func(templateArgs any) (string, string, error) {
		content, err := prompts.Render(template, templateArgs)
		return "", content, err
	}
}

func openAICompleter(template, endpoint string) func(any) (string, string, error) {
	return func(templateArgs any) (string, string, error) {
		prompt, err := prompts.Render(template, templateArgs)
		if err != nil {
			return prompt, "", err
		}
		maxTokens := 4096
		resp, err := openai.Complete(endpoint, &openai.CompletionRequest{
			MaxTokens: maxTokens - openai.TokenCount(prompt),
			Prompt:    prompt,
		})
		return prompt, resp, err
	}
}

func stringPtr(s string) *string {
	return &s
}
