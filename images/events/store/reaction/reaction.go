package reaction

import (
	"context"
	"encoding/json"
	"log/slog"
	"time"

	"github.com/ajbouh/substrate/images/events/store/reaction/timing"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type ReactionRecord struct {
	Type     string   `json:"type"`
	Reaction Reaction `json:"reaction"`
}

const DefaultReactionTimeout = 500 * time.Millisecond

type Reaction struct {
	ID              event.ID        `json:"-"`
	RawFields       json.RawMessage `json:"-"`
	ShadowRawFields json.RawMessage `json:"-"`

	Type   string `json:"type"`
	Source string `json:"source"`

	Resume *struct {
		Journal Journal `json:"journal"`
	} `json:"resume"`

	RuntimeOptions struct {
		ExecuteTimeout *uint64 `json:"execute_timeout"` // milliseconds
		MaxStackSize   *uint64 `json:"max_stack_size"`
		MemoryLimit    *uint64 `json:"memory_limit"` // bytes
		GCThreshold    *int64  `json:"gc_threshold"` // bytes

		Globals map[string]json.RawMessage `json:"globals"`
	} `json:"runtime_options"`
}

func (r *Reaction) Deadline() time.Time {
	timeout := DefaultReactionTimeout
	opts := r.RuntimeOptions
	if opts.ExecuteTimeout != nil {
		timeout = time.Duration(*opts.ExecuteTimeout) * time.Millisecond
	}

	return time.Now().Add(timeout)
}

type Querier interface {
	event.Querier
	event.DataQuerier
}

func (r *Reaction) NewStep(ctx context.Context, querier Querier, maxID event.ID) *Step {
	ctx, cancelParent := context.WithDeadline(ctx, r.Deadline())
	ctx, cancel := context.WithCancelCause(ctx)

	var journal Journal
	if r.Resume != nil {
		journal = r.Resume.Journal
	}

	return &Step{
		checksumResolver: ResolveChecksum,
		resume: &Resume{
			Now:     maxID,
			Offset:  0,
			Journal: *journal.Clone(),

			CurrentReactionID: r.ID,

			DefaultChecksumAlgorithm: DefaultChecksumAlgorithm,

			isReplaying: journal.Len() > 0,
		},

		ctx:      ctx,
		reaction: r,
		querier:  querier,
		cancel: func(cause error) {
			slog.Info("Reaction.NewStep()", "cause", cause)
			cancel(cause)
			cancelParent()
		},
		timings: &timing.Timings{},
	}
}
