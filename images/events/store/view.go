package store

import (
	"context"
	"fmt"

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

func prepareCriteria(ctx context.Context, s *db.SelectExpr, vmr VectorManifoldResolver, table string, defaultOrderByIfBias string, defaultMatchValue string, q event.Criteria) (*db.SelectExpr, error) {
	hasMatches := false
	for field, wheres := range q.WhereCompare {
		if field == "" {
			hasMatches = true
			s.AndFrom(As("jt", "json_tree("+table+".fields)"))
			s.GroupBy(SQL(table + ".id"))
			for _, where := range wheres {
				s.AndWhere(SQL("jt.value", where.Compare, V(where.Value)))
			}
		} else {
			fieldName := eventFieldNameWithTableJSONB(field, table)
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

	return prepareCriteria(ctx, s, vmr, "basis", renderFieldName("id", true, "basis"), "null", q)
}

func prepareView(view event.View, placeholders map[string]any, basis db.Expr) *db.SelectExpr {
	switch view {
	case event.ViewEvents:
		return From(
			As("basis", "(", basis, ")"),
		).Select(
			As("id", eventFieldNameWithTableJSONB("id", "basis")),
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
			As("id", `max(basis.id)`),
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
		).UnionAll(
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
				As("id", "basis.id"),
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
			As("id", `max(basis.id)`),
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

// on boot also create our temp_reaction_triggers table columns are: (id, )
// CREATE TEMP TABLE table_name (id TEXT PRIMARY KEY) WITHOUT ROWID;
// todo before write, DELETE FROM temp_reaction_triggers;
// todo after write, SELECT id FROM temp_reaction_triggers;

const reactionTriggerTable = "temp_reaction_triggers_for_this_write"

func triggerNameForEvent(fpk event.FingerprintKey) string {
	return "reaction_trigger_" + fpk.String()
}

const createReactionTriggerTable = `CREATE TEMP TABLE ` + reactionTriggerTable + ` (id TEXT PRIMARY KEY) WITHOUT ROWID, strict;`
const dropReactionTriggerTable = `DROP TABLE IF EXISTS "` + reactionTriggerTable + `";`

const dropReactionTriggerTableRows = `DELETE FROM ` + reactionTriggerTable + `;`
const selectReactionTriggerTableRows = `SELECT id FROM ` + reactionTriggerTable + ` ORDER BY id ASC;`

func renderDropEventTrigger(fpk event.FingerprintKey) db.Expr {
	return db.SQL("DROP TRIGGER IF EXISTS", triggerNameForEvent(fpk), ";")
}

func renderTriggerQuery(ctx context.Context, vmr VectorManifoldResolver, trigger ReactionQueryTrigger) (db.Expr, error) {
	return renderTriggerQueryFromTable(ctx, vmr, func() (*db.SelectExpr, error) {
		return db.From(As("basis", eventsTable)), nil
	}, "basis", trigger)
}

func renderTriggerQueryFromTable(ctx context.Context, vmr VectorManifoldResolver, from func() (*db.SelectExpr, error), table string, trigger ReactionQueryTrigger) (db.Expr, error) {
	if trigger.Err != nil {
		return nil, fmt.Errorf("invalid trigger: %w", trigger.Err)
	}

	if len(trigger.QuerySet) == 0 {
		return nil, nil
	}

	var s *db.SelectExpr
	for _, q := range trigger.QuerySet {
		all, err := from()
		if err != nil {
			return nil, err
		}

		if len(q.BasisCriteria.WhereCompare) > 0 {
			_, err := prepareCriteria(ctx, all, vmr, table, renderFieldName("id", false, ""), "null", q.BasisCriteria)
			if err != nil {
				return nil, err
			}
		}

		if len(q.ViewCriteria.WhereCompare) > 0 {
			_, err := prepareCriteria(ctx, all, vmr, table, renderFieldName("id", false, ""), "null", q.ViewCriteria)
			if err != nil {
				return nil, err
			}
		}

		if len(all.WhereExprs) > 0 {
			// we just want a boolean
			all.Columns = []db.Expr{db.SQL("1")}

			if s == nil {
				s = all
				s.Limit = &db.Limit{Limit: 1}
			} else {
				s.UnionAll(all)
			}
		}
	}

	return s, nil
}

func renderInsertReactionNotification(id event.ID) db.Expr {
	return db.SQL(
		"INSERT INTO", reactionTriggerTable,
		"(id)",
		"VALUES", "(",
		V(id.String()),
		")",
		"ON CONFLICT(id) DO NOTHING;",
	)
}

func renderCreateEventTrigger(ctx context.Context, vmr VectorManifoldResolver, trigger ReactionQueryTrigger) (db.Expr, error) {
	some, err := renderTriggerQueryFromTable(ctx, vmr, func() (*db.SelectExpr, error) { return db.From(), nil }, "NEW", trigger)
	if err != nil {
		return nil, err
	}
	some, err = db.Bake(some)
	if err != nil {
		return nil, err
	}

	insert := renderInsertReactionNotification(trigger.ID)
	insert, err = db.Bake(insert)
	if err != nil {
		return nil, err
	}
	return db.SQL(
		"CREATE TEMPORARY TRIGGER",
		triggerNameForEvent(trigger.FingerprintKey),
		"AFTER INSERT ON",
		"main."+eventsTable,
		"WHEN",
		"(", some, ")",
		"BEGIN",
		insert,
		"END",
	), nil

}

func renderEventQuery(ctx context.Context, vmr VectorManifoldResolver, q *event.Query) (int, *db.SelectExpr, error) {
	basis, err := prepareBasis(ctx, vmr, q.BasisCriteria)
	if err != nil {
		return 0, nil, err
	}

	s := prepareView(q.View, q.ViewPlaceholders, basis)
	s, err = prepareCriteria(ctx, s, vmr, "basis", renderFieldName("id", false, ""), "matches", q.ViewCriteria)
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
