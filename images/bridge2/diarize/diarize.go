package diarize

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/ajbouh/substrate/images/bridge2/audio"
	"github.com/ajbouh/substrate/images/bridge2/tracks"
	"github.com/gopxl/beep"
	"github.com/gopxl/beep/generators"
	"github.com/technosophos/moniker"
)

var recordDiarization = tracks.EventRecorder[*Diarization]("diarization")
var recordSpeakerName = tracks.EventRecorder[*SpeakerName]("diarization-speaker-name")

var namer = moniker.New()

type Diarization struct {
	SourceID            tracks.ID
	SpeakerID           tracks.ID
	InternalSpeakerName string
}

type SpeakerName struct {
	SpeakerID tracks.ID
	Name      string
}

type Agent struct {
	Endpoint string
}

const (
	maxSampleLength = 5 * time.Second
	samplePadding   = 1 * time.Second
)

func (a *Agent) HandleEvent(annot tracks.Event) {
	if annot.Type != "activity" {
		return
	}

	samples := collectSamples(annot.Track(), maxSampleLength, samplePadding)
	combinedAudio := make([]beep.Streamer, 0, len(samples)+1)
	for _, s := range samples {
		combinedAudio = append(combinedAudio, s.Audio)
	}
	combinedAudio = append(combinedAudio, annot.Span().Audio())
	pcm, err := audio.StreamAll(beep.Seq(combinedAudio...))
	if err != nil {
		log.Println("diarize:", err)
		return
	}
	sampleRate := 16000
	b, err := audio.ToWav(pcm, sampleRate)
	if err != nil {
		log.Println("diarize:", err)
		return
	}

	resp, err := a.Diarize(&Request{
		AudioData: b,
	})
	if err != nil {
		log.Println("diarize:", err)
		return
	}

	if len(resp.Timespans) == 0 {
		log.Println("diarize: no speakers detected")
		return
	}

	ids, newIDs := samples.MapSpeakers(resp.Timespans)

	initSpan := annot.Span().Span(0, 0)
	for _, id := range newIDs {
		recordSpeakerName(initSpan, &SpeakerName{
			SpeakerID: id,
			Name:      namer.Name(),
		})
	}

	sampleEnd := tracks.Timestamp(samples.End())
	timeOffset := annot.Start - sampleEnd

	for _, ts := range resp.Timespans {
		tsStart := tracks.Timestamp(ts.Start * float64(time.Second))
		tsEnd := tracks.Timestamp(ts.End * float64(time.Second))
		if tsEnd < sampleEnd {
			continue
		}
		start := max(timeOffset+tsStart, annot.Start)
		end := min(timeOffset+tsEnd, annot.End)
		if end <= start {
			log.Printf("got diarization outside of range: %#v", ts)
		}
		recordDiarization(annot.Span().Span(start, end), &Diarization{
			SourceID:            annot.ID,
			SpeakerID:           ids[ts.Speaker],
			InternalSpeakerName: ts.Speaker,
		})
	}
}

func (a *Agent) Diarize(request *Request) (*Response, error) {
	payloadBytes, err := json.Marshal(request)
	if err != nil {
		return nil, err
	}

	resp, err := http.Post(a.Endpoint, "application/json", bytes.NewBuffer(payloadBytes))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("diarize: %s", body)
	}
	var response Response
	err = json.Unmarshal(body, &response)
	return &response, err
}

type timeRange struct{ Start, End time.Duration }

func (t timeRange) Intersect(o timeRange) time.Duration {
	if t.End <= o.Start || t.Start >= o.End {
		return 0
	}
	return min(t.End, o.End) - max(t.Start, o.Start)
}

type sample struct {
	SpeakerID tracks.ID
	Range     timeRange
	Audio     beep.Streamer
}

type samples []sample

func float64ToDuration(f float64) time.Duration {
	return time.Duration(f * float64(time.Second))
}

func (s samples) End() time.Duration {
	if len(s) == 0 {
		return 0
	}
	return s[len(s)-1].Range.End
}

func (s samples) MapSpeakers(ts []Timespan) (map[string]tracks.ID, []tracks.ID) {
	matches := make(map[string]map[tracks.ID]time.Duration)
	for _, t := range ts {
		m := matches[t.Speaker]
		if m == nil {
			m = make(map[tracks.ID]time.Duration)
			matches[t.Speaker] = m
		}
		s.IncrementMatches(m, float64ToDuration(t.Start), float64ToDuration(t.End))
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
	r := timeRange{start, end}
	for _, samp := range s {
		dur := samp.Range.Intersect(r)
		if dur > 0 {
			m[samp.SpeakerID] += dur
		}
	}
}

func collectSamples(track *tracks.Track, maxLength, padding time.Duration) samples {
	type sampleInternal struct {
		SpeakerID tracks.ID
		Duration  time.Duration
		Audio     []beep.Streamer
	}

	prior := track.Events("diarization")
	byID := make(map[tracks.ID]*sampleInternal)
	var samp []*sampleInternal
	for _, e := range prior {
		data := e.Data.(*Diarization)
		s := byID[data.SpeakerID]
		if s == nil {
			s = &sampleInternal{SpeakerID: data.SpeakerID}
			samp = append(samp, s)
			byID[data.SpeakerID] = s
		}
		if s.Duration < maxLength {
			dur := e.End.Sub(e.Start)
			s.Duration += dur
			s.Audio = append(s.Audio, e.Span().Audio())
		}
	}

	samples := make([]sample, len(samp))
	var start time.Duration
	maxSamples := track.AudioFormat().SampleRate.N(maxLength)
	padSamples := track.AudioFormat().SampleRate.N(padding)
	for i, s := range samp {
		audio := beep.Seq(s.Audio...)
		if s.Duration > maxLength {
			audio = beep.Take(maxSamples, audio)
		}
		pad := generators.Silence(padSamples)
		samples[i] = sample{
			SpeakerID: s.SpeakerID,
			Range:     timeRange{start, start + min(s.Duration, maxLength) + padding},
			Audio:     beep.Seq(audio, pad),
		}
		start = samples[i].Range.End
	}
	return samples
}

type Request struct {
	AudioData []byte `json:"audio_data,omitempty"`
}

type Timespan struct {
	Speaker string  `json:"speaker"`
	Start   float64 `json:"start"`
	End     float64 `json:"end"`
}

type Response struct {
	Timespans []Timespan `json:"timespans"`
}
