package translate

import (
	"context"
	"log"
	"strings"

	"github.com/ajbouh/substrate/images/bridge/tracks"
	"github.com/ajbouh/substrate/images/bridge/transcribe"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
)

var recordTranslation = tracks.EventRecorder[*TranslationEvent]("translation")

type TranslationEvent struct {
	SourceEvent tracks.ID
	Translation *Translation
}

type Agent struct {
	Source         commands.Source
	Command        string
	TargetLanguage string
}

func (a *Agent) HandleEvent(annot tracks.Event) {
	if annot.Type != "transcription" {
		return
	}

	in := annot.Data.(*transcribe.Transcription)
	// This doesn't account for fuzzy matching, so SourceLanguage
	// comes back as "en", but the canonical for target seems to be "eng".
	if in.SourceLanguage == a.TargetLanguage {
		log.Println("skipping translation for:", in, "already in target language", a.TargetLanguage)
		return
	}

	r, err := commands.Call[Translation](context.TODO(), a.Source, a.Command, &Request{
		SourceLanguage: in.SourceLanguage,
		TargetLanguage: a.TargetLanguage,
		Text:           in.Text(),
	})
	if err != nil {
		log.Println("translate:", err)
		return
	}
	log.Println("translated", r)

	recordTranslation(annot.Span(), &TranslationEvent{
		SourceEvent: annot.ID,
		Translation: r,
	})
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
