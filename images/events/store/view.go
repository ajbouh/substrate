package store

import (
	"context"

	"github.com/ajbouh/substrate/images/events/db"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

// some aliases to make the expressions below a bit easier on the eyes.
var With = db.With
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
	case "id", "since", "at", "fields", "data_size", "data_sha256", "fields_size", "fields_sha256", "vector_manifold_id", "vector_data_rowid", "vector_data_nn_distance":
		return name
	default:
		return "jsonb_extract(fields, '$." + name + "')"
	}
}

func eventFieldName(name string) db.Expr {
	return SQL(renderFieldName(name))
}

func prepareDeclareManifoldQuery(id event.ID) *db.SelectExpr {
	return From(
		SQL(manifoldsTable),
	).Select(
		As("id", "id"),
		As("table", "table"),
		As("dtype", "dtype"),
		As("dimensions", "dimensions"),
	).AndWhere(
		SQL("id", "=", V(id)),
	)
}

func prepareEventQueryBase(ctx context.Context, vmr VectorManifoldResolver, q *event.Query) (db.Expr, error) {
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
		As("vector_manifold_id", eventFieldName("vector_manifold_id")),
		As("vector_data_rowid", eventFieldName("vector_data_rowid")),
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

	if q.EventsNear != nil {
		vm, err := vmr.ResolveVectorManifold(ctx, q.EventsNear.ManifoldID)
		if err != nil {
			return nil, err
		}
		s.LeftJoin(
			// TODO should actually read this table name from the database, since our naming strategy might have changed...
			SQL(
				As("manifold", vm.SQLiteTable()),
				"on", "vector_data_rowid", "=", "manifold.rowid",
			),
		)
		s.Select(
			As("vector_data", "manifold."+vm.SQLiteColumn()),
			As("vector_data_nn_distance", Call(
				vm.SQLiteDistanceFunction(),
				"manifold."+vm.SQLiteColumn(),
				V(MarshalFloat32(q.EventsNear.Data)),
			)),
		)
		s.OrderBy = &db.OrderBy{
			OrderBy:    "vector_data_nn_distance",
			Descending: false,
		}
	} else {
		s.Select(
			As("vector_data", "null"),
			As("vector_data_nn_distance", "null"),
		)
	}

	if q.EventLimit != nil {
		s.Limit = &db.Limit{
			Limit: *q.EventLimit,
		}
	}

	return s, nil
}

func prepareEventView(view event.View, placeholders map[string]any, base db.Expr) *db.SelectExpr {
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
			As("vector_manifold_id", eventFieldName("vector_manifold_id")),
			As("vector_data_rowid", eventFieldName("vector_data_rowid")),

			As("vector_data_nn_distance", "vector_data_nn_distance"),
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
					As("vector_manifold_id", eventFieldName("vector_manifold_id")),
					As("vector_data_rowid", eventFieldName("vector_data_rowid")),

					As("vector_data_nn_distance", "vector_data_nn_distance"),

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
			As("vector_manifold_id", eventFieldName("vector_manifold_id")),
			As("vector_data_rowid", eventFieldName("vector_data_rowid")),

			As("vector_data_nn_distance", "vector_data_nn_distance"),
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
					As("data_size", eventFieldName("data_size")),
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
			As("vector_manifold_id", "null"),
			As("vector_data_rowid", "null"),
			As("vector_data_nn_distance", "null"),
		).GroupBy(SQL(dirEntrySubExpr))
	default:
		panic("unknown view for query: " + view)
	}
}

func renderEventQuery(ctx context.Context, vmr VectorManifoldResolver, q *event.Query) (int, *db.SelectExpr, error) {
	base, err := prepareEventQueryBase(ctx, vmr, q)
	if err != nil {
		return 0, nil, err
	}

	s := prepareEventView(q.View, q.ViewPlaceholders, base)

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
	} else {
		// if we're walking everything then set max to the given limit
		if q.ViewLimit != nil {
			max = *q.ViewLimit
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

	return max, s, nil
}
