package reactionrun

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"

	"github.com/ajbouh/substrate/images/events/store/reaction"
	reactionquickjs "github.com/ajbouh/substrate/images/events/store/reaction/quickjs"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
	"github.com/tidwall/sjson"
)

type Stepper interface {
	Run(step *reaction.Step) *reaction.Pause
	Close()
}

func NewStepper(ctx context.Context, r *reaction.Reaction) Stepper {
	return reactionquickjs.NewStepper(r)
}

func RunID(ctx context.Context, querier reaction.Querier, maxID event.ID, id event.ID) (*event.PendingEventSet, error) {
	evt, _, err := event.QueryEvent(ctx, querier, event.QueryByID(id))
	if err != nil {
		return nil, err
	}

	var source string
	rsc, err := querier.QueryEventData(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("reaction: could not query source: %w", err)
	}

	if rsc != nil {
		sourceB, err := io.ReadAll(rsc)
		if err != nil {
			return nil, fmt.Errorf("reaction: error reading source: %w", err)
		}
		source = string(sourceB)

		if err = rsc.Close(); err != nil {
			return nil, fmt.Errorf("reaction: error closing source: %w", err)
		}
	}

	return Run(ctx, querier, maxID, id, evt.Payload, source)
}

var ErrReactionBadFormat = errors.New("reaction: bad format")
var ErrReactionMissingSource = errors.New("reaction: missing source")

func Run(ctx context.Context, querier reaction.Querier, maxID, id event.ID, fields []byte, source string) (*event.PendingEventSet, error) {
	var f reaction.ReactionRecord

	err := json.Unmarshal(fields, &f)
	if err != nil {
		return nil, ErrReactionBadFormat
	}

	var rxn *reaction.Reaction
	switch f.Type {
	case "reaction":
		rxn = f.Reaction
		if rxn == nil {
			rxn = &reaction.Reaction{}
		}
	case "reaction-continuation":
		rxn = f.ReactionContinuation
	default:
		return nil, ErrReactionBadFormat
	}

	if rxn == nil {
		rxn = &reaction.Reaction{}
	}
	rxn.Type = f.Type

	rxn.ShadowRawFields = fields
	rxn.Source = source

	fields, err = sjson.DeleteBytes(fields, "reaction.when")
	if err != nil {
		return nil, fmt.Errorf("reaction: could not strip when from fields: %w", err)
	}

	rxn.RawFields = fields
	rxn.ID = id

	if rxn.Source == "" {
		return nil, ErrReactionMissingSource
	}

	stepper := NewStepper(ctx, rxn)
	defer stepper.Close()

	step := rxn.NewStep(ctx, querier, maxID)
	pause := stepper.Run(step)
	return step.MakeResult(pause)
}
