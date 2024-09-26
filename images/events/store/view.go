package store

import (
	"github.com/ajbouh/substrate/images/events/db"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

// some aliases to make the expressions below a bit easier on the eyes.
var From = db.From
var As = db.As
var SQL = db.SQL
var Call = db.Call
var V = db.V

func shallowCloneMap[K comparable, V any, M map[K]V](m M) M {
	m2 := map[K]V{}
	for k, v := range m {
		m2[k] = v
	}
	return m2
}

func renderFieldName(name string) string {
	switch name {
	// these are top-level columns
	case "id", "since", "at", "fields", "data_size", "data_sha256", "fields_size", "fields_sha256":
		return name
	default:
		return "jsonb_extract(fields, '$." + name + "')"
	}
}

func eventFieldName(name string) db.Expr {
	return SQL(renderFieldName(name))
}

func prepareEventQueryBase(q *event.Query) *db.SelectExpr {
	s := From(
		SQL(eventsTable),
	).Select(
		As("id", eventFieldName("id")),
		As("at", eventFieldName("at")),
		As("since", eventFieldName("since")),
		As("fields", eventFieldName("fields")),
		As("fields_size", eventFieldName("fields_size")),
		As("fields_sha256", eventFieldName("fields_sha256")),
		As("data_size", eventFieldName("data_size")),
		As("data_sha256", eventFieldName("data_sha256")),
	)
	for field, wheres := range q.EventsWhereCompare {
		fieldName := eventFieldName(field)
		for _, where := range wheres {
			s.AndWhere(SQL(fieldName, where.Compare, V(where.Value)))
		}
	}
	for field, wheres := range q.EventsWherePrefix {
		fieldName := eventFieldName(field)
		for _, where := range wheres {
			s.AndWhere(SQL(fieldName, "LIKE", V(where.Prefix+"%")))
		}
	}

	return s
}

func prepareEventView(view event.View, placeholders map[string]any, base *db.SelectExpr) *db.SelectExpr {
	switch view {
	case event.ViewEvents:
		return From(
			SQL("(", base, ")"),
		).Select(
			As("id", "id"),
			As("at", "at"),
			As("since", "since"),
			As("fields", "json(fields)"),
			As("fields_size", eventFieldName("fields_size")),
			As("fields_sha256", eventFieldName("fields_sha256")),
			As("data_size", eventFieldName("data_size")),
			As("data_sha256", eventFieldName("data_sha256")),
		)
	case event.ViewGroupByPathMaxID:
		return From(
			SQL("(",
				From(
					SQL("(", base, ")"),
				).Select(
					As("id", `max(id)`),
					As("at", `at`),
					As("since", `since`),
					As("path", eventFieldName("path")),
					As("fields", eventFieldName("fields")),
					As("fields_size", eventFieldName("fields_size")),
					As("fields_sha256", eventFieldName("fields_sha256")),
					As("data_size", eventFieldName("data_size")),
					As("data_sha256", eventFieldName("data_sha256")),
				// ).AndWhere(
				// 	SQL(eventFieldName("deleted"), "!=", "true"),
				).GroupBy(
					eventFieldName("path"),
				),
				")"),
		).Select(
			As("id", "id"),
			As("at", "at"),
			As("since", "since"),
			As("fields", "json(fields)"),
			As("fields_size", eventFieldName("fields_size")),
			As("fields_sha256", eventFieldName("fields_sha256")),
			As("data_size", eventFieldName("data_size")),
			As("data_sha256", eventFieldName("data_sha256")),
		)

	case event.ViewPathDirEntriesMaxID:
		dirEntrySubExpr := Call(`substr`,
			`path`,
			`1`,
			`CASE instr(path, '/') WHEN 0 THEN length(path) ELSE instr(path, '/') END`)

		return From(
			SQL("(",
				From(
					SQL("(", prepareEventView(event.ViewGroupByPathMaxID, nil, base), ")"),
				).Select(
					As("id", eventFieldName("id")),
					As("at", "null"),
					As("since", "null"),
					As("fields", eventFieldName("fields")),
					As("fields_size", eventFieldName("fields_size")),
					As("fields_sha256", eventFieldName("fields_sha256")),
					As("data_size", eventFieldName("data_size")),
					As("data_sha256", eventFieldName("data_sha256")),
					As("path", Call(`substr`,
						renderFieldName("path"),
						SQL(Call(`length`, V(placeholders["path"])), `+`, `1`))),
				),
				")"),
		).Select(
			As("id", `max(id)`),
			As("at", `null`),    // kind of meaningless?
			As("since", `null`), // kind of meaningless?
			As("fields",
				Call(`json_object`,
					`'path'`, dirEntrySubExpr,
					`'count'`, `count(*)`,
					// `'size'`, `sum(length(fields) + length(data))`),
				),
			),
			As("fields_size", Call("sum", eventFieldName("fields_size"))),
			As("fields_sha256", "null"), // kind of meaningless?
			As("data_size", Call("sum", eventFieldName("data_size"))),
			As("data_sha256", "null"), // kind of meaningless?
		).GroupBy(SQL(dirEntrySubExpr))
	default:
		panic("unknown view for query: " + view)
	}
}

func renderEventQuery(q *event.Query) (int, *db.SelectExpr) {
	s := prepareEventView(q.View, q.ViewPlaceholders, prepareEventQueryBase(q))

	// default to no limit
	max := 0
	if q.ViewBias != nil {
		if *q.ViewBias > 0 {
			if s.OrderBy == nil {
				s.OrderBy = &db.OrderBy{}
			}
			s.OrderBy.Descending = true
		}

		if *q.ViewBias == 0 {
			// if we're walking everything then set max to the given limit
			if q.ViewLimit != nil {
				max = *q.ViewLimit
			}
		}
	}

	s.OrderBy = &db.OrderBy{OrderBy: "id"}

	if max > 0 {
		s.Limit = &db.Limit{Limit: max}
		if q.DetectMore {
			// If we're supposed to detect whether or not there are
			// more results, then set the limit one higher than requested.
			s.Limit.Limit++
		}
	}

	return max, s
}
