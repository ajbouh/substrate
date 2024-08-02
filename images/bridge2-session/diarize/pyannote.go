package diarize

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/ajbouh/substrate/images/bridge2-session/audio"
	"github.com/gopxl/beep"
)

type PyannoteClient struct {
	Endpoint string
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
	resp, err := a.request(request)
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

func (a *PyannoteClient) request(request *Request) (*Response, error) {
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
