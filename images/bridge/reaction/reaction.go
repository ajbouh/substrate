package reaction

import (
	"context"
	"encoding/json"
	"log/slog"
	"strings"

	"github.com/ajbouh/substrate/images/bridge/tracks"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type CommandRuleInput struct {
	Path     string `json:"path"`
	Disabled bool   `json:"disabled,omitempty"`
	Deleted  bool   `json:"deleted,omitempty"`

	Conditions []*event.Query  `json:"conditions"`
	Command    commands.Fields `json:"command"`

	// Cursor *CommandRuleCursor `json:"-"`
}

type Reactor struct {
	EventPathPrefix string
	CommandURL      string
}

func ptr[T any](t T) *T {
	return &t
}

func (r *Reactor) Rule(name, inPath string) CommandRuleInput {
	return CommandRuleInput{
		Path: "/rules/defs" + r.EventPathPrefix + name,
		Conditions: []*event.Query{
			{
				EventsWherePrefix: map[string][]event.WherePrefix{
					"path": {{Prefix: r.EventPathPrefix + inPath}},
				},
			},
		},
		Command: commands.Fields{
			"meta": commands.Meta{
				"#/data/parameters/events": {Type: "any"},
				"#/data/returns/events":    {Type: "any"},
			},
			"msg_in": commands.Bindings{
				"#/msg/data/parameters/events": "#/data/parameters/events",
			},
			"msg_out": commands.Bindings{
				"#/data/returns/next": "#/msg/data/returns/next",
			},
			"msg": &commands.Fields{
				"cap": "reflect",
				"data": commands.Fields{
					"url":  r.CommandURL,
					"name": name,
				},
			},
		},
	}
}

func Command[T any](reactor *Reactor, name, description string, f func(context.Context, []T) ([]tracks.PathEvent, error)) commands.Source {
	return handle.Command(name, description, func(ctx context.Context, t *struct{}, args struct {
		Events []event.Event `json:"events" doc:""`
	}) (Result, error) {
		r := Result{
			Next: []event.PendingEvent{},
		}
		events, err := event.Unmarshal[T](args.Events, true)
		if err != nil {
			slog.ErrorContext(ctx, "unable to Unmarshal", "command", name, "err", err)
			return r, err
		}
		results, err := f(ctx, events)
		if err != nil {
			return r, err
		}
		pes, err := ToPendingEvents(reactor.EventPathPrefix, results)
		if err != nil {
			return r, err
		}
		r.Next = pes
		return r, nil
	})
}

func CommandSingle[T any](reactor *Reactor, name, description string, f func(context.Context, T) ([]tracks.PathEvent, error)) commands.Source {
	return Command(reactor, name, description,
		func(ctx context.Context, events []T) ([]tracks.PathEvent, error) {
			slog.InfoContext(ctx, name, "num_events", len(events))
			var results []tracks.PathEvent
			for _, e := range events {
				events, err := f(ctx, e)
				if err != nil {
					return nil, err
				}
				results = append(results, events...)
			}
			return results, nil
		},
	)
}

type ReactionProvider interface {
	Reactions(context.Context) []CommandRuleInput
}

type Result struct {
	Next []event.PendingEvent `json:"next" doc:""`
}

func pathJoin(a, b string) string {
	a = strings.TrimRight(a, "/")
	b = strings.TrimLeft(b, "/")
	return a + "/" + b
}

func ToPendingEvents(prefix string, events []tracks.PathEvent) ([]event.PendingEvent, error) {
	var pes []event.PendingEvent
	for _, e := range events {
		e.Path = pathJoin(prefix, e.Path)
		pe, err := json.Marshal(e)
		if err != nil {
			return nil, err
		}
		pes = append(pes, event.PendingEvent{Fields: pe})
	}
	return pes, nil
}
