package reaction

import (
	"encoding/json"
	"time"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type ResumptionConditions struct {
	Alarm *time.Time
	Query event.QuerySet
	After event.ID
}

type Pause struct {
	// indicate something went wrong to cause the pause or while calculating it.
	Err       error
	ErrFields json.RawMessage

	ResumptionConditions ResumptionConditions

	RawFields json.RawMessage

	// indicates that we're actually done
	Done bool
}

func (p *Pause) IsAborted() bool {
	return p.Err != nil
}

func (p *Pause) ShouldResume() bool {
	return !p.IsAborted() && !p.Done
}

// so we can use it as a context.Context cancel cause
var _ error = (*Pause)(nil)

func (p *Pause) Unwrap() error { return p.Err }

func (p *Pause) Error() string {
	if p.Err == nil {
		return "pause"
	}

	return "pause: " + p.Err.Error()
}
