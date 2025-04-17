package event

import (
	"context"
	"fmt"
	"slices"
	"strings"
)

type Where interface {
	Where()
}

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

type Criteria struct {
	WhereCompare map[string][]WhereCompare `json:"where,omitempty"`
	Near         *VectorInput[float32]     `json:"near,omitempty"`

	Limit *int `json:"limit,omitempty"` // max number of underlying events, if set
	Bias  *int `json:"bias,omitempty"`  // -1 if we want the earliest "Limit"-amount, 1 if we want the most recent "Limit"-amount, 0 if we want a comprehensive window of "Limit"-amount
}

func NewCriteria() Criteria {
	return Criteria{
		WhereCompare: map[string][]WhereCompare{},
	}
}

func (c Criteria) WithLimit(i int) Criteria {
	c.Limit = &i
	return c
}

func (c Criteria) AndWhere(field string, ws ...Where) Criteria {
	for _, w := range ws {
		switch o := w.(type) {
		case *WhereCompare:
			if c.WhereCompare == nil {
				c.WhereCompare = map[string][]WhereCompare{}
			}
			c.WhereCompare[field] = append(c.WhereCompare[field], *o)
		default:
			panic(fmt.Sprintf("unknown where expression %T: %#v", w, w))
		}
	}
	return c
}

func (c Criteria) Clone() Criteria {
	whereCompare := map[string][]WhereCompare{}
	for k, v := range c.WhereCompare {
		whereCompare[k] = slices.Clone(v)
	}
	return Criteria{
		WhereCompare: whereCompare,
		Limit:        clonePtr(c.Limit),
		Bias:         clonePtr(c.Bias),
		Near:         c.Near.Clone(),
	}
}

// criteria to query events from the store.
type Query struct {
	BasisCriteria Criteria `json:"basis_criteria,omitempty"`

	View             View           `json:"view,omitempty"`
	ViewCriteria     Criteria       `json:"view_criteria,omitempty"`
	ViewPlaceholders map[string]any `json:"view_parameter,omitempty"`

	DetectMore bool `json:"detect_more,omitempty"`
}

func (q *Query) Until(id ID) *Query {
	q.BasisCriteria.AndWhere("id", &WhereCompare{Compare: "<=", Value: id.String()})
	return q
}

func (q *Query) After(after ID) *Query {
	q.BasisCriteria.AndWhere("id", &WhereCompare{Compare: ">", Value: after.String()})
	return q
}

func (q *Query) WithViewPlaceholder(name string, value any) *Query {
	if q.ViewPlaceholders == nil {
		q.ViewPlaceholders = map[string]any{}
	}

	q.ViewPlaceholders[name] = value
	return q
}

func (q *Query) AndBasisWhere(field string, ws ...Where) *Query {
	q.BasisCriteria.AndWhere(field, ws...)
	return q
}

func (q *Query) AndViewWhere(field string, ws ...Where) *Query {
	q.ViewCriteria.AndWhere(field, ws...)
	return q
}

func (q *Query) WithViewLimit(i int, detectMore bool) *Query {
	q.ViewCriteria.WithLimit(i)
	q.DetectMore = detectMore
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
	// only a shallow copy of ViewPlaceholders
	viewPlaceholders := map[string]any{}
	for k, v := range q.ViewPlaceholders {
		viewPlaceholders[k] = v
	}
	return &Query{
		BasisCriteria: q.BasisCriteria.Clone(),

		View:             q.View,
		ViewCriteria:     q.ViewCriteria.Clone(),
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

func AndBasisWhereFunc(path string, w ...Where) QueryMutation {
	return func(q *Query) {
		q.BasisCriteria.AndWhere(path, w...)
	}
}

func NewQuery(view View) *Query {
	return &Query{
		BasisCriteria:    NewCriteria(),
		ViewCriteria:     NewCriteria(),
		ViewPlaceholders: map[string]any{},
		View:             view,
	}
}

func QueryByID(id ID) *Query {
	return NewQuery(ViewEvents).
		WithViewLimit(1, false).
		AndBasisWhere("id", &WhereCompare{Compare: "=", Value: id.String()})
}

func QueryLatestByPath(path string) *Query {
	return NewQuery(ViewGroupByPathMaxID).
		WithViewLimit(1, false).
		AndBasisWhere("path", &WhereCompare{Compare: "=", Value: path})
}

func escapeLikePattern(s string) string {
	return strings.ReplaceAll(
		strings.ReplaceAll(
			strings.ReplaceAll(s,
				`\`, `\\`),
			`%`, `\%`),
		`_`, `\_`)
}

func WherePrefix(prefix string) *WhereCompare {
	return &WhereCompare{Compare: "like", Value: escapeLikePattern(prefix) + "%"}
}

func QueryLatestByPathPrefix(pathPrefix string) *Query {
	return NewQuery(ViewGroupByPathMaxID).
		AndBasisWhere("path", WherePrefix(pathPrefix))
}

func QueryLatestPathDirEntriesByPathPrefix(pathPrefix string) *Query {
	return NewQuery(ViewPathDirEntriesMaxID).
		AndBasisWhere("path", WherePrefix(pathPrefix)).
		WithViewPlaceholder("path", pathPrefix)
}

func QueryEvents(ctx context.Context, q Querier, sq *Query) ([]Event, ID, bool, error) {
	return q.QueryEvents(ctx, sq)
}

func QueryEvent(ctx context.Context, q Querier, sq *Query) (*Event, ID, error) {
	events, max, _, err := q.QueryEvents(ctx, sq)
	if len(events) > 0 {
		return &events[0], max, err
	}
	return nil, max, err
}

func QueryEventsWithFields[T any](ctx context.Context, q Querier, sq *Query, strict bool) ([]T, ID, bool, error) {
	raw, max, more, err := q.QueryEvents(ctx, sq)
	if err != nil {
		return nil, max, more, err
	}

	events, err := Unmarshal[T](raw, strict)
	return events, max, more, err
}

func QueryEventWithFields[T any](ctx context.Context, q Querier, sq *Query) (*T, ID, error) {
	raw, max, _, err := q.QueryEvents(ctx, sq)
	if err != nil {
		return nil, max, err
	}

	events, err := Unmarshal[T](raw, true)
	if len(events) > 0 {
		return &events[0], max, err
	}

	if err == nil {
		err = ErrEventDoesNotExist
	}

	return nil, max, err
}
