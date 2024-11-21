package units

import (
	"context"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
	"github.com/ajbouh/substrate/pkg/toolkit/links"
)

// A helper type to resolve HREFs for event links that are eventrefs
type EventWithLinks struct {
	Links map[string]links.Link `json:"links"` // use Rel="eventref" and attributes "eventref:start", "eventref:end", "eventref:unit", "eventref:axis"
}

func (e *EventWithLinks) AddEventRefHREFs(ctx context.Context, urlForEvent func(ctx context.Context, eventID event.ID) string) error {
	for k, v := range e.Links {
		if v.Rel == "eventref" && v.Attributes != nil {
			refEventV := v.Attributes["eventref:event"]
			if refEvent, ok := refEventV.(string); ok {
				refEventID, err := event.ParseID(refEvent)
				if err != nil {
					return err
				}
				v.HREF = urlForEvent(ctx, refEventID)
			}
		}
		e.Links[k] = v
	}

	return nil
}

// for identifying what other event this event "came from", and even more specifically
// where in that original event, this event is source. for example:
// - the byte range an embedding applies to
// - the specific audio frames that a transcription covers
// - the number of seconds into a video a specific reference has been identified
type EventIntervalReference struct {
	RefEvent event.ID
	RefStart any    // should these be strings? what if we're talking about entries in a zip file? or a git commit?
	RefEnd   any    // should these be strings? what if we're talking about entries in a zip file? or a git commit?
	RefUnit  string // "byte", "frame", "second"
	RefAxis  string // "bytes", "audiotrack/1"
}
