package translate

import (
	"context"
	"fmt"
	"log/slog"
	"strings"

	"github.com/ajbouh/substrate/images/bridge/calls"
	"github.com/ajbouh/substrate/images/bridge/reaction"
	"github.com/ajbouh/substrate/images/bridge/tracks"
	"github.com/ajbouh/substrate/images/bridge/transcribe"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

var recordTranslation = tracks.EventRecorder[*TranslationRecord]("translation")

type TranslationEvent tracks.EventT[*TranslationRecord]

type TranslationRecord struct {
	SourceEvent tracks.ID
	Translation *Translation
}

type Command = calls.CommandCall[Request, Translation]

type Agent struct {
	Session        *tracks.Session
	Command        *Command
	TargetLanguage string
	Reactor        *reaction.Reactor
}

type EventResult struct {
	Next []event.PendingEvent `json:"next" doc:""`
}

type TranscribeEvent tracks.EventT[*transcribe.Transcription]

func ptr[T any](t T) *T {
	return &t
}

func (es *Agent) Reactions(ctx context.Context) []reaction.CommandRuleInput {
	return []reaction.CommandRuleInput{
		es.Reactor.Rule("translate:events", "transcription"),
	}
}

func (es *Agent) Commands(ctx context.Context) commands.Source {
	return reaction.Command(es.Reactor, "translate:events",
		"Translate transcription events",
		func(ctx context.Context, events []TranscribeEvent) ([]tracks.PathEvent, error) {
			slog.InfoContext(ctx, "translate:events", "num_events", len(events))
			var results []tracks.PathEvent
			for _, e := range events {
				events, err := es.handle(ctx, e)
				if err != nil {
					return nil, err
				}
				results = append(results, events...)
			}
			return results, nil
		},
	)
}

func (a *Agent) handle(ctx context.Context, annot TranscribeEvent) ([]tracks.PathEvent, error) {
	in := annot.Data
	// This doesn't account for fuzzy matching, so SourceLanguage
	// comes back as "en", but the canonical for target seems to be "eng".
	if in.SourceLanguage == a.TargetLanguage {
		slog.InfoContext(ctx, "skipping translation, already in target language", "transcription", in, "target", a.TargetLanguage)
		return nil, nil
	}
	track := a.Session.Track(annot.TrackID)
	if track == nil {
		return nil, fmt.Errorf("track not found: %s", annot.TrackID)
	}
	span := track.Span(annot.Start, annot.End)

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
			span, "/translation", "translation",
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
