package diarize

import (
	"context"
	"fmt"
	"log/slog"
	"sync"
	"time"

	"github.com/ajbouh/substrate/images/bridge/reaction"
	"github.com/ajbouh/substrate/images/bridge/tracks"
	"github.com/ajbouh/substrate/images/bridge/vad"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/gopxl/beep"
	"github.com/technosophos/moniker"
)

var namer = moniker.New()

// Sampler collects audio samples from a track for known speakers.
// Returns a beep Streamer containing all audio samples, and a SampleMapper
// to correlate the diarization results back to speaker IDs from this track.
// The caller should append the new audio data to the returned sample audio
// before diarization.
type Sampler interface {
	CollectSamples(track *tracks.Track) (beep.Streamer, SampleMapper)
}

// Maps diarization results back to the speaker IDs used to generate the
// samples.
//
// The input `[]SpeakerClientResult` should contain times relative to the
// combined <samples>+<new audio>. Input values prior to the end of the sample
// audio will be used to correlate the transient speaker IDs from diarization
// back to known speakers from the sample data.
//
// Input values found after the end of the sample audio will be returned as a
// `SampleMapping` containing the canonical speaker ID, and a time range
// relative to the *new* audio data.
//
// Also returns a `newIDs` slice containing any newly generated speaker IDs.
type SampleMapper interface {
	MapSpeakers(speakers []SpeakerClientResult) (_ []SampleMapping, newIDs []tracks.ID)
}

type SampleMapping struct {
	SpeakerID           tracks.ID
	InternalSpeakerName string
	Range               TimeRange
}

type Client interface {
	Diarize(stream beep.Streamer, format beep.Format) ([]SpeakerClientResult, error)
}

// SpeakerClientResult represents a speaker name corresponding to the time range
// within the provided audio sample. The names are expected only to be unique to
// the sample, and should be normalized to IDs.
type SpeakerClientResult struct {
	InternalSpeakerName string
	Range               TimeRange
}

type TimeRange struct{ Start, End time.Duration }

func (t TimeRange) Intersect(o TimeRange) time.Duration {
	if t.End <= o.Start || t.Start >= o.End {
		return 0
	}
	return min(t.End, o.End) - max(t.Start, o.Start)
}

func (t TimeRange) Sub(d time.Duration) TimeRange {
	return TimeRange{t.Start - d, t.End - d}
}

type Agent struct {
	Client  Client
	Sampler Sampler
	Session *tracks.Session
	Reactor *reaction.Reactor
	mutex   sync.Map
}

func (a *Agent) Initialize() {
	a.Sampler = greedySampler{
		SampleLength: 10 * time.Second,
		Padding:      1 * time.Second,
	}
}

func (a *Agent) lock(id tracks.ID) *sync.Mutex {
	v, _ := a.mutex.LoadOrStore(id, &sync.Mutex{})
	m := v.(*sync.Mutex)
	m.Lock()
	return m
}

func (a *Agent) Reactions(ctx context.Context) []reaction.CommandRuleInput {
	return []reaction.CommandRuleInput{
		a.Reactor.Rule("diarize:events", "voice-activity"),
	}
}

func (a *Agent) Commands(ctx context.Context) commands.Source {
	return reaction.Command(a.Reactor, "diarize:events",
		"Detect speakers within an audio sample",
		func(ctx context.Context, events []vad.ActivityEvent) ([]tracks.PathEvent, error) {
			slog.InfoContext(ctx, "diarize:events", "num_events", len(events))
			var results []tracks.PathEvent
			for _, e := range events {
				events, err := a.handle(ctx, e)
				if err != nil {
					return nil, err
				}
				results = append(results, events...)
			}
			return results, nil
		},
	)
}

func (a *Agent) handle(ctx context.Context, annot vad.ActivityEvent) ([]tracks.PathEvent, error) {
	track := a.Session.Track(annot.TrackID)
	if track == nil {
		return nil, fmt.Errorf("track not found: %s", annot.TrackID)
	}
	span := track.Span(annot.Start, annot.End)

	// Only process one sample per-track at a time to avoid race conditions for
	// new speakers being processed concurrently without the previous context.
	defer a.lock(annot.TrackID).Unlock()

	sampleAudio, samples := a.Sampler.CollectSamples(track)
	speakers, err := a.Client.Diarize(beep.Seq(sampleAudio, span.Audio()), track.AudioFormat())
	if err != nil {
		return nil, err
	}
	if len(speakers) == 0 {
		slog.InfoContext(ctx, "diarize: no speakers detected")
		return nil, nil
	}

	mapped, newIDs := samples.MapSpeakers(speakers)

	var out []tracks.PathEvent

	initSpan := span.Span(0, 0)
	for _, id := range newIDs {
		out = append(out, tracks.NewEvent(
			initSpan,
			"/diarize/speaker-name",
			"diarize-speaker-name",
			&SpeakerName{
				SpeakerID: id,
				Name:      namer.Name(),
			},
		))
	}
	for _, ts := range mapped {
		outSpan := spanRelative(span, ts.Range.Start, ts.Range.End)
		outSpan = clamp(span, outSpan)
		if outSpan.Length() <= 0 {
			slog.InfoContext(ctx, "diarization: outside of range", "mapping", ts)
		}
		out = append(out, tracks.NewEvent(
			outSpan,
			"/diarize/speaker-detected",
			"diarize-speaker-detected",
			&SpeakerDetected{
				SpeakerID:           ts.SpeakerID,
				InternalSpeakerName: ts.InternalSpeakerName,
			},
		))
	}
	return out, nil
}

// returns the Span offset from the beginning of `in` by `start` and `end`
func spanRelative(in tracks.Span, start, end time.Duration) tracks.Span {
	return in.Span(in.Start().Add(start), in.Start().Add(end))
}

// returns the portion of the `inner` span that is within the bounds of the
// `outer` span
func clamp(outer, inner tracks.Span) tracks.Span {
	return inner.Span(max(outer.Start(), inner.Start()), min(outer.End(), inner.End()))
}
