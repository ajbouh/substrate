package substrate

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"strings"
	"time"
)

func wrapSQLError(err error, sql string, values ...interface{}) error {
	if len(values) == 0 {
		return fmt.Errorf("error with sql: `%s`: %w", sql, err)
	}
	return fmt.Errorf("error with sql: `%s`: (%#v): %w", sql, values, err)
}

func (s *Substrate) dbExecContext(ctx context.Context, query string, values ...any) error {
	s.Mu.Lock()
	defer s.Mu.Unlock()

	start := time.Now()
	var err error
	defer func() {
		log.Printf("sql=`%s` values=%#v time=%s err=%s", query, values, time.Since(start), err)
	}()

	_, err = s.DB.ExecContext(ctx, query, values...)
	if err != nil {
		return wrapSQLError(err, query, values...)
	}

	return nil
}

func (s *Substrate) dbQueryContext(ctx context.Context, query string, values ...any) (*sql.Rows, error) {
	start := time.Now()
	var err error
	defer func() {
		log.Printf("sql=`%s` values=%#v time=%s err=%s", query, values, time.Since(start), err)
	}()

	r, err := s.DB.QueryContext(ctx, query, values...)
	if err != nil {
		return nil, wrapSQLError(err, query, values...)
	}

	return r, nil
}

func (r *Limit) Slice() []string {
	if r != nil {
		return []string{"LIMIT", fmt.Sprintf("%d", r.Limit)}
	}
	return nil
}

func (r *OrderBy) Slice(orderBy string) []string {
	if r != nil && r.Descending {
		return []string{`ORDER BY`, orderBy, `DESC`}
	}

	return nil
}

type Limit struct {
	Limit int `json:"limit,omitempty"`
}

func LimitFromPtr(limit *int) *Limit {
	if limit == nil {
		return nil
	}

	return &Limit{*limit}
}

type OrderBy struct {
	Descending bool `json:"descending,omitempty"`
}

func OrderByFromPtr(descending *bool) *OrderBy {
	if descending == nil {
		return nil
	}

	return &OrderBy{*descending}
}

type Query struct {
	Preamble        []string
	Select          []string
	SelectValues    []any
	Where           []string
	WhereValues     []any
	WherePredicates map[string]bool
	FromTablesNamed map[string]string
	LeftJoin        []string
	GroupBy         []string

	Limit         *Limit
	OrderByColumn string
	OrderBy       *OrderBy
}

func (q *Query) Render() (string, []any) {
	values := []any{}
	all := []string{}
	all = append(all, q.Preamble...)
	if len(q.Select) > 0 {
		all = append(all, "SELECT", strings.Join(q.Select, ", "))
		values = append(values, q.SelectValues...)
	}
	if q.FromTablesNamed != nil && len(q.FromTablesNamed) > 0 {
		from := make([]string, 0, len(q.FromTablesNamed))
		for as, table := range q.FromTablesNamed {
			from = append(from, table+" AS "+as)
		}
		all = append(all, "FROM", strings.Join(from, ", "))
	}
	if len(q.LeftJoin) > 0 {
		all = append(all, "LEFT JOIN", strings.Join(q.LeftJoin, " "))
	}
	where := make([]string, 0, len(q.WherePredicates))
	for pred := range q.WherePredicates {
		where = append(where, pred)
	}
	where = append(where, q.Where...)
	if len(where) > 0 {
		all = append(all, "WHERE", strings.Join(where, " AND "))
		values = append(values, q.WhereValues...)
	}

	if len(q.GroupBy) > 0 {
		all = append(all, "GROUP BY", strings.Join(q.GroupBy, ", "))
	}

	all = append(all, q.OrderBy.Slice(q.OrderByColumn)...)
	all = append(all, q.Limit.Slice()...)

	return strings.Join(all, " "), values
}
