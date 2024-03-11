package assistant

import (
	"strings"
	"unicode"

	"github.com/ajbouh/substrate/images/bridge2/tracks"
	"github.com/ajbouh/substrate/images/bridge2/transcribe"
)

var recordAssistant = tracks.EventRecorder[*AssistantEvent]("assistant")

type AssistantEvent struct {
	SourceEvent tracks.ID
	Name        string
	Prompt      string
}

type Agent struct {
	Assistants map[string]struct{}
}

func (a *Agent) HandleEvent(annot tracks.Event) {
	if annot.Type != "transcription" {
		return
	}
	in := annot.Data.(*transcribe.Transcription)

	if len(in.Segments) == 0 || len(in.Segments[0].Words) == 0 {
		return
	}
	name := in.Segments[0].Words[0].Word
	name = strings.ToLower(name)
	name = strings.TrimFunc(name, func(r rune) bool {
		return !unicode.IsLetter(r)
	})
	_, ok := a.Assistants[name]
	if !ok {
		return
	}

	text := strings.TrimSpace(in.Text())
	_, prompt, _ := strings.Cut(text, " ")
	out := AssistantEvent{
		SourceEvent: annot.ID,
		Name:        name,
		Prompt:      prompt,
	}

	recordAssistant(annot.Span(), &out)
}
