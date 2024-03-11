package assistant

import (
	"cmp"
	"slices"
	"strings"
	"testing"
	"time"

	"github.com/ajbouh/substrate/images/bridge2/bridgetest"
	"github.com/ajbouh/substrate/images/bridge2/tracks"
	"github.com/ajbouh/substrate/images/bridge2/transcribe"
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

func TestAssistant(t *testing.T) {
	a := Agent{
		Assistants: map[string]struct{}{
			"bridge": {},
			"hal":    {},
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
				Type:  "assistant",
				Start: tevt.Start,
				End:   tevt.End,
			},
			Data: &AssistantEvent{
				SourceEvent: tevt.ID,
				Name:        "bridge",
				Prompt:      "bridge bar",
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
				Type:  "assistant",
				Start: tevt.Start,
				End:   tevt.End,
			},
			Data: &AssistantEvent{
				SourceEvent: tevt.ID,
				Name:        "bridge",
				Prompt:      "Bridge bar",
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
				Type:  "assistant",
				Start: tevt.Start,
				End:   tevt.End,
			},
			Data: &AssistantEvent{
				SourceEvent: tevt.ID,
				Name:        "bridge",
				Prompt:      "Bridge, bar",
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
				Type:  "assistant",
				Start: tevt.Start,
				End:   tevt.End,
			},
			Data: &AssistantEvent{
				SourceEvent: tevt.ID,
				Name:        "bridge",
				Prompt:      "hey Bridge, bar",
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
					Type:  "assistant",
					Start: tevt.Start,
					End:   tevt.End,
				},
				Data: &AssistantEvent{
					SourceEvent: tevt.ID,
					Name:        "bridge",
					Prompt:      "hey Bridge and HAL, open the pod bay doors",
				},
			},
			{
				EventMeta: tracks.EventMeta{
					Type:  "assistant",
					Start: tevt.Start,
					End:   tevt.End,
				},
				Data: &AssistantEvent{
					SourceEvent: tevt.ID,
					Name:        "hal",
					Prompt:      "hey Bridge and HAL, open the pod bay doors",
				},
			},
		}
		assert.DeepEqual(t, tevt, events[0], cmpopts.IgnoreFields(tracks.Event{}, "ID", "track"))
		assistantEvents := events[1:]
		slices.SortFunc(assistantEvents, func(a, b tracks.Event) int {
			return cmp.Compare(a.Data.(*AssistantEvent).Name, b.Data.(*AssistantEvent).Name)
		})
		assert.DeepEqual(t, expected, events[1:], cmpopts.IgnoreFields(tracks.Event{}, "ID", "track"))
	})

}
