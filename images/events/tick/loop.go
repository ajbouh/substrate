package tick

import (
	"context"
	"log/slog"
	"time"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type Loop[Input any, Gathered any, Output any] struct {
	Ticker  *Ticker[Input, Gathered, Output]
	Querier event.Querier
}

func (l *Loop[Input, Gathered, Output]) Serve(ctx context.Context) {
	var prevMax event.ID
	for {
		max, err := l.Querier.QueryMaxID(ctx)
		if err != nil {
			slog.Error("error reading latest eventID")
		}

		if prevMax.Compare(max) != 0 {
			prevMax = max

			// todo streamer

			more := true
			for ctx.Err() == nil && more {
				tick, err := l.Ticker.Tick(ctx, max)
				if err != nil {
					slog.Error("error during tick", "err", err)
					return
				}

				more = tick.More
			}
		}

		if ctx.Err() != nil {
			break
		}

		// HACK polling here is kind of gross...
		// Instead we should define triggers that write to a "queue" table that tracks the smallest
		// for work.
		// Tick should be *updating* running "rule tickers" that each respond to a trigger

		// TODO we should be storing the "until" in use when we wrote a given file.
		time.Sleep(10 * time.Second)
	}
}

// we can create a sort of simplified "filesystem view" if we filter for the "latest" event for a given path.
// files are considered deleted if the most recent event for that path has a "deleted" field. if true, we ignore the existence of the file.

// a rule is a pattern for generating new events from existing ones.
// using the "filesystem view" described above, any event with a "rules/" path prefix is interpreted as a rule.
// to bootstrap, the system watches the "rules/" path prefix and adds/removes listeners to path/type combinations based on each rule still valid
// on boot we need to start up all matching listeners
// on deletion (or "disabled" = true) we teardown the listener.
// here are the fields we care about in a rule:

// when a rule is run, we invoke its command with parameters:
// - "rule" (includes any fields that define the rule, including "conditions", "queries", "command")
// - "events" (a single ordered list of all matching events)

// when we start watching a rule, find the most recent event with the path "cursors/$rule_cursor" for the last event id processed.
// we do a select against the rule's "conditions" with the added constraint that it must be *after* the cursor's stored id. if we discover any events we run the rule.
// we take the "events" field returned by the command and write it to the store
// (including an event to update "cursors/$rule_cursor").

// to make this efficient we can add triggers for all rules. and re-evaluate the need to a rule whenever that rule's trigger fires.
