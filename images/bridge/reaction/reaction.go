package reaction

import (
	"encoding/json"
	"strings"

	"github.com/ajbouh/substrate/images/bridge/tracks"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type Result struct {
	Next []event.PendingEvent `json:"next" doc:""`
}

func pathJoin(a, b string) string {
	a = strings.TrimRight(a, "/")
	b = strings.TrimLeft(b, "/")
	return a + "/" + b
}

func ToPendingEvents(prefix string, events []tracks.PathEvent) ([]event.PendingEvent, error) {
	var pes []event.PendingEvent
	for _, e := range events {
		e.Path = pathJoin(prefix, e.Path)
		pe, err := json.Marshal(e)
		if err != nil {
			return nil, err
		}
		pes = append(pes, event.PendingEvent{Fields: pe})
	}
	return pes, nil
}
