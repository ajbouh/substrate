package tools

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"log/slog"
	"strings"

	"github.com/ajbouh/substrate/images/bridge/assistant/openai"
	"github.com/ajbouh/substrate/images/bridge/assistant/prompts"
	"github.com/ajbouh/substrate/images/bridge/reaction"
	"github.com/ajbouh/substrate/images/bridge/tracks"
	"github.com/ajbouh/substrate/images/bridge/transcribe"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
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

type OfferNotification tracks.EventT[*OfferEvent]

var recordTrigger = tracks.EventRecorder[*TriggerEvent]("tool-trigger")

type TriggerEvent struct {
	SourceEvent tracks.ID
	OfferEvent  tracks.ID
	Name        string
	Call        Call[any]
}

type TriggerNotification tracks.EventT[*TriggerEvent]

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

type OfferAgent struct {
	Name      string
	Registry  ToolLister
	Completer interface {
		Complete(map[string]any) (string, string, error)
	}
	Reactor *reaction.Reactor
}

func (a *OfferAgent) Reactions(ctx context.Context) []reaction.CommandRuleInput {
	return []reaction.CommandRuleInput{
		a.Reactor.Rule("tools:offer", "transcription"),
	}
}

func (a *OfferAgent) Commands(ctx context.Context) commands.Source {
	return reaction.CommandSingle(a.Reactor, "tools:offer",
		"Offer tool suggestions for transcriptions",
		a.handle,
	)
}

func (a *OfferAgent) handle(ctx context.Context, event transcribe.Event) ([]tracks.PathEvent, error) {
	in := event.Data
	text := in.Text()
	if !strings.Contains(strings.ToLower(text), a.Name) {
		return nil, nil
	}
	prompt, calls, err := a.CompleteTool(text)
	if err != nil {
		slog.ErrorContext(ctx, "tools: error completing tool", "err", err)
		return nil, err
	}
	return []tracks.PathEvent{
		{
			EventMeta: tracks.EventMeta{
				ID:    tracks.NewID(),
				Start: event.Start,
				End:   event.End,
				Type:  "tool-offer",
			},
			Path:    "/tools/offer",
			TrackID: event.TrackID,
			Data: &OfferEvent{
				SourceEvent: event.ID,
				Name:        a.Name,
				Prompt:      prompt,
				Calls:       calls,
			},
		},
	}, nil
}

func (a *OfferAgent) CompleteTool(input string) (string, []Call[any], error) {
	defs, err := a.Registry.ListTools(context.TODO())
	if err != nil {
		return "", nil, err
	}
	prompt, resp, err := a.Completer.Complete(map[string]any{
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

type AutoTriggerAgent struct {
	Reactor *reaction.Reactor
}

func (a *AutoTriggerAgent) Reactions(ctx context.Context) []reaction.CommandRuleInput {
	return []reaction.CommandRuleInput{
		a.Reactor.Rule("tools:trigger", "tools/offer"),
	}
}

func (a *AutoTriggerAgent) Commands(ctx context.Context) commands.Source {
	return reaction.CommandSingle(a.Reactor, "tools:trigger",
		"Trigger calling an offer",
		a.handle,
	)
}

func (a AutoTriggerAgent) handle(ctx context.Context, event OfferNotification) ([]tracks.PathEvent, error) {
	offer := event.Data
	if len(offer.Calls) == 0 {
		return nil, nil
	}
	return []tracks.PathEvent{
		{
			EventMeta: tracks.EventMeta{
				ID:    tracks.NewID(),
				Start: event.Start,
				End:   event.End,
				Type:  "tool-trigger",
			},
			Path:    "/tools/trigger",
			TrackID: event.TrackID,
			Data: &TriggerEvent{
				SourceEvent: offer.SourceEvent,
				OfferEvent:  event.ID,
				Name:        offer.Name,
				Call:        offer.Calls[0],
			},
		},
	}, nil
}

type CallAgent struct {
	Name    string
	Runner  Runner
	Reactor *reaction.Reactor
}

func (a *CallAgent) Reactions(ctx context.Context) []reaction.CommandRuleInput {
	return []reaction.CommandRuleInput{
		a.Reactor.Rule("tools:call", "tools/trigger"),
	}
}

func (a *CallAgent) Commands(ctx context.Context) commands.Source {
	return reaction.CommandSingle(a.Reactor, "tools:call",
		"Call a tool",
		a.handle,
	)
}

func (a *CallAgent) handle(ctx context.Context, event TriggerNotification) ([]tracks.PathEvent, error) {
	trigger := event.Data
	if trigger.Name != a.Name {
		return nil, nil
	}
	result, err := a.Runner.RunTool(context.TODO(), trigger.Call)
	if err != nil {
		return nil, err
	}
	return []tracks.PathEvent{
		{
			EventMeta: tracks.EventMeta{
				ID:    tracks.NewID(),
				Start: event.Start,
				End:   event.End,
				Type:  "tool-call",
			},
			Path:    "/tools/call",
			TrackID: event.TrackID,
			Data: &CallEvent{
				Name:         a.Name,
				SourceEvent:  trigger.SourceEvent,
				TriggerEvent: event.ID,
				Call:         trigger.Call,
				Response: Response[any]{
					Content: result,
				},
			},
		},
	}, nil
}

type OpenAICompleter struct {
	Runner   commands.DefRunner
	Template string
}

func (oc *OpenAICompleter) Complete(templateArgs map[string]any) (string, string, error) {
	prompt, err := prompts.Render(oc.Template, templateArgs)
	if err != nil {
		return prompt, "", err
	}
	resp, err := openai.CompleteWithFrontmatter(oc.Runner, prompt)
	return prompt, resp, err
}
