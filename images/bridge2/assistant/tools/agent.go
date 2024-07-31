package tools

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strings"

	"github.com/ajbouh/substrate/images/bridge2/assistant/openai"
	"github.com/ajbouh/substrate/images/bridge2/assistant/prompts"
	"github.com/ajbouh/substrate/images/bridge2/tracks"
	"github.com/ajbouh/substrate/images/bridge2/transcribe"
)

var recordOffer = tracks.EventRecorder[*OfferEvent]("tool-offer")

type OfferEvent struct {
	SourceEvent tracks.ID
	Name        string
	Prompt      string
	// TODO record the list of tool definitions too so that we can pass those
	// along when we pass it back for summarization?
	Calls []Call[any]
}

var recordTrigger = tracks.EventRecorder[*TriggerEvent]("tool-trigger")

type TriggerEvent struct {
	SourceEvent tracks.ID
	OfferEvent  tracks.ID
	Name        string
	Call        Call[any]
}

var recordCall = tracks.EventRecorder[*CallEvent]("tool-call")

type CallEvent struct {
	SourceEvent  tracks.ID
	TriggerEvent tracks.ID
	Name         string
	Call         Call[any]
	Response     Response[any]
	// TODO error here or inside the response?
}

// NewAgent sets up a series of handlers to orchestrate the tool call flow.
//
// OfferAgent:
// * Listens for transcription events that contain the agent's name.
// * Call the Registry for a list of tool definitions.
// * Call the OpenAI endpoint passing the transcription message and definitions to ask for possible calls.
// * Records a "tool-offer" event storing a list of any calls proposed for this message.
//
// AutoTriggerAgent:
// * Listen for "tool-offer" events. If a call is avaiable, record a "tool-trigger" event for the first one.
//
// CallAgent:
// * Listen for "tool-trigger" events with the agent's name.
// * Call the Runner to invoke that tool.
// * Record a "tool-call" event with the response.
//
// Summarization:
// This was omitted for now and the JSON response is shown directly in the UI.
// However an improvement would be to take the "tool-call", and pass the response
// back to the OpenAI endpoint to generate a human-readable summary.
func NewAgent(name string, registry Registry) tracks.Handler {
	return handlers{
		handlers: []tracks.Handler{
			&OfferAgent{
				Name:      name,
				Registry:  registry,
				Completer: openAICompleter("tool-select"),
			},
			AutoTriggerAgent{},
			&CallAgent{
				Name:   name,
				Runner: registry,
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

type OfferAgent struct {
	Name      string
	Registry  ToolLister
	Completer func(map[string]any) (string, string, error)
}

func (a *OfferAgent) HandleEvent(event tracks.Event) {
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
			SourceEvent: event.ID,
			Name:        a.Name,
			Prompt:      prompt,
			Calls:       calls,
		})
	}
}

func (a *OfferAgent) CompleteTool(input string) (string, []Call[any], error) {
	defs, err := a.Registry.ListTools(context.TODO())
	if err != nil {
		return "", nil, err
	}
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

type AutoTriggerAgent struct{}

func (a AutoTriggerAgent) HandleEvent(event tracks.Event) {
	switch event.Type {
	case "tool-offer":
		offer := event.Data.(*OfferEvent)
		if len(offer.Calls) == 0 {
			return
		}
		recordTrigger(event.Span(), &TriggerEvent{
			SourceEvent: offer.SourceEvent,
			OfferEvent:  event.ID,
			Name:        offer.Name,
			Call:        offer.Calls[0],
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
		result, err := a.Runner.RunTool(context.TODO(), trigger.Call)
		if err != nil {
			return // FIXME
		}
		recordCall(event.Span(), &CallEvent{
			Name:         a.Name,
			SourceEvent:  trigger.SourceEvent,
			TriggerEvent: event.ID,
			Call:         trigger.Call,
			Response: Response[any]{
				Content: result,
			},
		})
	}
}

func openAICompleter(template string) func(map[string]any) (string, string, error) {
	return func(templateArgs map[string]any) (string, string, error) {
		prompt, err := prompts.Render(template, templateArgs)
		if err != nil {
			return prompt, "", err
		}
		resp, err := openai.CompleteWithFrontmatter(prompt)
		return prompt, resp, err
	}
}
