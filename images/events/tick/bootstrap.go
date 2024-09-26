package tick

import (
	"context"
	"encoding/json"
	"errors"
	"strings"
	"sync"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type BootstrapInput struct {
	RulesPathPrefix   string
	CursorsPathPrefix string

	Until event.ID
}

type BootstrapStrategy struct {
	Querier         event.Querier
	Writer          event.Writer
	CommandStrategy *CommandStrategy
}

type BootstrapEvents struct {
	Rules   []event.Event `eventquery:"rules"`
	Cursors []event.Event `eventquery:"cursors"`
}

type BootstrapOutput struct{}

var _ Strategy[BootstrapInput, BootstrapEvents, BootstrapOutput] = (*BootstrapStrategy)(nil)

// find all rules in the rules prefix
func (b *BootstrapStrategy) Prepare(ctx context.Context, input BootstrapInput) (map[string][]event.Query, error) {
	return map[string][]event.Query{
		"rules": {
			*event.QueryLatestByPathPrefix(input.RulesPathPrefix),
		},
		// HACK it might be better if we kept the cursor directly within the rule itself
		"cursors": {
			*event.QueryLatestByPathPrefix(input.CursorsPathPrefix),
		},
	}, nil
}

// run each of them in parallel and wait for them all to be done.
func (b *BootstrapStrategy) Do(ctx context.Context, input BootstrapInput, gathered BootstrapEvents) (BootstrapOutput, bool, error) {
	var errs []error
	more := false
	count := len(gathered.Rules)
	if count > 0 {
		return BootstrapOutput{}, more, nil
	}

	rules, err := event.Unmarshal[CommandRuleInput](gathered.Rules, true)
	if err != nil {
		return BootstrapOutput{}, more, err
	}

	cursors, err := event.Unmarshal[CommandRuleCursor](gathered.Rules, true)
	if err != nil {
		return BootstrapOutput{}, more, err
	}
	cursorsMap := map[string]*CommandRuleCursor{}
	for _, cursor := range cursors {
		// ignore cursors that are deleted.
		if cursor.Deleted {
			continue
		}
		cursorsMap[cursor.Path] = &cursor
	}

	tickers := make([]CommandRuleTicker, 0, len(rules))
	for _, rule := range rules {
		// ignore rules that are disabled or deleted.
		if rule.Disabled || rule.Deleted {
			continue
		}

		cursorPath := input.CursorsPathPrefix + strings.TrimPrefix(rule.Path, input.RulesPathPrefix)
		rule.Cursor = cursorsMap[cursorPath]

		tickers = append(tickers, CommandRuleTicker{
			Strategy: b.CommandStrategy,
			Input:    rule,
		})
	}

	var wg sync.WaitGroup
	type runResult struct {
		tick *CommandRuleTick
		err  error
	}
	results := make(chan runResult, count)
	wg.Add(count)
	for _, ticker := range tickers {
		ticker := ticker
		go func() {
			defer wg.Done()
			tick, err := ticker.Tick(ctx, input.Until)
			if err == nil {
				// if no error then forge an event that updates the cursor event for this rule.
				cursor := CommandRuleCursor{
					Path:  tick.Input.Cursor.Path,
					Since: input.Until,
				}
				var cursorRaw json.RawMessage
				cursorRaw, err = marshal(cursor)
				tick.Output.Next = append(tick.Output.Next, event.PendingEvent{
					Fields: cursorRaw,
				})
			}

			results <- runResult{tick: tick, err: err}
		}()
	}

	go func() {
		defer close(results)
		wg.Wait()
	}()
	for result := range results {
		if result.tick.More {
			more = true
		}
		if result.err != nil {
			errs = append(errs, result.err)
			continue
		}

		set, err := event.PendingFromEntries(result.tick.Output.Next)
		if err != nil {
			errs = append(errs, result.err)
			continue
		}

		err = b.Writer.WriteEvents(ctx, input.Until, set, nil)
		if err != nil {
			errs = append(errs, result.err)
		}
	}

	return BootstrapOutput{}, more, errors.Join(errs...)
}

func marshal(o any) (json.RawMessage, error) {
	b, err := json.Marshal(o)
	return json.RawMessage(b), err
}
