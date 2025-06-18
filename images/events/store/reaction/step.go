package reaction

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"hash"
	"log/slog"
	"time"

	"github.com/tidwall/sjson"

	"github.com/ajbouh/substrate/images/events/store/reaction/timing"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type Step struct {
	ctx      context.Context
	reaction *Reaction

	querier Querier

	checksumResolver func(string) (func() hash.Hash, error)

	resume *Resume

	cancel context.CancelCauseFunc

	timings       *timing.Timings
	replayedLog   Log
	log           Log
	pendingWrites event.PendingEventSetBuilder
}

func (step *Step) ID() (event.ID, error) {
	ocsr, err := step.Op("id")
	if err != nil {
		return event.ID{}, fmt.Errorf("resolving resume checksummer: %w", err)
	}

	sample, err := step.sample(ocsr)
	if err != nil {
		return event.ID{}, err
	}

	err = sample.Commit()
	if err != nil {
		return event.ID{}, err
	}

	return sample.ReactionID, nil
}

func (step *Step) Now() (event.ID, error) {
	ocsr, err := step.Op("now")
	if err != nil {
		return event.ID{}, fmt.Errorf("reaction: now: %w", err)
	}

	sample, err := step.sample(ocsr)
	if err != nil {
		return event.ID{}, err
	}

	err = sample.Commit()
	if err != nil {
		return event.ID{}, err
	}

	return sample.Timestamp, nil
}

// is this safe to expose? do we need to access this through the replay log?
func (step *Step) IsFutureTime(t time.Time) bool {
	return event.Time(step.resume.Now).Before(t)
}

func (step *Step) Context() context.Context {
	return step.ctx
}

func (step *Step) Log(args ...any) {
	slog.Info("log api", "args", args, "isReplaying", step.resume.IsReplaying())
	if err := step.Context().Err(); err != nil {
		slog.Info("log api early return", "err", err)
		return
	}

	if step.resume.IsReplaying() {
		step.replayedLog.Append(args...)
	} else {
		step.log.Append(args...)
	}
}

func (step *Step) Timings() *timing.Timings {
	return step.timings
}

func (step *Step) AppendTimings(ts ...timing.Timing) {
	step.timings.Append(ts...)
}

func (step *Step) sample(ocsr *OpChecksummer) (Sample, error) {
	ocs, err := ocsr.Finish()
	if err != nil {
		return Sample{}, err
	}

	return step.resume.Sample(*ocs)
}

func (step *Step) Op(name string) (*OpChecksummer, error) {
	alg := step.resume.PeekChecksumAlgorithm()

	csa, err := step.checksumResolver(alg)
	if err != nil {
		return nil, err
	}

	return NewOpChecksummer(name, alg, csa), nil
}

func (step *Step) Fingerprint(ctx context.Context) (event.Fingerprint, error) {
	// do not use checksummer here, as technically the fingerprint cannot change over the lifetime of the reaction.
	return event.FingerprintFor(step.reaction.RawFields)
}

func (step *Step) unmarshalArg(ocsr *OpChecksummer, arg string, o JSONStringify, v any) error {
	slog.Info("unmarshalArg", "ocsr", ocsr, "arg", arg, "o", o, "v", v)
	csr, err := ocsr.Arg(arg)
	if err != nil {
		return fmt.Errorf("error declaring arg %s to op checksummer: %w", arg, err)
	}

	err = Unmarshal(o, v, step.timings, csr)
	if err != nil {
		return fmt.Errorf("error trying to unmarshal arg %s: %w", arg, err)
	}

	return nil
}

func (step *Step) Query(ctx context.Context, qsValue JSONStringify, optionsValue JSONStringify) (json.RawMessage, event.ID, *ResumptionConditions, error) {
	if err := step.Context().Err(); err != nil {
		return nil, event.ID{}, nil, err
	}

	ocsr, err := step.Op("query")
	if err != nil {
		return nil, event.ID{}, nil, fmt.Errorf("reaction: query: %w", err)
	}

	var qs event.QuerySet
	err = step.unmarshalArg(ocsr, "qs", qsValue, &qs)
	if err != nil {
		return nil, event.ID{}, nil, fmt.Errorf("reaction: query: unmarshal query %w", err)
	}

	var options struct {
		After string `json:"after"`
		Alarm *int64 `json:"alarm"`
		Peek  bool   `json:"peek"`
	}
	err = step.unmarshalArg(ocsr, "options", optionsValue, &options)
	if err != nil {
		return nil, event.ID{}, nil, fmt.Errorf("reaction: query: unmarshal options %w", err)
	}

	slog.Info("step.Query", "ocsr", ocsr, "qs", qs, "qsJSON", qsValue.JSONStringify(), "options", options, "optionsJSON", optionsValue.JSONStringify())

	var after event.ID
	if options.After != "" {
		after, err = event.ParseID(options.After)
		if err != nil {
			return nil, event.ID{}, nil, fmt.Errorf("reaction: query: invalid value for option.after: %w", err)
		}

		qs = qs.Modify(event.After(after))
	}

	sample, err := step.sample(ocsr)
	if err != nil {
		return nil, event.ID{}, nil, err
	}

	b2, _ := json.Marshal(qs)

	var alarmReady bool
	var alarm *time.Time
	if options.Alarm != nil {
		t := time.UnixMilli(*options.Alarm)
		alarm = &t
		now := event.Time(sample.Timestamp)
		// time is before or equal to the present, return even without results!
		alarmReady = now.Compare(t) >= 0
	}

	matches, _, _, err := event.QueryEventset(ctx, step.querier, sample.Timestamp, qs)
	if err != nil {
		return nil, event.ID{}, nil, fmt.Errorf("reaction: query: running query: %w", err)
	}

	b, err := json.Marshal(matches)
	if err != nil {
		return nil, event.ID{}, nil, fmt.Errorf("reaction: query: parsing results: %w", err)
	}

	slog.Info("step.Query", "after", after, "qsJSON", string(b2), "matches", string(b))

	anyMatches := false
	for _, result := range matches {
		if len(result) > 0 {
			anyMatches = true
			break
		}
	}

	if anyMatches || options.Peek || alarmReady {
		err = sample.Commit()
		return json.RawMessage(b), sample.Timestamp, nil, err
	}

	return nil, sample.Timestamp, &ResumptionConditions{
		Alarm: alarm,
		Query: qs,
		After: sample.Timestamp,
	}, nil
}

func (step *Step) Write(arg interface {
	JSONStringify
	Len() int64
}) error {
	slog.Info("write api", "arg", arg)

	if err := step.Context().Err(); err != nil {
		slog.Info("write api early exit")
		return err
	}

	ocsr, err := step.Op("write")
	slog.Info("write api", "ocsr", ocsr, "err", err)
	if err != nil {
		return fmt.Errorf("reaction: writec: %w", err)
	}

	pending := make([]event.PendingEvent, 0, arg.Len())

	pcsr, err := ocsr.Arg("pending")
	if err != nil {
		return fmt.Errorf("error unmarshaling write: %w", err)
	}

	err = Unmarshal(arg, &pending, step.timings, pcsr)
	slog.Info("write api", "pending", pending, "err", err)
	if err != nil {
		return fmt.Errorf("error unmarshaling write: %w", err)
	}

	sample, err := step.sample(ocsr)
	slog.Info("write api", "isReplay", sample, "err", err)
	if err != nil {
		return err
	}

	err = sample.Commit()
	if err != nil {
		return err
	}

	if !sample.IsReplay {
		slog.Info("write api", "skip", false, "len", len(pending))
		for _, entry := range pending {
			step.pendingWrites.Append(entry.Fields, entry.DataOpener(), entry.Vector, entry.ConflictKeys)
		}
	} else {
		slog.Info("write api", "skip", true, "len", len(pending))
	}

	return nil
}

func (step *Step) Pause(p *Pause) {
	slog.Info("Step.Pause", "p", p)
	step.cancel(p)
}

func (step *Step) MakeReceipt(pause *Pause, fields json.RawMessage) any {
	r := map[string]any{
		"type": "reaction-receipt",
		"log":  step.log.entries,
		"now":  step.resume.Now,
		// "timings": step.timings.Timings,
		"timings": nil,
		"this":    fields, // for debugging, not used in future reactions
		"links": map[string]any{
			"reaction": map[string]any{
				"rel":            "reaction",
				"eventref:event": step.reaction.ID.String(),
			},
		},
	}
	if pause.ErrFields != nil {
		r["error"] = pause.ErrFields
	} else if pause.Err != nil {
		// shouldn't really see pause.Err that lacks pause.ErrFields
		r["error"] = map[string]any{
			"message": pause.Err.Error(),
		}
	}

	slog.Info("Step.MakeReceipt", "pause", pause, "fields", string(fields))

	return r
}

func (step *Step) MakeResult(pause *Pause) (*event.PendingEventSet, error) {
	var err error
	var errs []error

	// by default we base our fields on the prev value, not the next
	// if we are not aborting or expecting to resume, then we will use next instead
	var this = step.reaction.RawFields
	var receiptThis = pause.RawFields
	if receiptThis == nil {
		receiptThis = step.reaction.RawFields
	}

	if pause.IsAborted() {
		this, err = sjson.SetBytes(this, "reaction.disabled", true)
		errs = append(errs, err)
	} else if pause.ShouldResume() {
		resume := map[string]any{
			"journal": step.resume.Journal,
		}

		if len(pause.ResumptionConditions.Query) > 0 {
			resume["query"] = pause.ResumptionConditions.Query
			resume["after"] = pause.ResumptionConditions.After
		}
		if pause.ResumptionConditions.Alarm != nil {
			resume["alarm"] = pause.ResumptionConditions.Alarm.UnixMilli()
		}

		// base our this on the prev value, not the upcoming one
		this, err = sjson.SetBytes(this, "reaction.resume", resume)
		errs = append(errs, err)
	} else {
		// if we have next this, use those
		if pause.RawFields != nil {
			this = []byte(pause.RawFields)
		}
		this, err = sjson.DeleteBytes(this, "reaction.resume")
		errs = append(errs, err)
		receiptThis = this
	}

	// only write if something has changed
	shouldWriteThis := !bytes.Equal(this, step.reaction.ShadowRawFields)
	if shouldWriteThis {
		step.pendingWrites.Append(this, nil, nil, nil)
	}
	slog.Info("Step.MakeResult", "pause", pause, "isAborted", pause.IsAborted(), "shouldResume", pause.ShouldResume(), "this", string(this), "receiptThis", string(receiptThis), "shadowRawFields", step.reaction.ShadowRawFields, "shouldWriteThis", shouldWriteThis)

	receipt := step.MakeReceipt(pause, receiptThis)
	receiptJSON, err := json.Marshal(receipt)
	errs = append(errs, err)
	step.pendingWrites.Append(receiptJSON, nil, nil, nil)

	return step.pendingWrites.Finish(), errors.Join(errs...)
}
