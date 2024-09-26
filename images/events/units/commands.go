package units

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"

	"github.com/ajbouh/substrate/pkg/toolkit/event"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/links"
)

type GetTreeDataPathReturns struct {
	Body io.ReadSeekCloser `json:"-"`
}

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
		query := event.QueryLatestByPath("/" + args.Path)
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

		ids, err := t.Writer.WriteEvents(ctx, args.Since,
			[]json.RawMessage{
				json.RawMessage(fmt.Sprintf(`{"path":%q}`, "/"+args.Path)),
			},
			[]io.ReadCloser{
				args.Reader,
			},
		)
		if err != nil {
			return returns, err
		}

		returns.EventURL = t.EventURLs.URLForEvent(ctx, ids[0])

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
		query := event.QueryLatestByPath("/" + args.Path)
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
	EventURL string `json:"event_url"`
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
		fields["path"] = "/" + args.Path

		rawFields, err := json.Marshal(fields)
		if err != nil {
			return returns, err
		}

		ids, err := t.Writer.WriteEvents(ctx, args.Since,
			[]json.RawMessage{
				rawFields,
			},
			nil,
		)
		if err != nil {
			return returns, err
		}

		returns.EventURL = t.EventURLs.URLForEvent(ctx, ids[0])

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

		query := event.QueryLatestByPath("/" + args.Path)
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
	EventURLs []string `json:"event_urls"`
}

var WriteEventsCommand = commands.Command(
	"events:write", "Write events to store",
	func(ctx context.Context,
		t *struct {
			Writer    event.Writer
			EventURLs *EventURLs
		},
		args struct {
			Events []json.RawMessage `json:"events"`
			Since  event.ID          `json:"since"`
		},
	) (WriteEventsReturns, error) {
		slog.Info("WriteEventsCommand", "args", args)
		returns := WriteEventsReturns{}
		ids, err := t.Writer.WriteEvents(ctx, args.Since, args.Events, nil)
		if err != nil {
			return returns, err
		}

		returns.EventURLs = make([]string, 0, len(args.Events))
		for _, id := range ids {
			returns.EventURLs = append(returns.EventURLs, t.EventURLs.URLForEvent(ctx, id))
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
			PathPrefix *string `json:"path_prefix" query:"path_prefix"`
			Path       *string `json:"path" query:"path"`

			TypePrefix *string `json:"type_prefix" query:"type_prefix"`
			Type       *string `json:"type" query:"type"`

			After *string `json:"after" query:"after"`
			Until *string `json:"until" query:"until"`

			Limit *int `json:"limit" query:"limit"`
			Bias  *int `json:"bias" query:"bias"`
		},
	) (QueryEventsReturns, error) {
		returns := QueryEventsReturns{}

		sq := &event.Query{
			ViewLimit: args.Limit,
			ViewBias:  args.Bias,
		}

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

		var err error
		slog.Info("QueryEventsCommand", "t", t, "args", args, "sq", sq)
		returns.Events, returns.More, err = t.Querier.QueryEvents(ctx, sq)
		return returns, err
	})
