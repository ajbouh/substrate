package event

import (
	"context"
	"fmt"
	"slices"
)

type Where interface {
	Where()
}

type WherePrefix struct {
	Prefix string `json:"prefix"`
}

func (*WherePrefix) Where() {}

type WhereCompare struct {
	Compare string `json:"compare"`
	Value   any    `json:"value"`
}

func (*WhereCompare) Where() {}

type View string

const ViewEvents View = ""
const ViewGroupByPathMaxID View = "group-by-path-max-id"
const ViewPathDirEntriesMaxID View = "path-dir-entries-max-id"

func (v View) StreamShouldAutoAdvanceAfter() bool {
	switch v {
	case ViewEvents:
		return true
	case ViewGroupByPathMaxID, ViewPathDirEntriesMaxID:
		return false
	}
	return true
}

// criteria to query events from the store.
type Query struct {
	EventsWherePrefix  map[string][]WherePrefix  `json:"prefix,omitempty"`
	EventsWhereCompare map[string][]WhereCompare `json:"compare,omitempty"`

	EventsNear *VectorInput[float32] `json:"near,omitempty"`

	EventLimit *int `json:"limit,omitempty"` // max number of underlying events, if set
	// TODO do we need a bias here?

	View             View           `json:"view,omitempty"`
	ViewLimit        *int           `json:"view_limit,omitempty"` // max number returned, if set
	ViewBias         *int           `json:"view_bias,omitempty"`  // -1 if we want the earliest "Limit"-amount, 1 if we want the most recent "Limit"-amount, 0 if we want a comprehensive window of "Limit"-amount
	ViewPlaceholders map[string]any `json:"view_parameter,omitempty"`

	DetectMore bool `json:"detect_more,omitempty"`
}

func (q *Query) Until(id ID) *Query {
	return q.AndWhereEvent("id", &WhereCompare{Compare: "<=", Value: id})
}

func (q *Query) After(after ID) *Query {
	return q.AndWhereEvent("id", &WhereCompare{Compare: ">", Value: after})
}

func (q *Query) WithEventLimit(i int) *Query {
	q.EventLimit = &i
	return q
}

func (q *Query) WithViewLimit(i int, detectMore bool) *Query {
	q.ViewLimit = &i
	q.DetectMore = detectMore
	return q
}

func (q *Query) WithViewPlaceholder(name string, value any) *Query {
	if q.ViewPlaceholders == nil {
		q.ViewPlaceholders = map[string]any{}
	}

	q.ViewPlaceholders[name] = value
	return q
}

func (q *Query) AndWhereEvent(field string, ws ...Where) *Query {
	for _, w := range ws {
		switch o := w.(type) {
		case *WhereCompare:
			if q.EventsWhereCompare == nil {
				q.EventsWhereCompare = map[string][]WhereCompare{}
			}
			q.EventsWhereCompare[field] = append(q.EventsWhereCompare[field], *o)
		case *WherePrefix:
			if q.EventsWherePrefix == nil {
				q.EventsWherePrefix = map[string][]WherePrefix{}
			}
			q.EventsWherePrefix[field] = append(q.EventsWherePrefix[field], *o)
		default:
			panic(fmt.Sprintf("unknown where expression %T: %#v", w, w))
		}
	}
	return q
}

func clonePtr[o any](i *o) *o {
	if i == nil {
		return nil
	}
	di := *i
	return &di
}

func (q *Query) Clone() *Query {
	whereCompare := map[string][]WhereCompare{}
	for k, v := range q.EventsWhereCompare {
		whereCompare[k] = slices.Clone(v)
	}
	wherePrefix := map[string][]WherePrefix{}
	for k, v := range q.EventsWherePrefix {
		wherePrefix[k] = slices.Clone(v)
	}
	// only a shallow copy of ViewPlaceholders
	viewPlaceholders := map[string]any{}
	for k, v := range q.ViewPlaceholders {
		viewPlaceholders[k] = v
	}
	return &Query{
		EventsWherePrefix:  wherePrefix,
		EventsWhereCompare: whereCompare,
		EventLimit:         clonePtr(q.EventLimit),
		EventsNear:         q.EventsNear.Clone(),

		View:             q.View,
		ViewLimit:        clonePtr(q.ViewLimit),
		ViewBias:         clonePtr(q.ViewBias),
		ViewPlaceholders: viewPlaceholders,

		DetectMore: q.DetectMore,
	}
}

type QueryMutation func(q *Query)

func MutateQueries(queries []*Query, xforms ...QueryMutation) []*Query {
	for _, q := range queries {
		for _, xform := range xforms {
			xform(q)
		}
	}
	return queries
}

func AndWhereEventsFunc(path string, w ...Where) QueryMutation {
	return func(q *Query) {
		q.AndWhereEvent(path, w...)
	}
}

func NewQuery(view View) *Query {
	return &Query{
		EventsWherePrefix:  map[string][]WherePrefix{},
		EventsWhereCompare: map[string][]WhereCompare{},
		ViewPlaceholders:   map[string]any{},
		View:               view,
	}
}

func QueryByID(id ID) *Query {
	return NewQuery(ViewEvents).
		WithViewLimit(1, false).
		AndWhereEvent("id", &WhereCompare{Compare: "=", Value: id})
}

func QueryLatestByPath(path string) *Query {
	return NewQuery(ViewGroupByPathMaxID).
		WithViewLimit(1, false).
		AndWhereEvent("path", &WhereCompare{Compare: "=", Value: path})
}

func QueryLatestByPathPrefix(pathPrefix string) *Query {
	return NewQuery(ViewGroupByPathMaxID).
		AndWhereEvent("path", &WherePrefix{Prefix: pathPrefix})
}

func QueryLatestPathDirEntriesByPathPrefix(pathPrefix string) *Query {
	return NewQuery(ViewPathDirEntriesMaxID).
		AndWhereEvent("path", &WherePrefix{Prefix: pathPrefix}).
		WithViewPlaceholder("path", pathPrefix)
}

func QueryEvents(ctx context.Context, q Querier, sq *Query) ([]Event, bool, error) {
	return q.QueryEvents(ctx, sq)
}

func QueryEvent(ctx context.Context, q Querier, sq *Query) (*Event, error) {
	events, _, err := q.QueryEvents(ctx, sq)
	if len(events) > 0 {
		return &events[0], err
	}
	return nil, err
}

func QueryEventsWithFields[T any](ctx context.Context, q Querier, sq *Query, strict bool) ([]T, bool, error) {
	raw, more, err := q.QueryEvents(ctx, sq)
	if err != nil {
		return nil, more, err
	}

	events, err := Unmarshal[T](raw, strict)
	return events, more, err
}

func QueryEventWithFields[T any](ctx context.Context, q Querier, sq *Query) (*T, error) {
	raw, _, err := q.QueryEvents(ctx, sq)
	if err != nil {
		return nil, err
	}

	events, err := Unmarshal[T](raw, true)
	if len(events) > 0 {
		return &events[0], err
	}

	if err == nil {
		err = EventDoesNotExistErr
	}

	return nil, err
}
