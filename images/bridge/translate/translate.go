package translate

import (
	"context"
	"log/slog"
	"strings"

	"github.com/ajbouh/substrate/images/bridge/calls"
	"github.com/ajbouh/substrate/images/bridge/tracks"
	"github.com/ajbouh/substrate/images/bridge/transcribe"
)

var recordTranslation = tracks.EventRecorder[*TranslationRecord]("translation")

type TranslationEvent tracks.EventT[*TranslationRecord]

type TranslationRecord struct {
	SourceEvent tracks.ID
	Translation *Translation
}

type Command = calls.CommandCall[Request, Translation]

type Agent struct {
	Command        *Command
	TargetLanguage string
}

func (a *Agent) HandleEvent2(ctx context.Context, annot tracks.Event) ([]tracks.PathEvent, error) {
	if annot.Type != "transcription" {
		return nil, nil
	}

	in := annot.Data.(*transcribe.Transcription)
	// This doesn't account for fuzzy matching, so SourceLanguage
	// comes back as "en", but the canonical for target seems to be "eng".
	if in.SourceLanguage == a.TargetLanguage {
		slog.InfoContext(ctx, "skipping translation, already in target language", "transcription", in, "target", a.TargetLanguage)
		return nil, nil
	}

	r, err := a.Command.Call(ctx, Request{
		SourceLanguage: in.SourceLanguage,
		TargetLanguage: a.TargetLanguage,
		Text:           in.Text(),
	})
	if err != nil {
		slog.ErrorContext(ctx, "error translating", "error", err)
		return nil, err
	}
	slog.InfoContext(ctx, "translation completed", "translation", r)

	return []tracks.PathEvent{
		tracks.NewEvent(
			annot.Span(), "/translation", "translation",
			&TranslationRecord{
				SourceEvent: annot.ID,
				Translation: r,
			},
		),
	}, nil
}

type Request struct {
	// doesn't seem to be used, but since it's "required", the requests will be rejected without it
	Task string `json:"task"`

	SourceLanguage string `json:"source_language,omitempty"`
	TargetLanguage string `json:"target_language,omitempty"`
	Text           string `json:"text,omitempty"`
}

type Translation struct {
	TargetLanguage string    `json:"target_language"`
	SourceLanguage string    `json:"source_language"`
	Segments       []Segment `json:"segments"`
}

func (t Translation) Text() string {
	var texts []string
	for _, seg := range t.Segments {
		texts = append(texts, seg.Text)
	}
	return strings.Join(texts, " ")
}

type Segment struct {
	Start float32 `json:"start"`
	End   float32 `json:"end"`
	Text  string  `json:"text"`
}
