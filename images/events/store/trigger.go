package store

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/tidwall/gjson"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type ReactionQueryTrigger struct {
	ID             event.ID
	FingerprintKey event.FingerprintKey
	QuerySet       event.QuerySet
	Err            error
}

func gjsonResultBytes(json []byte, result gjson.Result) []byte {
	if result.Index > 0 {
		return json[result.Index : result.Index+len(result.Raw)]
	}
	return []byte(result.Raw)
}

func reactionQueryTriggerFor(id event.ID, fpk event.FingerprintKey, fields []byte) *ReactionQueryTrigger {
	// prefer "resume" over "when"
	resumeField := gjson.GetBytes(fields, "reaction.resume")
	var queryField, afterField gjson.Result
	if resumeField.Exists() {
		queryField = resumeField.Get("query")
		afterField = resumeField.Get("after")
	} else {
		whenField := gjson.GetBytes(fields, "reaction.when")
		queryField = whenField.Get("query")
		afterField = whenField.Get("after")
	}

	if !queryField.Exists() {
		return nil
	}

	var errs []error

	t := ReactionQueryTrigger{
		ID:             id,
		FingerprintKey: fpk,
	}

	queryBytes := gjsonResultBytes(fields, queryField)
	err := json.Unmarshal(queryBytes, &t.QuerySet)
	errs = append(errs, err)

	if afterField.Exists() {
		if after, err := event.ParseID(afterField.String()); err != nil {
			errs = append(errs, err)
		} else {
			for _, q := range t.QuerySet {
				q.After(after)
			}
		}
	}

	t.Err = errors.Join(errs...)
	return &t
}

func QueryReactionQueryTriggers(
	ctx context.Context,
	querier event.Querier,
	maxID event.ID,
) ([]ReactionQueryTrigger, error) {
	qs := event.QuerySet{
		"resume": event.Query{
			ViewCriteria: event.Criteria{
				WhereCompare: map[string][]event.WhereCompare{
					"type":                  {{Compare: "=", Value: "reaction"}},
					"reaction.disabled":     {{Compare: "!=", Value: 1}},
					"reaction.resume.query": {{Compare: "is not", Value: nil}},
				},
			},
			View: event.ViewGroupByPathMaxID, // todo implement groupbyfingerprintmaxid
		},
		"launch": event.Query{
			ViewCriteria: event.Criteria{
				WhereCompare: map[string][]event.WhereCompare{
					"type":                {{Compare: "=", Value: "reaction"}},
					"reaction.disabled":   {{Compare: "!=", Value: 1}},
					"reaction.when.query": {{Compare: "is not", Value: nil}},
					"reaction.resume":     {{Compare: "is", Value: nil}},
				},
			},
			View: event.ViewGroupByPathMaxID, // todo implement groupbyfingerprintmaxid
		},
	}
	matches, _, _, err := event.QueryEventset(ctx, querier, maxID, qs)
	if err != nil {
		return nil, err
	}

	var triggerable []ReactionQueryTrigger

	for _, evt := range matches["resume"] {
		fpk, err := event.FingerprintKeyFor(evt.Payload)
		if err != nil {
			return nil, err
		}

		if t := reactionQueryTriggerFor(evt.ID, fpk, evt.Payload); t != nil {
			triggerable = append(triggerable, *t)
		}
	}

	for _, evt := range matches["launch"] {
		fpk, err := event.FingerprintKeyFor(evt.Payload)
		if err != nil {
			return nil, err
		}
		if t := reactionQueryTriggerFor(evt.ID, fpk, evt.Payload); t != nil {
			triggerable = append(triggerable, *t)
		}
	}

	return triggerable, nil
}

type ReactionAlarmTrigger struct {
	FingerprintKey event.FingerprintKey
	ID             event.ID
	Alarm          time.Time
}

func reactionAlarmTriggerFor(id event.ID, fpk event.FingerprintKey, fields []byte) *ReactionAlarmTrigger {
	// prefer "resume" over "when"
	resumeField := gjson.GetBytes(fields, "reaction.resume")
	var field gjson.Result
	if resumeField.Exists() {
		field = resumeField.Get("alarm")
	} else {
		field = gjson.GetBytes(fields, "reaction.when.alarm")
	}

	if !field.Exists() {
		return nil
	}

	return &ReactionAlarmTrigger{
		FingerprintKey: fpk,
		ID:             id,
		Alarm:          time.UnixMilli(int64(field.Uint())),
	}
}

func QueryNextReactionAlarmTrigger(
	ctx context.Context,
	querier event.Querier,
	maxID event.ID,
) (ReactionAlarmTrigger, bool, error) {
	var next ReactionAlarmTrigger
	var hasNext bool

	limit := 1
	qs := event.QuerySet{
		"resume": event.Query{
			ViewCriteria: event.Criteria{
				WhereCompare: map[string][]event.WhereCompare{
					"type":                  {{Compare: "=", Value: "reaction"}},
					"reaction.disabled":     {{Compare: "!=", Value: 1}},
					"reaction.resume.alarm": {{Compare: "is not", Value: nil}},
				},
				Limit: &limit,
			},
			View: event.ViewGroupByPathMaxID, // todo implement groupbyfingerprintmaxid
		},
		"launch": event.Query{
			ViewCriteria: event.Criteria{
				WhereCompare: map[string][]event.WhereCompare{
					"type":                {{Compare: "=", Value: "reaction"}},
					"reaction.disabled":   {{Compare: "!=", Value: 1}},
					"reaction.when.alarm": {{Compare: "is not", Value: nil}},
					"reaction.resume":     {{Compare: "is", Value: nil}},
				},
				Limit: &limit,
			},
			View: event.ViewGroupByPathMaxID, // todo implement groupbyfingerprintmaxid
		},
	}
	matches, _, _, err := event.QueryEventset(ctx, querier, maxID, qs)
	if err != nil {
		return next, hasNext, err
	}

	for _, evt := range matches["resume"] {
		fpk, err := event.FingerprintKeyFor(evt.Payload)
		if err != nil {
			return next, hasNext, err
		}
		if t := reactionAlarmTriggerFor(evt.ID, fpk, evt.Payload); t != nil {
			if !hasNext || t.Alarm.Before(next.Alarm) ||
				(t.Alarm.Equal(next.Alarm) && t.ID.Compare(next.ID) < 0) {
				next = *t
			}
		}
	}

	for _, evt := range matches["launch"] {
		fpk, err := event.FingerprintKeyFor(evt.Payload)
		if err != nil {
			return next, hasNext, err
		}
		if t := reactionAlarmTriggerFor(evt.ID, fpk, evt.Payload); t != nil {
			if !hasNext || t.Alarm.Before(next.Alarm) ||
				(t.Alarm.Equal(next.Alarm) && t.ID.Compare(next.ID) < 0) {
				next = *t
			}
		}
	}

	return next, hasNext, nil
}
