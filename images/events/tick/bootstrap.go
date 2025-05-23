package tick

import (
	"context"
	"encoding/json"
	"errors"
	"log/slog"
	"strings"
	"sync"
	"time"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type BootstrapInput struct {
	RulesPathPrefix   string
	CursorsPathPrefix string
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

type BoostrapTicker = Ticker[*BootstrapInput, BootstrapEvents, BootstrapOutput]
type BootstrapLoop = Loop[*BootstrapInput, BootstrapEvents, BootstrapOutput]

var _ Strategy[*BootstrapInput, BootstrapEvents, BootstrapOutput] = (*BootstrapStrategy)(nil)

// find all rules in the rules prefix
func (b *BootstrapStrategy) Prepare(ctx context.Context, input *BootstrapInput) (map[string][]*event.Query, error) {
	slog.Info("BootstrapStrategy.Prepare()", "input", input)

	return map[string][]*event.Query{
		"rules": {
			event.QueryLatestByPathPrefix(input.RulesPathPrefix),
		},
		// HACK it might be better if we kept the cursor directly within the rule itself
		"cursors": {
			event.QueryLatestByPathPrefix(input.CursorsPathPrefix),
		},
	}, nil
}

func (t *BootstrapEvents) LogValue() slog.Value {
	return slog.GroupValue(
		slog.Attr{
			Key:   "len(Rules)",
			Value: slog.AnyValue(len(t.Rules)),
		},
		slog.Attr{
			Key:   "len(Cursors)",
			Value: slog.AnyValue(len(t.Cursors)),
		},
	)
}

// run each of them in parallel and wait for them all to be done.
func (b *BootstrapStrategy) Do(ctx context.Context, input *BootstrapInput, gathered BootstrapEvents, until event.ID) (BootstrapOutput, bool, error) {
	var rules []CommandRuleInput
	var cursors []CommandRuleCursor
	var tickers []CommandRuleTicker
	var err error

	more := false

	defer func() {
		slog.Info("BootstrapStrategy.Do()", "len(gathered.Rules)", len(gathered.Rules), "len(rules)", len(rules), "len(cursors)", len(cursors), "rules", rules, "cursors", cursors, "len(tickers)", len(tickers), "err", err)
	}()

	if len(gathered.Rules) == 0 {
		return BootstrapOutput{}, more, nil
	}

	rules, err = event.Unmarshal[CommandRuleInput](gathered.Rules, true)
	if err != nil {
		return BootstrapOutput{}, more, err
	}

	cursors, err = event.Unmarshal[CommandRuleCursor](gathered.Cursors, true)
	if err != nil {
		return BootstrapOutput{}, more, err
	}
	cursorsMap := map[string]*CommandRuleCursor{}
	for _, cursor := range cursors {
		// ignore cursors that are deleted.
		if cursor.Deleted {
			continue
		}
		if !strings.HasPrefix(cursor.Path, input.CursorsPathPrefix) {
			slog.Info("BootstrapStrategy.Do() skipping cursor that we shouldn't have", "cursor.Path", cursor.Path)
			continue
		}
		cursorsMap[cursor.Path] = &cursor
	}

	tickers = make([]CommandRuleTicker, 0, len(rules))
	for _, rule := range rules {
		// ignore rules that are disabled or deleted.
		if rule.Disabled || rule.Deleted {
			continue
		}
		if !strings.HasPrefix(rule.Path, input.RulesPathPrefix) {
			slog.Info("BootstrapStrategy.Do() skipping rule that we shouldn't have", "rule.Path", rule.Path)
			continue
		}

		cursorPath := input.CursorsPathPrefix + strings.TrimPrefix(rule.Path, input.RulesPathPrefix)
		cursor, ok := cursorsMap[cursorPath]
		if !ok {
			cursor = &CommandRuleCursor{}
		}
		cursor.Path = cursorPath
		rule.Cursor = cursor

		tickers = append(tickers, CommandRuleTicker{
			Strategy: b.CommandStrategy,
			Input:    rule,
			Querier:  b.Querier,
		})
	}

	if len(tickers) == 0 {
		return BootstrapOutput{}, more, nil
	}

	var wg sync.WaitGroup
	type runResult struct {
		tick *CommandRuleTick
		err  error
	}
	results := make(chan runResult)
	wg.Add(len(tickers))
	for _, ticker := range tickers {
		ticker := ticker
		go func() {
			defer wg.Done()
			tick, err := ticker.Tick(ctx, until)
			if err == nil {
				// if no error then forge an event that updates the cursor event for this rule.
				cursor := CommandRuleCursor{
					Path:  tick.Input.Cursor.Path,
					Since: until,
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
	remaining := len(tickers)
	var errs []error
	start := time.Now()

	for {
		select {
		case <-time.After(10 * time.Second):
			slog.InfoContext(ctx, "BootstrapStrategy.Do() waiting", "elapsed", time.Since(start).Round(time.Millisecond), "remaining", remaining)
		case result, ok := <-results:
			if !ok {
				slog.InfoContext(ctx, "BootstrapStrategy.Do() results closed", "remaining", remaining)
				return BootstrapOutput{}, more, errors.Join(errs...)
			}
			remaining--
			slog.InfoContext(ctx, "BootstrapStrategy.Do() result", "remaining", remaining, "result", result)

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

			err = b.Writer.WriteEvents(ctx, until, set, nil)
			if err != nil {
				errs = append(errs, result.err)
			}
		}
	}
}

func marshal(o any) (json.RawMessage, error) {
	b, err := json.Marshal(o)
	return json.RawMessage(b), err
}
