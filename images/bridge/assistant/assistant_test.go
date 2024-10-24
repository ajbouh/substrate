package assistant

import (
	"cmp"
	"fmt"
	"slices"
	"strings"
	"testing"
	"time"

	"github.com/ajbouh/substrate/images/bridge/bridgetest"
	"github.com/ajbouh/substrate/images/bridge/tracks"
	"github.com/ajbouh/substrate/images/bridge/transcribe"
	"github.com/google/go-cmp/cmp/cmpopts"
	"gotest.tools/assert"
)

func makeSegments(text string) []transcribe.Segment {
	wordLenS := float32(time.Second) / float32(100*time.Millisecond)
	words := strings.Split(text, " ")
	s := transcribe.Segment{
		ID:    0,
		Start: 0,
		End:   float32(len(words)) * wordLenS,
		Text:  text,
	}
	for i, w := range words {
		s.Words = append(s.Words, transcribe.Word{
			Start: float32(i) * wordLenS,
			End:   float32(i+1) * wordLenS,
			Word:  w,
		})
	}
	return []transcribe.Segment{s}
}

type echoClient string

func (e echoClient) AssistantName() string {
	return string(e)
}

func (e echoClient) Complete(speaker, prompt string) (string, string, error) {
	if !matchesAssistantName(e, prompt) {
		return "", "", ErrNoMatch
	}
	return prompt, "echo: " + prompt, nil
}

func TestAssistant(t *testing.T) {
	a := Agent{
		DefaultAssistants: []Client{
			echoClient("bridge"),
			echoClient("hal"),
		},
	}

	session := tracks.NewSession()
	track := bridgetest.NewTrackWithSilence(session, 10*time.Millisecond)

	session.Listen(&a)
	es := bridgetest.AddEventStreamer(session)

	t.Run("does not match assistant name", func(t *testing.T) {
		tevt := transcribe.RecordTranscription(track, &transcribe.Transcription{
			Segments: makeSegments("bar"),
		})
		events := es.FetchFor(10 * time.Millisecond)
		assert.DeepEqual(t, []tracks.Event{tevt}, events, cmpopts.IgnoreFields(tracks.Event{}, "track"))
	})

	t.Run("matches assistant name", func(t *testing.T) {
		tevt := transcribe.RecordTranscription(track, &transcribe.Transcription{
			Segments: makeSegments("bridge bar"),
		})
		events := es.FetchFor(10 * time.Millisecond)
		expected := tracks.Event{
			EventMeta: tracks.EventMeta{
				Type:  "assistant-text",
				Start: tevt.Start,
				End:   tevt.End,
			},
			Data: &AssistantTextEvent{
				SourceEvent: tevt.ID,
				Name:        "bridge",
				Prompt:      "bridge bar",
				Response:    stringPtr("echo: bridge bar"),
			},
		}
		assert.DeepEqual(t, []tracks.Event{tevt, expected}, events, cmpopts.IgnoreFields(tracks.Event{}, "ID", "track"))
	})

	t.Run("matches assistant name not case sensistive", func(t *testing.T) {
		tevt := transcribe.RecordTranscription(track, &transcribe.Transcription{
			Segments: makeSegments("Bridge bar"),
		})
		events := es.FetchFor(10 * time.Millisecond)
		expected := tracks.Event{
			EventMeta: tracks.EventMeta{
				Type:  "assistant-text",
				Start: tevt.Start,
				End:   tevt.End,
			},
			Data: &AssistantTextEvent{
				SourceEvent: tevt.ID,
				Name:        "bridge",
				Prompt:      "Bridge bar",
				Response:    stringPtr("echo: Bridge bar"),
			},
		}
		assert.DeepEqual(t, []tracks.Event{tevt, expected}, events, cmpopts.IgnoreFields(tracks.Event{}, "ID", "track"))
	})

	t.Run("matches assistant name with punctuation", func(t *testing.T) {
		tevt := transcribe.RecordTranscription(track, &transcribe.Transcription{
			Segments: makeSegments("Bridge, bar"),
		})
		events := es.FetchFor(10 * time.Millisecond)
		expected := tracks.Event{
			EventMeta: tracks.EventMeta{
				Type:  "assistant-text",
				Start: tevt.Start,
				End:   tevt.End,
			},
			Data: &AssistantTextEvent{
				SourceEvent: tevt.ID,
				Name:        "bridge",
				Prompt:      "Bridge, bar",
				Response:    stringPtr("echo: Bridge, bar"),
			},
		}
		assert.DeepEqual(t, []tracks.Event{tevt, expected}, events, cmpopts.IgnoreFields(tracks.Event{}, "ID", "track"))
	})

	t.Run("matches assistant name in middle of message", func(t *testing.T) {
		tevt := transcribe.RecordTranscription(track, &transcribe.Transcription{
			Segments: makeSegments("hey Bridge, bar"),
		})
		events := es.FetchFor(10 * time.Millisecond)
		expected := tracks.Event{
			EventMeta: tracks.EventMeta{
				Type:  "assistant-text",
				Start: tevt.Start,
				End:   tevt.End,
			},
			Data: &AssistantTextEvent{
				SourceEvent: tevt.ID,
				Name:        "bridge",
				Prompt:      "hey Bridge, bar",
				Response:    stringPtr("echo: hey Bridge, bar"),
			},
		}
		assert.DeepEqual(t, []tracks.Event{tevt, expected}, events, cmpopts.IgnoreFields(tracks.Event{}, "ID", "track"))
	})

	t.Run("matches multiple assistant names", func(t *testing.T) {
		tevt := transcribe.RecordTranscription(track, &transcribe.Transcription{
			Segments: makeSegments("hey Bridge and HAL, open the pod bay doors"),
		})
		events := es.FetchFor(10 * time.Millisecond)
		expected := []tracks.Event{
			{
				EventMeta: tracks.EventMeta{
					Type:  "assistant-text",
					Start: tevt.Start,
					End:   tevt.End,
				},
				Data: &AssistantTextEvent{
					SourceEvent: tevt.ID,
					Name:        "bridge",
					Prompt:      "hey Bridge and HAL, open the pod bay doors",
					Response:    stringPtr("echo: hey Bridge and HAL, open the pod bay doors"),
				},
			},
			{
				EventMeta: tracks.EventMeta{
					Type:  "assistant-text",
					Start: tevt.Start,
					End:   tevt.End,
				},
				Data: &AssistantTextEvent{
					SourceEvent: tevt.ID,
					Name:        "hal",
					Prompt:      "hey Bridge and HAL, open the pod bay doors",
					Response:    stringPtr("echo: hey Bridge and HAL, open the pod bay doors"),
				},
			},
		}
		assert.DeepEqual(t, tevt, events[0], cmpopts.IgnoreFields(tracks.Event{}, "ID", "track"))
		assistantEvents := events[1:]
		slices.SortFunc(assistantEvents, func(a, b tracks.Event) int {
			return cmp.Compare(a.Data.(*AssistantTextEvent).Name, b.Data.(*AssistantTextEvent).Name)
		})
		assert.DeepEqual(t, expected, events[1:], cmpopts.IgnoreFields(tracks.Event{}, "ID", "track"))
	})

}

type simpleClient struct {
	Name         string
	SystemPrompt string
}

func (s simpleClient) AssistantName() string {
	return s.Name
}

func (s simpleClient) Complete(speaker, prompt string) (string, string, error) {
	if !matchesAssistantName(s, prompt) {
		return "", "", ErrNoMatch
	}
	return prompt, fmt.Sprintf("%s\n\n%s", s.SystemPrompt, prompt), nil
}

func TestAssistantAdd(t *testing.T) {
	a := Agent{
		NewClient: func(name, prompt string) (Client, error) {
			return simpleClient{name, prompt}, nil
		},
	}

	session := tracks.NewSession()
	track := bridgetest.NewTrackWithSilence(session, 10*time.Millisecond)

	es := bridgetest.AddEventStreamer(session)

	pevt := AddAssistant(track.Span(track.Start(), track.Start()),
		"hal",
		"you are HAL 9000, a sentient computer",
	)
	events := es.FetchFor(10 * time.Millisecond)
	assert.DeepEqual(t, []tracks.Event{pevt}, events, cmpopts.IgnoreFields(tracks.Event{}, "track"))

	t.Run("does not match assistant name before initialization", func(t *testing.T) {
		tevt := transcribe.RecordTranscription(track, &transcribe.Transcription{
			Segments: makeSegments("hello hal"),
		})
		events := es.FetchFor(10 * time.Millisecond)
		assert.DeepEqual(t, []tracks.Event{tevt}, events, cmpopts.IgnoreFields(tracks.Event{}, "track"))
	})

	t.Run("matches assistant name added via initialization", func(t *testing.T) {
		a.HandleSessionInit(session)

		tevt := transcribe.RecordTranscription(track, &transcribe.Transcription{
			Segments: makeSegments("hello hal"),
		})
		events := es.FetchFor(10 * time.Millisecond)
		expected := tracks.Event{
			EventMeta: tracks.EventMeta{
				Type:  "assistant-text",
				Start: tevt.Start,
				End:   tevt.End,
			},
			Data: &AssistantTextEvent{
				SourceEvent: tevt.ID,
				Name:        "hal",
				Prompt:      "hello hal",
				Response:    stringPtr("you are HAL 9000, a sentient computer\n\nhello hal"),
			},
		}
		assert.DeepEqual(t, []tracks.Event{tevt, expected}, events, cmpopts.IgnoreFields(tracks.Event{}, "ID", "track"))
	})

	t.Run("changes assistant prompt", func(t *testing.T) {
		pevt := AddAssistant(track.Span(track.End(), track.End()),
			"hal",
			"you are HAL 9001",
		)
		events := es.FetchFor(10 * time.Millisecond)
		assert.DeepEqual(t, []tracks.Event{pevt}, events, cmpopts.IgnoreFields(tracks.Event{}, "track"))

		tevt := transcribe.RecordTranscription(track, &transcribe.Transcription{
			Segments: makeSegments("hello hal"),
		})
		events = es.FetchFor(10 * time.Millisecond)
		expected := tracks.Event{
			EventMeta: tracks.EventMeta{
				Type:  "assistant-text",
				Start: tevt.Start,
				End:   tevt.End,
			},
			Data: &AssistantTextEvent{
				SourceEvent: tevt.ID,
				Name:        "hal",
				Prompt:      "hello hal",
				Response:    stringPtr("you are HAL 9001\n\nhello hal"),
			},
		}
		assert.DeepEqual(t, []tracks.Event{tevt, expected}, events, cmpopts.IgnoreFields(tracks.Event{}, "ID", "track"))
	})

	t.Run("older event does not changes system prompt", func(t *testing.T) {
		ts := track.Start() + tracks.Timestamp(5*time.Millisecond)
		pevt := AddAssistant(track.Span(ts, ts),
			"hal",
			"you are HAL 42",
		)
		events := es.FetchFor(10 * time.Millisecond)
		assert.DeepEqual(t, []tracks.Event{pevt}, events, cmpopts.IgnoreFields(tracks.Event{}, "track"))

		tevt := transcribe.RecordTranscription(track, &transcribe.Transcription{
			Segments: makeSegments("hello hal"),
		})
		events = es.FetchFor(10 * time.Millisecond)
		expected := tracks.Event{
			EventMeta: tracks.EventMeta{
				Type:  "assistant-text",
				Start: tevt.Start,
				End:   tevt.End,
			},
			Data: &AssistantTextEvent{
				SourceEvent: tevt.ID,
				Name:        "hal",
				Prompt:      "hello hal",
				Response:    stringPtr("you are HAL 9001\n\nhello hal"),
			},
		}
		assert.DeepEqual(t, []tracks.Event{tevt, expected}, events, cmpopts.IgnoreFields(tracks.Event{}, "ID", "track"))
	})

	t.Run("does not match again after assistant is removed", func(t *testing.T) {
		pevt := RemoveAssistant(track.Span(track.End(), track.End()), "hal")
		events := es.FetchFor(10 * time.Millisecond)
		assert.DeepEqual(t, []tracks.Event{pevt}, events, cmpopts.IgnoreFields(tracks.Event{}, "track"))

		tevt := transcribe.RecordTranscription(track, &transcribe.Transcription{
			Segments: makeSegments("hello hal"),
		})
		events = es.FetchFor(10 * time.Millisecond)
		assert.DeepEqual(t, []tracks.Event{tevt}, events, cmpopts.IgnoreFields(tracks.Event{}, "track"))
	})
}
