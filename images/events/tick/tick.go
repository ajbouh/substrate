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

func (r *Ticker[Input, Events, Output]) Tick(ctx context.Context, until event.ID) (tick *Tick[Input, Events, Output], err error) {
	defer func() {
		slog.Info("Ticker.Tick()", "T", fmt.Sprintf("%T", r), "strategyType", fmt.Sprintf("%T", r.Strategy), "t", r, "until", until, "r.Querier", r.Querier)
	}()

	tick = &Tick[Input, Events, Output]{
		Strategy: r.Strategy,
		Input:    r.Input,
		Until:    until,
	}

	tick.Queries, err = tick.Strategy.Prepare(ctx, tick.Input)
	if err != nil {
		return tick, err
	}

	// eagerly accumulate results
	results, more, errs := queryAllEventsUntil(ctx, r.Querier, tick.Queries, until)
	if more {
		tick.More = true
	}

	// populate gathered
	setTaggedFields(&tick.Gathered, "eventquery", results)

	tick.Output, more, err = tick.Strategy.Do(ctx, tick.Input, tick.Gathered, until)
	if more {
		tick.More = true
	}
	if err != nil {
		errs = append(errs, err)
	}
	return tick, errors.Join(errs...)
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
