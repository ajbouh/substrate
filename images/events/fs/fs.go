package eventfs

import (
	"context"
	"io/fs"
	"log/slog"
	"path"
	"strings"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type EventPrefixAsFS interface {
	EventPrefixAsFS(ctx context.Context, prefix string, readOnly bool) (fs.FS, error)
}

type EventReadFS struct {
	Querier event.Querier
	Until   *event.ID
	Prefix  string
}

var _ fs.FS = (*EventReadFS)(nil)

func (e *EventReadFS) Open(name string) (f fs.File, err error) {
	// Adjust paths like ".", "/.", etc.
	pathName := path.Join(e.Prefix, name)
	dir, base := path.Split(pathName)
	if base == "." {
		pathName = dir
	}

	defer func() {
		slog.Info("EventReadFS.Open()", "name", name, "pathName", pathName, "f", f, "err", err)
	}()

	ctx := context.Background()
	if !strings.HasSuffix(pathName, "/") {
		var ev *event.Event
		query := event.QueryLatestByPath(pathName)
		if e.Until != nil {
			query.Until(*e.Until)
		}
		ev, err = event.QueryEvent(ctx, e.Querier, query)
		if err != nil {
			return
		}

		if ev != nil {
			f = &roFile{
				name:  pathName,
				event: ev,
			}
			return
		}

		// if there is no file with that name, maybe it's a directory?
		if !strings.HasSuffix(pathName, "/") {
			pathName += "/"
		}
	}

	query := event.QueryLatestPathDirEntriesByPathPrefix(pathName)
	if e.Until != nil {
		query.Until(*e.Until)
	}
	var events []event.Event
	events, _, err = e.Querier.QueryEvents(ctx, query)
	if err != nil {
		return
	}

	// it's not a directory!
	if len(events) == 0 {
		err = fs.ErrNotExist
		return
	}

	entries, err := event.Unmarshal[filePayloadFields](events, true)
	if err != nil {
		return
	}
	f = &roDir{
		name:    pathName,
		entries: entries,
		events:  events,
	}
	return
}
