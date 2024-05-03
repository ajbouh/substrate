package diarize

import (
	"time"

	"github.com/ajbouh/substrate/images/bridge/tracks"
	"github.com/gopxl/beep"
	"github.com/gopxl/beep/generators"
)

type sample struct {
	SpeakerID tracks.ID
	Range     TimeRange
	Audio     beep.Streamer
}

type samples []sample

func (s samples) End() time.Duration {
	if len(s) == 0 {
		return 0
	}
	return s[len(s)-1].Range.End
}

func (s samples) Audio() beep.Streamer {
	streamers := make([]beep.Streamer, 0, len(s))
	for _, x := range s {
		streamers = append(streamers, x.Audio)
	}
	return beep.Seq(streamers...)
}

func (s samples) MapSpeakers(speakers []SpeakerClientResult) ([]SampleMapping, []tracks.ID) {
	ids, newIDs := s.mapSpeakers(speakers)
	sampleEnd := s.End()
	var r []SampleMapping
	for _, ts := range speakers {
		x := SampleMapping{
			SpeakerID:           ids[ts.InternalSpeakerName],
			InternalSpeakerName: ts.InternalSpeakerName,
			Range:               ts.Range.Sub(sampleEnd),
		}
		if x.Range.End >= 0 {
			r = append(r, x)
		}
	}
	return r, newIDs
}

func (s samples) mapSpeakers(ts []SpeakerClientResult) (map[string]tracks.ID, []tracks.ID) {
	matches := make(map[string]map[tracks.ID]time.Duration)
	for _, t := range ts {
		m := matches[t.InternalSpeakerName]
		if m == nil {
			m = make(map[tracks.ID]time.Duration)
			matches[t.InternalSpeakerName] = m
		}
		s.IncrementMatches(m, t.Range.Start, t.Range.End)
	}
	r := make(map[string]tracks.ID)
	var newSpeakers []tracks.ID
	for spkr, m := range matches {
		best := tracks.NewID()
		isNew := true
		for id, dur := range m {
			if dur > m[best] {
				best = id
				isNew = false
			}
		}
		r[spkr] = best
		if isNew {
			newSpeakers = append(newSpeakers, best)
		}
	}
	return r, newSpeakers
}

func (s samples) IncrementMatches(m map[tracks.ID]time.Duration, start, end time.Duration) {
	r := TimeRange{start, end}
	for _, samp := range s {
		dur := samp.Range.Intersect(r)
		if dur > 0 {
			m[samp.SpeakerID] += dur
		}
	}
}

type greedySampler struct {
	SampleLength time.Duration
	Padding      time.Duration
}

func (x greedySampler) CollectSamples(track *tracks.Track) (beep.Streamer, SampleMapper) {
	type sampleInternal struct {
		SpeakerID tracks.ID
		Duration  time.Duration
		Audio     []beep.Streamer
	}

	prior := track.Events("diarize-speaker-detected")
	byID := make(map[tracks.ID]*sampleInternal)
	var samp []*sampleInternal
	for _, e := range prior {
		data := e.Data.(*SpeakerDetected)
		s := byID[data.SpeakerID]
		if s == nil {
			s = &sampleInternal{SpeakerID: data.SpeakerID}
			samp = append(samp, s)
			byID[data.SpeakerID] = s
		}
		if s.Duration < x.SampleLength {
			dur := e.End.Sub(e.Start)
			s.Duration += dur
			s.Audio = append(s.Audio, e.Span().Audio())
		}
	}

	r := make(samples, len(samp))
	var start time.Duration
	maxSamples := track.AudioFormat().SampleRate.N(x.SampleLength)
	padSamples := track.AudioFormat().SampleRate.N(x.Padding)
	for i, s := range samp {
		audio := beep.Seq(s.Audio...)
		if s.Duration > x.SampleLength {
			audio = beep.Take(maxSamples, audio)
		}
		pad := generators.Silence(padSamples)
		r[i] = sample{
			SpeakerID: s.SpeakerID,
			Range:     TimeRange{start, start + min(s.Duration, x.SampleLength) + x.Padding},
			Audio:     beep.Seq(audio, pad),
		}
		start = r[i].Range.End
	}
	return r.Audio(), r
}
