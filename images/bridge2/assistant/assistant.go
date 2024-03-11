package assistant

import (
	"strings"

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
	text := strings.TrimSpace(in.Text())
	names := a.matchAssistant(text)
	for _, name := range names {
		out := AssistantEvent{
			SourceEvent: annot.ID,
			Name:        name,
			Prompt:      text,
		}
		recordAssistant(annot.Span(), &out)
	}
}

func (a *Agent) matchAssistant(text string) []string {
	var matched []string
	text = strings.ToLower(text)
	for name := range a.Assistants {
		if strings.Contains(text, name) {
			matched = append(matched, name)
		}
	}
	return matched
}
