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

func renderFieldName(name string, jsonb bool, table string) string {
	prefix := ""
	if table != "" {
		prefix = table + "."
	}
	switch name {
	// these are top-level columns
	case "id", "since", "at", "fields", "data_size", "data_sha256", "vector_manifold_id", "vector_data_rowid", "vector_data_nn_distance":
		return prefix + name
	default:
		if jsonb {
			return "jsonb_extract(" + prefix + "fields, '$." + name + "')"
		}
		return "json_extract(" + prefix + "fields, '$." + name + "')"
	}
}

func eventFieldNameJSON(name string) db.Expr {
	return SQL(renderFieldName(name, false, ""))
}

func eventFieldNameJSONB(name string) db.Expr {
	return SQL(renderFieldName(name, true, ""))
}

func eventFieldNameWithTableJSON(name, table string) db.Expr {
	return SQL(renderFieldName(name, false, table))
}

func eventFieldNameWithTableJSONB(name, table string) db.Expr {
	return SQL(renderFieldName(name, true, table))
}

func prepareCriteria(ctx context.Context, s *db.SelectExpr, vmr VectorManifoldResolver, defaultOrderByIfBias string, defaultMatchValue string, q event.Criteria) (*db.SelectExpr, error) {
	hasMatches := false
	for field, wheres := range q.WhereCompare {
		if field == "" {
			hasMatches = true
			s.AndFrom(As("jt", "json_tree(fields)"))
			s.GroupBy(SQL("basis.id"))
			for _, where := range wheres {
				s.AndWhere(SQL("jt.value", where.Compare, V(where.Value)))
			}
		} else {
			fieldName := eventFieldNameJSONB(field)
			for _, where := range wheres {
				s.AndWhere(SQL(fieldName, where.Compare, V(where.Value)))
			}
		}
	}

	if hasMatches {
		s.Select(As("matches", "json_group_array(jt.fullkey)"))
	} else {
		s.Select(As("matches", defaultMatchValue))
	}

	if q.Near != nil {
		vm, err := vmr.ResolveVectorManifold(ctx, q.Near.ManifoldID)
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
			// As("vector_data", "manifold."+vm.SQLiteColumn()),
			As("vector_data_nn_distance", Call(
				vm.SQLiteDistanceFunction(),
				"manifold."+vm.SQLiteColumn(),
				V(MarshalFloat32(q.Near.Data)),
			)),
		)
		s.OrderBy = &db.OrderBy{
			OrderBy:    "vector_data_nn_distance",
			Descending: false,
		}
	} else {
		s.Select(
			// As("vector_data", "null"),
			As("vector_data_nn_distance", "0"),
		)
	}

	if q.Limit != nil {
		s.Limit = &db.Limit{
			Limit: *q.Limit,
		}
	}

	if q.Bias != nil {
		if *q.Bias > 0 {
			if s.OrderBy == nil {
				s.OrderBy = &db.OrderBy{
					OrderBy: defaultOrderByIfBias,
				}
			}
			s.OrderBy.Descending = true
		}
	}

	return s, nil
}

func prepareBasis(ctx context.Context, vmr VectorManifoldResolver, q event.Criteria) (db.Expr, error) {
	s := From(
		As("basis", eventsTable),
	).Select(
		As("id", eventFieldNameWithTableJSONB("id", "basis")),
		As("at", eventFieldNameJSONB("at")),
		As("since", eventFieldNameJSONB("since")),
		As("fields", eventFieldNameJSONB("fields")),
		As("data_size", eventFieldNameJSONB("data_size")),
		As("data_sha256", eventFieldNameJSONB("data_sha256")),
		As("vector_manifold_id", eventFieldNameJSONB("vector_manifold_id")),
		As("vector_data_rowid", eventFieldNameJSONB("vector_data_rowid")),
	)

	return prepareCriteria(ctx, s, vmr, renderFieldName("id", true, "basis"), "null", q)
}

func prepareView(view event.View, placeholders map[string]any, basis db.Expr) *db.SelectExpr {
	switch view {
	case event.ViewEvents:
		return From(
			As("basis", "(", basis, ")"),
		).Select(
			As("id", "id"),
			As("at", "at"),
			As("since", "since"),
			As("deleted", "0"),
			As("fields", "json(fields)"),
			As("data_size", eventFieldNameJSONB("data_size")),
			As("data_sha256", eventFieldNameJSONB("data_sha256")),
			As("vector_manifold_id", eventFieldNameJSONB("vector_manifold_id")),
			As("vector_data_rowid", eventFieldNameJSONB("vector_data_rowid")),

			// As("vector_data", "vector_data"),
			// As("vector_data_nn_distance", "vector_data_nn_distance"),
		)
	case event.ViewGroupByPathMaxID:
		return From(
			As("basis", "(", basis, ")"),
		).Select(
			As("id", `max(id)`),
			As("at", `at`),
			As("since", `since`),
			As("deleted", "1"),
			As("fields", `'{}'`),
			As("data_size", "0"),
			As("data_sha256", "null"),
			As("vector_manifold_id", "null"),
			As("vector_data_rowid", "null"),
			// As("vector_data", "null"),
			As("matches", `null`),
			As("vector_data_nn_distance", "0"),
		).AndWhere(
			SQL(eventFieldNameJSONB("deleted"), "IS", "1"),
		).Union(
			From(As("basis", "(",
				From(
					SQL("(", basis, ")"),
				).Select(
					As("id", `max(id)`),
					As("at", `at`),
					As("since", `since`),
					As("deleted", "0"),
					As("path", eventFieldNameJSONB("path")),
					As("fields", eventFieldNameJSONB("fields")),
					As("data_size", eventFieldNameJSONB("data_size")),
					As("data_sha256", eventFieldNameJSONB("data_sha256")),
					As("vector_manifold_id", eventFieldNameJSONB("vector_manifold_id")),
					As("vector_data_rowid", eventFieldNameJSONB("vector_data_rowid")),

					// As("vector_data", "vector_data"),
					As("matches", `matches`),
					As("vector_data_nn_distance", "vector_data_nn_distance"),
				).GroupBy(
					eventFieldNameJSONB("path"),
				).AndHaving(
					SQL(eventFieldNameJSONB("deleted"), "IS NOT", "1"),
				),
				")"),
			).Select(
				As("id", "id"),
				As("at", "at"),
				As("since", "since"),
				As("deleted", "deleted"),
				As("fields", "json(fields)"),
				As("data_size", eventFieldNameJSONB("data_size")),
				As("data_sha256", eventFieldNameJSONB("data_sha256")),
				As("vector_manifold_id", eventFieldNameJSONB("vector_manifold_id")),
				As("vector_data_rowid", eventFieldNameJSONB("vector_data_rowid")),

				// As("vector_data", "vector_data"),
				// As("vector_data_nn_distance", "vector_data_nn_distance"),
			),
		)

	case event.ViewPathDirEntriesMaxID:
		dirEntrySubExpr := Call(`substr`,
			`path`,
			`1`,
			`CASE instr(path, '/') WHEN 0 THEN length(path) ELSE instr(path, '/') END`)

		return From(
			As("basis", "(",
				From(
					SQL("(", prepareView(event.ViewGroupByPathMaxID, nil, basis), ")"),
				).Select(
					As("id", eventFieldNameJSONB("id")),
					As("matches", `matches`),
					As("at", "null"),
					As("since", "null"),
					As("fields", eventFieldNameJSONB("fields")),
					As("data_size", eventFieldNameJSONB("data_size")),
					As("path", Call(`substr`,
						renderFieldName("path", true, ""),
						SQL(Call(`length`, V(placeholders["path"])), `+`, `1`))),
				),
				")"),
		).Select(
			As("id", `max(id)`),
			As("at", `null`),    // kind of meaningless?
			As("since", `null`), // kind of meaningless?
			As("deleted", "0"),
			As("fields",
				Call(`json_object`,
					`'path'`, dirEntrySubExpr,
					`'count'`, `count(*)`,
					// `'size'`, `sum(length(fields) + length(data))`),
				),
			),
			As("data_size", Call("sum", eventFieldNameJSONB("data_size"))),
			As("data_sha256", "null"), // kind of meaningless?
			As("vector_manifold_id", "null"),
			As("vector_data_rowid", "null"),
			// As("vector_data", "null"),
			// As("vector_data_nn_distance", "null"),
		).GroupBy(SQL(dirEntrySubExpr))
	default:
		panic("unknown view for query: " + view)
	}
}

func renderEventQuery(ctx context.Context, vmr VectorManifoldResolver, q *event.Query) (int, *db.SelectExpr, error) {
	basis, err := prepareBasis(ctx, vmr, q.BasisCriteria)
	if err != nil {
		return 0, nil, err
	}

	s := prepareView(q.View, q.ViewPlaceholders, basis)
	s, err = prepareCriteria(ctx, s, vmr, renderFieldName("id", false, ""), "matches", q.ViewCriteria)
	if err != nil {
		return 0, nil, err
	}

	// default to no limit
	max := 0
	if q.ViewCriteria.Bias != nil {
		if *q.ViewCriteria.Bias == 0 {
			// if we're walking everything then set max to the given limit
			if q.ViewCriteria.Limit != nil {
				max = *q.ViewCriteria.Limit
			}
		}
	} else {
		// if we're walking everything then set max to the given limit
		if q.ViewCriteria.Limit != nil {
			max = *q.ViewCriteria.Limit
		}
	}

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
