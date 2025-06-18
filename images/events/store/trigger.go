package store

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/tidwall/gjson"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type Trigger struct {
	Type string
	ID   event.ID

	ShadowsID             *event.ID
	ShadowsFingerprintKey *event.FingerprintKey

	FingerprintKey event.FingerprintKey
	QuerySet       event.QuerySet

	Alarm *time.Time

	Err error
}

func gjsonResultBytes(json []byte, result gjson.Result) []byte {
	if result.Index > 0 {
		return json[result.Index : result.Index+len(result.Raw)]
	}
	return []byte(result.Raw)
}

func reactionTriggerFor(id event.ID, fpk event.FingerprintKey, fields []byte) *Trigger {
	typeField := gjson.GetBytes(fields, "type")
	if !typeField.Exists() {
		return nil
	}

	var shadowsID *event.ID
	var shadowsFPK *event.FingerprintKey

	var errs []error

	typ := typeField.String()
	var whenField gjson.Result
	switch typ {
	case "reaction-continuation":
		whenField = gjson.GetBytes(fields, "reaction-continuation.when")
		reactionField := gjson.GetBytes(fields, "reaction-continuation.shadows")
		if reactionField.Exists() {
			if idField := reactionField.Get("id"); idField.Exists() {
				shadowsIDV, err := event.ParseID(idField.String())
				errs = append(errs, err)
				if err == nil {
					shadowsID = &shadowsIDV
				}
			}
			if fingerprintField := reactionField.Get("fingerprint"); fingerprintField.Exists() {
				fp := event.Fingerprint([]byte(fingerprintField.Raw))
				fpk := fp.Key()
				shadowsFPK = &fpk
			}
		}
	case "reaction":
		whenField = gjson.GetBytes(fields, "reaction.when")
	default:
		return nil
	}

	queryField := whenField.Get("query")
	alarmField := whenField.Get("alarm")

	if !queryField.Exists() && !alarmField.Exists() {
		return nil
	}

	afterField := whenField.Get("after")

	t := Trigger{
		Type:           typ,
		ID:             id,
		FingerprintKey: fpk,

		ShadowsID:             shadowsID,
		ShadowsFingerprintKey: shadowsFPK,
	}

	if alarmField.Exists() {
		alarm := time.UnixMilli(int64(alarmField.Uint()))
		t.Alarm = &alarm
	}

	var err error
	errs = append(errs, err)

	if queryField.Exists() {
		queryBytes := gjsonResultBytes(fields, queryField)
		err = json.Unmarshal(queryBytes, &t.QuerySet)
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
	}

	t.Err = errors.Join(errs...)
	return &t
}

func QueryReactionQueryTriggers(
	ctx context.Context,
	querier event.Querier,
	maxID event.ID,
) ([]Trigger, error) {
	qs := event.QuerySet{
		"resume": event.Query{
			ViewCriteria: event.Criteria{
				WhereCompare: map[string][]event.WhereCompare{
					"type": {{Compare: "=", Value: "reaction-continuation"}},
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
				},
			},
			View: event.ViewGroupByPathMaxID, // todo implement groupbyfingerprintmaxid
		},
	}
	matches, _, _, err := event.QueryEventset(ctx, querier, maxID, qs)
	if err != nil {
		return nil, err
	}

	var triggerable []Trigger

	var pending = map[event.ID]bool{}

	for _, evt := range matches["resume"] {
		fpk, err := event.FingerprintKeyFor(evt.Payload)
		if err != nil {
			return nil, err
		}

		reactionIDField := gjson.GetBytes(evt.Payload, "reaction-continuation.reaction")
		if reactionIDField.Exists() {
			reactionID, err := event.ParseID(reactionIDField.String())
			if err != nil {
				return nil, err
			}
			pending[reactionID] = true
		}

		if gjson.GetBytes(evt.Payload, "reaction-continuation.disabled").Bool() {
			// disabled continuations still suppress
			continue
		}

		if t := reactionTriggerFor(evt.ID, fpk, evt.Payload); t != nil {
			triggerable = append(triggerable, *t)
		}
	}

	for _, evt := range matches["launch"] {
		if pending[evt.ID] {
			continue
		}

		fpk, err := event.FingerprintKeyFor(evt.Payload)
		if err != nil {
			return nil, err
		}
		if t := reactionTriggerFor(evt.ID, fpk, evt.Payload); t != nil && len(t.QuerySet) > 0 {
			triggerable = append(triggerable, *t)
		}
	}

	return triggerable, nil
}

func QueryNextReactionAlarmTrigger(
	ctx context.Context,
	querier event.Querier,
	maxID event.ID,
) (Trigger, bool, error) {
	var next Trigger
	var hasNext bool

	limit := 1
	qs := event.QuerySet{
		"resume": event.Query{
			ViewCriteria: event.Criteria{
				WhereCompare: map[string][]event.WhereCompare{
					"type":                             {{Compare: "=", Value: "reaction-continuation"}},
					"reaction-continuation.disabled":   {{Compare: "!=", Value: 1}},
					"reaction-continuation.when.alarm": {{Compare: "is not", Value: nil}},
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
		if t := reactionTriggerFor(evt.ID, fpk, evt.Payload); t != nil && t.Alarm != nil {
			if !hasNext || t.Alarm.Before(*next.Alarm) ||
				(t.Alarm.Equal(*next.Alarm) && t.ID.Compare(next.ID) < 0) {
				next = *t
			}
		}
	}

	for _, evt := range matches["launch"] {
		fpk, err := event.FingerprintKeyFor(evt.Payload)
		if err != nil {
			return next, hasNext, err
		}
		if t := reactionTriggerFor(evt.ID, fpk, evt.Payload); t != nil && t.Alarm != nil {
			if !hasNext || t.Alarm.Before(*next.Alarm) ||
				(t.Alarm.Equal(*next.Alarm) && t.ID.Compare(next.ID) < 0) {
				next = *t
			}
		}
	}

	return next, hasNext, nil
}
