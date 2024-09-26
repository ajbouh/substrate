package units

import (
	"context"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type EventURLs struct {
	URLForEvent func(ctx context.Context, eventID event.ID) string
}
