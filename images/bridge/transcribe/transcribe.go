package transcribe

import (
	"context"
	"fmt"
	"strings"

	"github.com/ajbouh/substrate/images/bridge/audio"
	"github.com/ajbouh/substrate/images/bridge/calls"
	"github.com/ajbouh/substrate/images/bridge/reaction"
	"github.com/ajbouh/substrate/images/bridge/tracks"
	"github.com/ajbouh/substrate/images/bridge/vad"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
)

var RecordTranscription = tracks.EventRecorder[*Transcription]("transcription")

type Command = calls.CommandCall[Request, Transcription]

type Agent struct {
	Command *Command
	Session *tracks.Session
	Reactor *reaction.Reactor
}

func (a *Agent) Reactions(ctx context.Context) []reaction.CommandRuleInput {
	return []reaction.CommandRuleInput{
		a.Reactor.Rule("transcribe:events", "voice-activity"),
	}
}

func (a *Agent) Commands(ctx context.Context) commands.Source {
	return reaction.Command(a.Reactor, "transcribe:events",
		"Translate transcription events",
		func(ctx context.Context, events []vad.ActivityEvent) ([]tracks.PathEvent, error) {
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

	pcm, err := audio.StreamAll(span.Audio())
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
		tracks.NewEvent(span, "/transcription", "transcription", transcription),
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

type Event tracks.EventT[*Transcription]

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
