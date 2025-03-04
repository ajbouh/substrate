package tick

import (
	"context"
	"encoding/json"
	"log/slog"
	"time"

	"github.com/ajbouh/substrate/images/events/db"
	"github.com/ajbouh/substrate/pkg/toolkit/event"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
)

type CommandRuleCursor struct {
	Path    string `json:"path"`
	Deleted bool   `json:"deleted,omitempty"`

	Since event.ID `json:"since"`
}

type CommandRuleInput struct {
	Path          string `json:"path"`
	Disabled      bool   `json:"disabled,omitempty"`
	Deleted       bool   `json:"deleted,omitempty"`
	TimeoutMillis int64  `json:"timeout_ms,omitempty"`

	Conditions []*event.Query  `json:"conditions"`
	Command    commands.Fields `json:"command"`

	Cursor *CommandRuleCursor `json:"-"`
}

type CommandRuleEvents struct {
	Conditions []event.Event `eventquery:"conditions"`
}

type CommandRuleOutput struct {
	Next []event.PendingEvent `json:"next"`
}

type CommandStrategy struct {
	Querier db.Querier

	DefaultTimeout time.Duration

	HTTPClient commands.HTTPClient
	Env        commands.Env
}

var _ Strategy[CommandRuleInput, CommandRuleEvents, *CommandRuleOutput] = (*CommandStrategy)(nil)

type CommandRuleTick = Tick[CommandRuleInput, CommandRuleEvents, *CommandRuleOutput]
type CommandRuleTicker = Ticker[CommandRuleInput, CommandRuleEvents, *CommandRuleOutput]

func (s *CommandStrategy) Prepare(ctx context.Context, input CommandRuleInput) (map[string][]*event.Query, error) {
	conditions := input.Conditions

	defer func() {
		slog.Info("CommandStrategy.Prepare()", "input.Cursor", input.Cursor, "conditions", conditions, "input", input)
	}()

	if input.Cursor != nil {
		event.MutateQueries(conditions,
			event.AndWhereEventsFunc("id", &event.WhereCompare{Compare: ">", Value: input.Cursor.Since}),
		)
	}

	return map[string][]*event.Query{
		"conditions": conditions,
	}, nil
}

func (s *CommandStrategy) Do(ctx context.Context, input CommandRuleInput, gathered CommandRuleEvents, until event.ID) (*CommandRuleOutput, bool, error) {
	slog.Info("CommandStrategy.Do()", "input", input, "input.Cursor", input.Cursor, "gathered", gathered, "until", until)
	ready := len(gathered.Conditions) > 0
	if !ready {
		return &CommandRuleOutput{}, false, nil
	}

	data := commands.Fields{
		"parameters": commands.Fields{
			"rule": commands.Fields{
				"path":       input.Path,
				"conditions": input.Conditions,
			},
			"events": gathered.Conditions,
		},
	}

	var err error
	var returns commands.Fields

	timeout := s.DefaultTimeout
	if input.TimeoutMillis > 0 {
		timeout = time.Duration(input.TimeoutMillis) * time.Millisecond
	}
	if timeout != 0 {
		var cancel context.CancelFunc
		ctx, cancel = context.WithTimeout(ctx, timeout)
		defer cancel()
	}
	returns, err = commands.MergeAndApply(s.Env.New(ctx, nil), input.Command, data)
	slog.InfoContext(ctx, "CommandStrategy.Do() RunDef", "command", input.Command, "data", data, "returns", returns, "err", err)
	if err != nil {
		return nil, false, err
	}

	// HACK re-encoding like this is pretty inefficient...
	returnsEvents, err := commands.GetPath[any](returns, "returns", "next")
	if err != nil {
		return nil, false, err
	}
	b, err := json.Marshal(returnsEvents)
	if err != nil {
		return nil, false, err
	}

	var next []event.PendingEvent
	err = json.Unmarshal(b, &next)
	if err != nil {
		return nil, false, err
	}

	return &CommandRuleOutput{
		Next: next,
	}, false, nil
}
