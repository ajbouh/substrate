package tick

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"reflect"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type Tick[Input any, Events any, Output any] struct {
	Strategy Strategy[Input, Events, Output]
	Input    Input
	Queries  map[string][]event.Query

	Until    event.ID
	Gathered Events
	More     bool
	Output   Output
}

type Ticker[Input any, Events any, Output any] struct {
	Strategy Strategy[Input, Events, Output]
	Input    Input

	// TODO switch to using Streamer
	Querier event.Querier
}

func (r *Ticker[Input, Events, Output]) Initialize() {
	slog.Info("Ticker.Initialize()", "T", fmt.Sprintf("%T", r), "strategyType", fmt.Sprintf("%T", r.Strategy), "t", r)
}

func (r *Ticker[Input, Events, Output]) Tick(ctx context.Context, until event.ID) (*Tick[Input, Events, Output], error) {
	slog.Info("Ticker.Tick()", "T", fmt.Sprintf("%T", r), "strategyType", fmt.Sprintf("%T", r.Strategy), "t", r, "until", until)

	t := &Tick[Input, Events, Output]{
		Strategy: r.Strategy,
		Input:    r.Input,
		Until:    until,
	}

	var err error
	t.Queries, err = t.Strategy.Prepare(ctx, t.Input)
	if err != nil {
		return t, err
	}

	// eagerly accumulate results
	results, more, errs := queryAllEventsUntil(ctx, r.Querier, t.Queries, until)
	if more {
		t.More = true
	}

	// populate gathered
	setTaggedFields(&t.Gathered, "eventquery", results)

	t.Output, more, err = t.Strategy.Do(ctx, t.Input, t.Gathered)
	if more {
		t.More = true
	}
	if err != nil {
		errs = append(errs, err)
	}
	return t, errors.Join(errs...)
}

func setTaggedFields[T any, S any](t *T, tag string, values map[string]S) {
	val := reflect.ValueOf(t).Elem()
	typ := val.Type()
	if t == nil {
		val.Set(reflect.New(typ))
	}
	for _, field := range reflect.VisibleFields(typ) {
		tag, ok := field.Tag.Lookup(tag)
		if !ok {
			continue
		}

		val.FieldByIndex(field.Index).Set(reflect.ValueOf(values[tag]))
	}
}

func queryAllEventsUntil(ctx context.Context, querier event.Querier, queries map[string][]event.Query, until event.ID) (map[string][]event.Event, bool, []error) {
	var errs []error
	var more bool
	results := map[string][]event.Event{}
	for key, queries := range queries {
		for _, q := range event.MutateQueries(queries,
			event.AndWhereEventsFunc("id", &event.WhereCompare{Compare: "<=", Value: until}),
		) {
			events, qMore, err := querier.QueryEvents(ctx, &q)
			if err != nil {
				errs = append(errs, err)
				continue
			}
			if qMore {
				more = true
			}
			results[key] = append(results[key], events...)
		}
	}

	return results, more, errs
}
