package db

import (
	"strconv"
	"strings"
)

func (r *Limit) Render(s []string, v []any) ([]string, []any) {
	if r != nil {
		if r.Offset == nil {
			return append(s, "LIMIT", strconv.Itoa(r.Limit)), v
		}
		return append(s, "LIMIT", strconv.Itoa(r.Limit), "OFFSET", strconv.Itoa(*r.Offset)), v
	}
	return s, v
}

func (r *OrderBy) Render(s []string, v []any) ([]string, []any) {
	if r != nil {
		if r.Descending {
			return append(s, `ORDER BY`, r.OrderBy, `DESC`), v
		} else {
			return append(s, `ORDER BY`, r.OrderBy, `ASC`), v
		}
	}

	return s, v
}

type Limit struct {
	Limit  int  `json:"limit,omitempty"`
	Offset *int `json:"offset,omitempty"`
}

type OrderBy struct {
	OrderBy    string
	Descending bool `json:"descending,omitempty"`
}

type Expr interface {
	Render([]string, []any) ([]string, []any)
}

func SQL(list ...any) SQLExpr {
	return SQLExpr(list)
}

type SQLExpr []any

func (se SQLExpr) Render(s []string, v []any) ([]string, []any) {
	for _, o := range se {
		switch expr := o.(type) {
		case Expr:
			s, v = expr.Render(s, v)
		case string:
			s = append(s, expr)
		}
	}
	return s, v
}

func V(o any) *PlaceholderExpr {
	return &PlaceholderExpr{Value: o}
}

type PlaceholderExpr struct {
	Value any
}

func (e *PlaceholderExpr) Render(s []string, v []any) ([]string, []any) {
	return append(s, "?"), append(v, e.Value)
}

func As(name string, o ...any) Expr {
	return SQL("(", SQL(o...), ")", "AS", name)
}

func Call(fn string, o ...any) Expr {
	list := make([]any, 0, 2+(2*len(o)))
	list = append(list, fn, "(")
	for i, elt := range o {
		if i > 0 {
			list = append(list, ",")
		}
		list = append(list, elt)
	}
	list = append(list, ")")
	return SQL(list...)
}

func From(exprs ...Expr) *SelectExpr {
	return &SelectExpr{
		From: exprs,
	}
}

type SelectExpr struct {
	Distinct     bool
	Columns      []Expr
	WhereExprs   []Expr
	From         []Expr
	LeftJoin     []string
	GroupByExprs []Expr

	Limit   *Limit
	OrderBy *OrderBy
}

func (q *SelectExpr) Select(exprs ...Expr) *SelectExpr {
	q.Columns = append(q.Columns, exprs...)
	return q
}

func (q *SelectExpr) GroupBy(exprs ...Expr) *SelectExpr {
	q.GroupByExprs = append(q.GroupByExprs, exprs...)
	return q
}

func (q *SelectExpr) AndWhere(exprs ...Expr) *SelectExpr {
	q.WhereExprs = append(q.WhereExprs, exprs...)
	return q
}

func (q *SelectExpr) Render(s []string, v []any) ([]string, []any) {
	selectPrefix := []string{"SELECT"}
	if q.Distinct {
		selectPrefix = append(selectPrefix, "DISTINCT")
	}
	s, v = renderExprSlice(s, v, selectPrefix, ",", q.Columns)
	s, v = renderExprSlice(s, v, []string{"FROM"}, ",", q.From)

	if len(q.LeftJoin) > 0 {
		s = append(s, "LEFT JOIN", strings.Join(q.LeftJoin, " "))
	}

	s, v = renderExprSlice(s, v, []string{"WHERE"}, "AND", q.WhereExprs)
	s, v = renderExprSlice(s, v, []string{"GROUP BY"}, ",", q.GroupByExprs)

	s, v = q.OrderBy.Render(s, v)
	s, v = q.Limit.Render(s, v)

	return s, v
}

func Render(e Expr) (string, []any) {
	s, v := e.Render(nil, nil)
	return strings.Join(s, " "), v
}

func renderExprSlice(s []string, v []any, prefix []string, delim string, exprs []Expr) ([]string, []any) {
	if len(exprs) > 0 {
		s = append(s, prefix...)
		for i, gb := range exprs {
			if i > 0 {
				s = append(s, delim)
			}
			s, v = gb.Render(s, v)
		}
	}
	return s, v
}
