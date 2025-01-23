package transcribe

import (
	"context"
	"strings"

	"github.com/ajbouh/substrate/images/bridge/audio"
	"github.com/ajbouh/substrate/images/bridge/calls"
	"github.com/ajbouh/substrate/images/bridge/tracks"
)

var RecordTranscription = tracks.EventRecorder[*Transcription]("transcription")

type Command = calls.CommandCall[Request, Transcription]

type Agent struct {
	Command *Command
}

func (a *Agent) HandleEvent2(ctx context.Context, annot tracks.Event) ([]tracks.PathEvent, error) {
	if annot.Type != "activity" {
		return nil, nil
	}

	pcm, err := audio.StreamAll(annot.Span().Audio())
	if err != nil {
		return nil, err
	}
	b, err := audio.ToWav(pcm, 16000)
	if err != nil {
		return nil, err
	}
	transcription, err := a.Command.Call(ctx, Request{
		Task:      "transcribe",
		AudioData: &b,
		AudioMetadata: AudioMetadata{
			MimeType: "audio/wav",
		},
	})
	if err != nil {
		return nil, err
	}

	return []tracks.PathEvent{
		tracks.NewEvent(annot.Span(), "/transcription", "transcription", transcription),
	}, nil
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
