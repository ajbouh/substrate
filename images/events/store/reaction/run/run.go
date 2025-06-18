package reactionrun

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"

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

	return Run(ctx, querier, maxID, id, evt.Payload)
}

var ErrReactionBadFormat = errors.New("reaction: bad format")
var ErrReactionMissingSource = errors.New("reaction: missing source")

func Run(ctx context.Context, querier reaction.Querier, maxID, id event.ID, fields []byte) (*event.PendingEventSet, error) {
	var f reaction.ReactionRecord

	err := json.Unmarshal(fields, &f)
	if err != nil {
		return nil, ErrReactionBadFormat
	}

	if f.Type != "reaction" {
		return nil, ErrReactionBadFormat
	}

	f.Reaction.ShadowRawFields = fields

	fields, err = sjson.DeleteBytes(fields, "reaction.when")
	if err != nil {
		return nil, fmt.Errorf("reaction: could not strip when from fields: %w", err)
	}

	fields, err = sjson.DeleteBytes(fields, "reaction.resume")
	if err != nil {
		return nil, fmt.Errorf("reaction: could not strip resume from fields: %w", err)
	}

	f.Reaction.RawFields = fields
	f.Reaction.ID = id

	if f.Reaction.Source == "" {
		return nil, ErrReactionMissingSource
	}

	stepper := NewStepper(ctx, &f.Reaction)
	defer stepper.Close()

	step := f.Reaction.NewStep(ctx, querier, maxID)
	pause := stepper.Run(step)
	return step.MakeResult(pause)
}
