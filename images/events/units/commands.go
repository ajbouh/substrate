package units

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"strings"

	"github.com/ajbouh/substrate/images/events/store"
	"github.com/ajbouh/substrate/pkg/toolkit/event"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/links"
)

type Entry struct {
	Event         event.Event `json:"event"`
	Data          any         `json:"data"`
	DataTruncated bool        `json:"truncated,omitempty"`
}

type GetTreeRawPathReturns struct {
	Entries []Entry `json:"events"`
}

var GetTreeRawPathCommand = commands.HTTPCommand(
	"events:get", "Get latest events by path and/or prefix",
	"GET /tree/events/{path...}", "/tree/events/{path...}",

	func(ctx context.Context,
		t *struct {
			// Querier     event.Querier
			// DataQuerier event.DataQuerier
			EventStore *store.EventStore
		},
		args struct {
			Path     string   `json:"path" path:"path"`
			Until    event.ID `json:"until" query:"until"`
			Encoding string   `json:"mode" query:"encoding"`
		},
	) (GetTreeRawPathReturns, error) {
		slog.Info("GetTreeRawPathCommand", "t", t, "args", args)

		returns := GetTreeRawPathReturns{}

		var err error
		var query *event.Query

		path := args.Path
		if strings.HasSuffix(path, "/") {
			query = event.QueryLatestByPathPrefix(path)
		} else {
			query = event.QueryLatestByPath(path)
		}

		if !event.IsZeroID(args.Until) {
			query.Until(args.Until)
		}

		evts, _, err := event.QueryEvents(ctx, t.EventStore, query)
		if err != nil {
			return returns, err
		}

		if len(evts) == 0 {
			return returns, &commands.HTTPStatusError{
				Err:    nil,
				Status: 404,
			}
		}

		returns.Entries = make([]Entry, 0, len(evts))
		for i, evt := range evts {
			returns.Entries = append(returns.Entries, Entry{
				Event:         evt,
				DataTruncated: true,
			})

			if evt.DataSize != nil && *evt.DataSize != 0 {
				r, err := t.EventStore.QueryEventData(ctx, evt.ID)
				if err != nil {
					return returns, err
				}

				var n int64
				var data any
				if args.Encoding == "base64" {
					var b []byte
					b, err = io.ReadAll(r)
					n = int64(len(b))
					data = base64.RawStdEncoding.EncodeToString(b)
				} else {
					buf := new(strings.Builder)
					n, err = io.Copy(buf, r)
					if err != nil {
						return returns, err
					}
					data = buf.String()
				}
				entry := &returns.Entries[i]
				entry.DataTruncated = n != int64(*evt.DataSize)
				entry.Data = data
				if err != nil {
					return returns, err
				}
			}
		}

		slog.Info("GetTreeRawPathCommand", "returns", returns)

		return returns, nil
	})

var GetTreeDataPathCommand = commands.HTTPCommand(
	"event:get", "Get latest event by path",
	"GET /tree/data/{path...}", "/tree/data/{path...}",

	func(ctx context.Context,
		t *struct {
			Querier     event.Querier
			DataQuerier event.DataQuerier
		},
		args struct {
			Path  string   `json:"path" path:"path"`
			Until event.ID `json:"until" query:"until"`

			Writer http.ResponseWriter `json:"-"`
		},
	) (struct{}, error) {
		slog.Info("GetTreeDataPathCommand", "t", t, "args", args)

		returns := struct{}{}
		var err error
		query := event.QueryLatestByPath(args.Path)
		if !event.IsZeroID(args.Until) {
			query.Until(args.Until)
		}

		event, err := event.QueryEvent(ctx, t.Querier, query)
		if err != nil {
			return returns, err
		}

		if event == nil {
			return returns, &commands.HTTPStatusError{
				Err:    nil,
				Status: 404,
			}
		}

		r, err := t.DataQuerier.QueryEventData(ctx, event.ID)
		if err != nil {
			return returns, err
		}

		_, err = io.Copy(args.Writer, r)
		return returns, err
	})

type WriteTreeDataPathReturns struct {
	EventURL string `json:"event_url"`
}

var WriteTreeDataPathCommand = commands.HTTPCommand(
	"event:write", "Write new event to path",
	"PUT /tree/data/{path...}", "/tree/data/{path...}",

	func(ctx context.Context,
		t *struct {
			Writer    event.Writer
			EventURLs *EventURLs
		},
		args struct {
			Path  string   `json:"path" path:"path"`
			Since event.ID `json:"since" query:"since"`

			Reader io.ReadCloser `json:"-"`
		},
	) (WriteTreeDataPathReturns, error) {
		slog.Info("WriteTreeDataPathCommand", "t", t, "args", args)

		defer args.Reader.Close()

		returns := WriteTreeDataPathReturns{}
		var err error

		var wroteID event.ID
		err = t.Writer.WriteEvents(ctx, args.Since,
			[]json.RawMessage{
				json.RawMessage(fmt.Sprintf(`{"path":%q}`, args.Path)),
			},
			[]io.ReadCloser{
				args.Reader,
			},
			nil,
			nil,
			func(i int, id event.ID, fieldsSize int, fieldsSha256 []byte, dataSize int64, dataSha256 []byte) {
				wroteID = id
			},
		)
		if err != nil {
			return returns, err
		}

		returns.EventURL = t.EventURLs.URLForEvent(ctx, wroteID)

		return returns, nil

	})

type GetTreeFieldsPathReturns struct {
	Event *event.Event `json:"event"`
}

var GetTreeFieldsPathCommand = commands.HTTPCommand(
	"event:get", "Get latest event by path",
	"GET /tree/fields/{path...}", "/tree/fields/{path...}",

	func(ctx context.Context,
		t *struct {
			Querier event.Querier
		},
		args struct {
			Path  string   `json:"path" path:"path"`
			Until event.ID `json:"until" query:"until"`
		},
	) (GetTreeFieldsPathReturns, error) {
		slog.Info("GetTreeFieldsPathCommand", "t", t, "args", args)

		returns := GetTreeFieldsPathReturns{}
		var err error
		query := event.QueryLatestByPath(args.Path)
		if !event.IsZeroID(args.Until) {
			query.Until(args.Until)
		}

		returns.Event, err = event.QueryEvent(ctx, t.Querier, query)
		if err != nil {
			return returns, err
		}

		if returns.Event == nil {
			return returns, &commands.HTTPStatusError{
				Err:    nil,
				Status: 404,
			}
		}

		return returns, err
	})

type WriteTreeFieldsPathReturns struct {
}

var WriteTreeFieldsPathCommand = commands.HTTPCommand(
	"event:write", "Write new event to path",
	"PUT /tree/fields/{path...}", "/tree/fields/{path...}",

	func(ctx context.Context,
		t *struct {
			Querier event.Querier

			Writer    event.Writer
			EventURLs *EventURLs
		},
		args struct {
			Path  string   `json:"path" path:"path"`
			Since event.ID `json:"since" query:"since"`

			Fields io.ReadCloser `json:"-"`
		},
	) (WriteTreeFieldsPathReturns, error) {
		slog.Info("WriteTreeFieldsPathCommand", "t", t, "args", args)

		returns := WriteTreeFieldsPathReturns{}
		var err error

		fields := map[string]any{}
		err = json.NewDecoder(args.Fields).Decode(&fields)
		args.Fields.Close()
		if err != nil {
			return returns, err
		}
		fields["path"] = args.Path

		rawFields, err := json.Marshal(fields)
		if err != nil {
			return returns, err
		}

		err = t.Writer.WriteEvents(ctx, args.Since,
			[]json.RawMessage{
				rawFields,
			},
			nil,
			nil,
			nil,
			nil,
		)
		if err != nil {
			return returns, err
		}

		return returns, nil

	})

type GetEventReturns struct {
	Event *event.Event `json:"-"`
}

var GetEventCommand = commands.HTTPCommand(
	"event:get", "Get event",
	"GET /events/{event}", "/events/{event}",

	func(ctx context.Context,
		t *struct {
			Querier event.Querier
		},
		args struct {
			ID    event.ID `json:"event" path:"event"`
			Until event.ID `json:"until" query:"until"`
		},
	) (GetEventReturns, error) {
		returns := GetEventReturns{}
		var err error
		query := event.QueryByID(args.ID)
		if !event.IsZeroID(args.Until) {
			query.Until(args.Until)
		}

		returns.Event, err = event.QueryEvent(ctx, t.Querier, query)
		return returns, err
	})

type LinksQueryReturns struct {
	Links map[string]links.Link `json:"links"`
}

func addEventRefHREFs(ctx context.Context, urls *EventURLs, l map[string]links.Link) error {
	for _, v := range l {
		if v.Rel == "eventref" && v.Attributes != nil {
			refEventV := v.Attributes["eventref:event"]
			if refEvent, ok := refEventV.(string); ok {
				refEventID, err := event.ParseID(refEvent)
				if err != nil {
					return err
				}
				v.HREF = urls.URLForEvent(ctx, refEventID)
			}
		}
	}

	return nil
}

var IDLinksQueryCommand = commands.HTTPCommand(
	"links:query", "Get links for event id",
	"GET /links/event/{event}", "/events/{event}",

	func(ctx context.Context,
		t *struct {
			Querier   event.Querier
			EventURLs *EventURLs
		},
		args struct {
			ID    event.ID `json:"event" path:"event"`
			Until event.ID `json:"until" query:"until"`
		},
	) (LinksQueryReturns, error) {
		returns := LinksQueryReturns{
			Links: map[string]links.Link{},
		}

		query := event.QueryByID(args.ID)
		if !event.IsZeroID(args.Until) {
			query.Until(args.Until)
		}

		evt, err := event.QueryEventWithFields[EventWithLinks](ctx, t.Querier, query)
		if err != nil {
			return returns, err
		}

		err = evt.AddEventRefHREFs(ctx, t.EventURLs.URLForEvent)
		returns.Links = evt.Links
		if err != nil {
			return returns, err
		}

		return returns, nil
	})

var EventPathLinksQueryCommand = commands.HTTPCommand(
	"links:query", "Get links for event by path",
	"GET /links/tree/{path...}", "/tree/{path...}",

	func(ctx context.Context,
		t *struct {
			Querier   event.Querier
			EventURLs *EventURLs
		},
		args struct {
			Path  string   `json:"path" path:"path"`
			Until event.ID `json:"until" query:"until"`
		},
	) (LinksQueryReturns, error) {
		// TODO include a link to parent path
		// TODO include a link to child paths

		returns := LinksQueryReturns{
			Links: map[string]links.Link{},
		}

		query := event.QueryLatestByPath(args.Path)
		if !event.IsZeroID(args.Until) {
			query.Until(args.Until)
		}

		evt, err := event.QueryEventWithFields[EventWithLinks](ctx, t.Querier, query)
		if err != nil {
			return returns, err
		}

		err = evt.AddEventRefHREFs(ctx, t.EventURLs.URLForEvent)
		returns.Links = evt.Links
		if err != nil {
			return returns, err
		}

		return returns, nil
	})

type WriteEventsReturns struct {
	IDs []event.ID `json:"ids"`

	FieldsSHA256s []*event.SHA256Digest `json:"fields_sha256s"`
	DataSHA256s   []*event.SHA256Digest `json:"data_sha256s"`
}

type WriteEvent struct {
	Fields json.RawMessage `json:"fields"`

	// since this is JSON, expect either raw string or base64-encoded string
	Data string `json:"data"`

	// if this is "base64", decode data that way
	DataEncoding string `json:"encoding"`

	Vector *event.VectorInput[float32] `json:"vector"`

	ConflictKeys []string `json:"conflict_keys"`
}

var WriteEventsCommand = commands.Command(
	"events:write", "Write events to store",
	func(ctx context.Context,
		t *struct {
			Writer event.Writer
		},
		args struct {
			Events []WriteEvent `json:"events"`
			Since  event.ID     `json:"since"`
		},
	) (WriteEventsReturns, error) {
		slog.Info("WriteEventsCommand", "t", t, "args", args)
		returns := WriteEventsReturns{}

		fieldses := make([]json.RawMessage, 0, len(args.Events))
		readers := make([]io.ReadCloser, 0, len(args.Events))
		vectors := make([]*event.VectorInput[float32], 0, len(args.Events))
		conflict := make([][]string, 0, len(args.Events))

		var err error
		for _, entry := range args.Events {
			fieldses = append(fieldses, entry.Fields)
			var reader io.ReadCloser
			if entry.Data != "" {
				if entry.DataEncoding == "base64" {
					b, err := base64.RawStdEncoding.DecodeString(entry.Data)
					if err != nil {
						return returns, err
					}
					reader = io.NopCloser(bytes.NewReader(b))
				} else {
					reader = io.NopCloser(strings.NewReader(entry.Data))
				}
			}
			// this is a bit of a waste. not all writes will include data. we should lazily allocate this array.
			readers = append(readers, reader)

			// this is a bit of a waste. not all writes will include vectors. we should lazily allocate this array.
			vectors = append(vectors, entry.Vector)

			// this is a bit of a waste. not all writes will include conflict. we should lazily allocate this array.
			conflict = append(conflict, entry.ConflictKeys)
		}

		// pre-allocate
		returns.IDs = make([]event.ID, 0, len(args.Events))
		returns.FieldsSHA256s = make([]*event.SHA256Digest, 0, len(args.Events))
		returns.DataSHA256s = make([]*event.SHA256Digest, 0, len(args.Events))

		err = t.Writer.WriteEvents(ctx, args.Since, fieldses, readers, vectors, conflict,
			func(i int, id event.ID, fieldsSize int, fieldsSha256 []byte, dataSize int64, dataSha256 []byte) {
				slog.Info("write pending", "i", i, "id", id,
					"fieldsSize", fieldsSize, "fieldsSha256", fieldsSha256,
					"dataSize", dataSize, "dataSha256", dataSha256,
				)
				returns.IDs = append(returns.IDs, id)
				returns.FieldsSHA256s = append(returns.FieldsSHA256s, event.SHA256DigestFromBytes(fieldsSha256))
				returns.DataSHA256s = append(returns.DataSHA256s, event.SHA256DigestFromBytes(dataSha256))
			})
		if err != nil {
			return returns, err
		}

		return returns, nil
	})

type QueryEventsReturns struct {
	Events []event.Event `json:"events"`
	More   bool          `json:"more"`
}

var QueryEventsCommand = commands.Command(
	"events:query", "Query events in store",
	func(ctx context.Context,
		t *struct {
			Querier   event.Querier
			EventURLs *EventURLs
		},
		args struct {
			View event.View `json:"view" query:"view"`

			PathPrefix *string `json:"path_prefix" query:"path_prefix"`
			Path       *string `json:"path" query:"path"`

			TypePrefix *string `json:"type_prefix" query:"type_prefix"`
			Type       *string `json:"type" query:"type"`

			After *event.ID `json:"after" query:"after"`
			Until *event.ID `json:"until" query:"until"`

			Limit *int `json:"limit" query:"limit"`
			Bias  *int `json:"bias" query:"bias"`

			VectorInManifold *event.ID  `json:"vector_in_manifold" query:"vector_in_manifold"`
			VectorNear       *[]float32 `json:"vector_near"`
			VectorLimit      *int       `json:"vector_limit"`
		},
	) (QueryEventsReturns, error) {
		returns := QueryEventsReturns{}

		sq := event.NewQuery(args.View)

		sq.ViewLimit = args.Limit
		sq.ViewBias = args.Bias

		if args.PathPrefix != nil {
			sq.AndWhereEvent("path", &event.WherePrefix{Prefix: *args.PathPrefix})
		}

		if args.Path != nil {
			sq.AndWhereEvent("path", &event.WhereCompare{Compare: "=", Value: *args.Path})
		}

		if args.TypePrefix != nil {
			sq.AndWhereEvent("type", &event.WherePrefix{Prefix: *args.TypePrefix})
		}

		if args.Type != nil {
			sq.AndWhereEvent("type", &event.WhereCompare{Compare: "=", Value: *args.Type})
		}

		if args.After != nil {
			sq.AndWhereEvent("id", &event.WhereCompare{Compare: ">", Value: *args.After})
		}

		if args.Until != nil {
			sq.AndWhereEvent("id", &event.WhereCompare{Compare: "<=", Value: *args.Until})
		}

		if args.VectorInManifold != nil {
			sq.AndWhereEvent("vector_manifold_id", &event.WhereCompare{Compare: "=", Value: *args.VectorInManifold})

			if args.VectorNear != nil {
				sq.EventsNear = &event.VectorInput[float32]{
					ManifoldID: *args.VectorInManifold,
					Data:       *args.VectorNear,
				}
			}

			if args.VectorLimit != nil {
				sq.WithEventLimit(*args.VectorLimit)
			}
		} else {
			if args.VectorNear != nil {
				return returns, &commands.HTTPStatusError{Status: http.StatusBadRequest, Message: "cannot provide near without a value for vector_in_manifold"}
			}
		}

		var err error
		slog.Info("QueryEventsCommand", "t", t, "args", args, "sq", sq)
		returns.Events, returns.More, err = t.Querier.QueryEvents(ctx, sq)
		return returns, err
	})
