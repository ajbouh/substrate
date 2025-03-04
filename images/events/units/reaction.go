package units

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"

	"github.com/ajbouh/substrate/images/events/tick"
	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type ReactionResult struct {
	Output *tick.CommandRuleOutput `json:"output"`
	More   bool                    `json:"more"`
	Errors []string                `json:"errors"`
}

var TryReactionCommand = handle.Command(
	"events:try-reaction", "Test an event reaction",
	func(ctx context.Context,
		t *struct {
			// Writer event.Writer
			Querier         event.Querier
			CommandStrategy *tick.CommandStrategy
		},
		args struct {
			Events []event.PendingEvent `json:"events"`
			Since  *event.ID            `json:"since"`
		},
	) (ReactionResult, error) {
		errResult := func(err error) (ReactionResult, error) {
			slog.ErrorContext(ctx, "TryReactionCommand", "error", err)
			return ReactionResult{
				Errors: []string{err.Error()},
			}, nil
		}

		slog.InfoContext(ctx, "TryReactionCommand", "t", t, "args", args)
		if len(args.Events) != 1 {
			return errResult(fmt.Errorf("expected exactly one event but got %d", len(args.Events)))
		}

		// check that path matches RulesPathPrefix

		var in tick.CommandRuleInput
		if err := json.Unmarshal(args.Events[0].Fields, &in); err != nil {
			return errResult(fmt.Errorf("error unmarshalling: %s", err))
		}

		queries, err := t.CommandStrategy.Prepare(ctx, in)
		if err != nil {
			return errResult(fmt.Errorf("CommandStrategy.Prepare: %s", err))
		}

		var r ReactionResult

		results, more, errs := queryAllEvents(ctx, t.Querier, queries)
		r.More = more
		output, doMore, err := t.CommandStrategy.Do(ctx, in, tick.CommandRuleEvents{
			Conditions: results["conditions"],
		}, event.MakeID())
		if err != nil {
			errs = append(errs, err)
		}
		if doMore {
			r.More = true
		}
		r.Output = output
		for _, err := range errs {
			r.Errors = append(r.Errors, err.Error())
		}
		if len(errs) > 0 {
			slog.ErrorContext(ctx, "TryReactionCommand", "errors", errs)
		}
		slog.InfoContext(ctx, "TryReactionCommand", "output", output, "more", more)
		return r, nil
	})

func queryAllEvents(ctx context.Context, querier event.Querier, keyedQueries map[string][]*event.Query) (map[string][]event.Event, bool, []error) {
	var errs []error
	var more bool
	results := map[string][]event.Event{}
	for key, queries := range keyedQueries {
		for _, q := range queries {
			events, qMore, err := querier.QueryEvents(ctx, q)
			if err != nil {
				errs = append(errs, err)
				continue
			}
			if qMore {
				more = true
			}
			results[key] = append(results[key], events...)
		}
		slog.InfoContext(ctx, "queryAllEvents", "key", key, "len(results[key])", len(results[key]), "len(errs)", len(errs), "errs", errs)
	}

	return results, more, errs
}
