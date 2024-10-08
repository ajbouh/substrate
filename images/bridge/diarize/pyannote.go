package diarize

import (
	"context"
	"time"

	"github.com/ajbouh/substrate/images/bridge/audio"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/gopxl/beep"
)

type PyannoteClient struct {
	Source  commands.Source
	Command string
}

func float64ToDuration(f float64) time.Duration {
	return time.Duration(f * float64(time.Second))
}

func (a *PyannoteClient) Diarize(stream beep.Streamer, format beep.Format) ([]SpeakerClientResult, error) {
	pcm, err := audio.StreamAll(stream)
	if err != nil {
		return nil, err
	}
	b, err := audio.ToWav(pcm, format.SampleRate.N(time.Second))
	if err != nil {
		return nil, err
	}
	request := &Request{
		AudioData: b,
	}
	resp, err := commands.Call[Response](context.TODO(), a.Source, a.Command, request)
	if err != nil {
		return nil, err
	}
	speakers := make([]SpeakerClientResult, 0, len(resp.Timespans))
	for _, t := range resp.Timespans {
		speakers = append(speakers, SpeakerClientResult{
			InternalSpeakerName: t.Speaker,
			Range: TimeRange{
				Start: float64ToDuration(t.Start),
				End:   float64ToDuration(t.End),
			},
		})
	}
	return speakers, nil
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
