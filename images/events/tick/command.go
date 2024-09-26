package tick

import (
	"context"
	"encoding/json"

	"github.com/ajbouh/substrate/images/events/db"
	"github.com/ajbouh/substrate/pkg/toolkit/event"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
)

type CommandRuleCursor struct {
	Path    string `json:"path"`
	Deleted bool   `json:"deleted"`

	Since event.ID `json:"since"`
}

type CommandRuleInput struct {
	Path     string `json:"path"`
	Disabled bool   `json:"disabled"`
	Deleted  bool   `json:"deleted"`

	Conditions []event.Query `json:"conditions"`
	Command    commands.Def  `json:"command"`

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

	HTTPClient commands.HTTPClient
}

var _ Strategy[CommandRuleInput, CommandRuleEvents, *CommandRuleOutput] = (*CommandStrategy)(nil)

type CommandRuleTick = Tick[CommandRuleInput, CommandRuleEvents, *CommandRuleOutput]
type CommandRuleTicker = Ticker[CommandRuleInput, CommandRuleEvents, *CommandRuleOutput]

func (s *CommandStrategy) Prepare(ctx context.Context, input CommandRuleInput) (map[string][]event.Query, error) {
	return map[string][]event.Query{
		"conditions": event.MutateQueries(input.Conditions,
			event.AndWhereEventsFunc("id", &event.WhereCompare{Compare: ">", Value: input.Cursor.Since}),
		),
	}, nil
}

func (s *CommandStrategy) Do(ctx context.Context, input CommandRuleInput, gathered CommandRuleEvents) (*CommandRuleOutput, bool, error) {
	ready := len(gathered.Conditions) > 0
	if !ready {
		return &CommandRuleOutput{}, false, nil
	}

	parameters := commands.Fields{
		"rule": commands.Fields{
			"path":       input.Path,
			"conditions": input.Conditions,
		},
		"events": gathered.Conditions,
	}

	var err error
	var returns commands.Fields

	defRunner := commands.DefRunner{
		Def:    input.Command,
		Client: s.HTTPClient,
	}

	returns, err = defRunner.Run(ctx, parameters)
	if err != nil {
		return nil, false, err
	}

	// HACK re-encoding like this is pretty inefficient...
	returnsEvents, err := returns.Get("next")
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
