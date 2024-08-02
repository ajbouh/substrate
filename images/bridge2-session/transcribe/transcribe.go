package transcribe

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/ajbouh/substrate/images/bridge2-session/audio"
	"github.com/ajbouh/substrate/images/bridge2-session/tracks"
)

var RecordTranscription = tracks.EventRecorder[*Transcription]("transcription")

type Agent struct {
	Endpoint string
}

func (a *Agent) HandleEvent(annot tracks.Event) {
	if annot.Type != "activity" {
		return
	}

	pcm, err := audio.StreamAll(annot.Span().Audio())
	if err != nil {
		log.Println("transcribe:", err)
		return
	}
	b, err := audio.ToWav(pcm, 16000)
	if err != nil {
		log.Println("transcribe:", err)
		return
	}

	transcription, err := a.Transcribe(&Request{
		Task:      "transcribe",
		AudioData: &b,
		AudioMetadata: AudioMetadata{
			MimeType: "audio/wav",
		},
	})
	if err != nil {
		log.Println("transcribe:", err)
		return
	}

	RecordTranscription(annot.Span(), transcription)
}

func (a *Agent) Transcribe(request *Request) (*Transcription, error) {
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

	if resp.StatusCode == http.StatusCreated || resp.StatusCode == http.StatusOK {
		response := &Transcription{}
		err = json.Unmarshal(body, response)
		return response, err
	} else {
		return nil, fmt.Errorf("transcribe: %s", body)
	}
}

type AudioMetadata struct {
	MimeType string `json:"mime_type,omitempty"`
}

type Request struct {
	AudioData     *[]byte       `json:"audio_data,omitempty"`
	AudioMetadata AudioMetadata `json:"audio_metadata,omitempty"`
	Task          string        `json:"task"`
}

type Transcription struct {
	TargetLanguage            string              `json:"target_language"`
	SourceLanguage            string              `json:"source_language"`
	SourceLanguageProbability float32             `json:"source_language_prob"`
	Duration                  float32             `json:"duration"`
	AllLanguageProbs          *map[string]float32 `json:"all_language_probs,omitempty"`

	Segments []Segment `json:"segments"`
}

func (t Transcription) Text() string {
	var texts []string
	for _, seg := range t.Segments {
		texts = append(texts, seg.Text)
	}
	return strings.Join(texts, " ")
}

type Word struct {
	Start       float32 `json:"start"`
	End         float32 `json:"end"`
	Word        string  `json:"word"`
	Probability float32 `json:"prob"`
}

type Segment struct {
	ID               uint32  `json:"id"`
	Seek             uint32  `json:"seek"`
	Start            float32 `json:"start"`
	End              float32 `json:"end"`
	Text             string  `json:"text"`
	Temperature      float32 `json:"temperature"`
	AvgLogprob       float32 `json:"avg_logprob"`
	CompressionRatio float32 `json:"compression_ratio"`
	NoSpeechProb     float32 `json:"no_speech_prob"`
	Words            []Word  `json:"words"`
}
