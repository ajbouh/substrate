package diarize

import (
	"context"
	"log/slog"
	"sync"
	"time"

	"github.com/ajbouh/substrate/images/bridge/tracks"
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

func (a *Agent) HandleEvent2(ctx context.Context, annot tracks.Event) ([]tracks.PathEvent, error) {
	if annot.Type != "activity" {
		return nil, nil
	}

	// Only process one sample per-track at a time to avoid race conditions for
	// new speakers being processed concurrently without the previous context.
	defer a.lock(annot.Track().ID).Unlock()

	sampleAudio, samples := a.Sampler.CollectSamples(annot.Track())
	speakers, err := a.Client.Diarize(beep.Seq(sampleAudio, annot.Span().Audio()), annot.Track().AudioFormat())
	if err != nil {
		return nil, err
	}
	if len(speakers) == 0 {
		slog.InfoContext(ctx, "diarize: no speakers detected")
		return nil, nil
	}

	mapped, newIDs := samples.MapSpeakers(speakers)

	var out []tracks.PathEvent

	initSpan := annot.Span().Span(0, 0)
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
		outSpan := spanRelative(annot.Span(), ts.Range.Start, ts.Range.End)
		outSpan = clamp(annot.Span(), outSpan)
		if outSpan.Length() <= 0 {
			slog.InfoContext(ctx, "diarization: outside of range", "mapping", ts)
		}
		out = append(out, tracks.NewEvent(
			initSpan,
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
