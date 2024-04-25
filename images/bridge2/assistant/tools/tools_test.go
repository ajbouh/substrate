package tools

import (
	"strings"
	"testing"
	"time"

	"github.com/ajbouh/substrate/images/bridge2/assistant"
	"github.com/ajbouh/substrate/images/bridge2/bridgetest"
	"github.com/ajbouh/substrate/images/bridge2/tracks"
	"github.com/google/go-cmp/cmp/cmpopts"
	"gotest.tools/assert"
)

func TestFunc(t *testing.T) {
	// this is almost the same as the assistant, but
	// * it will use a "tool" prompt template
	// * maybe system prompt should be canned for these?
	// * output should be parsed to generate a tool event

	// Flow:
	// 1) send prompt for completion
	// 2) parse for proposed tool call format (write this as an event)
	//    - do we record this for every input? seems excessive?
	//    - or only if it matches something else?
	// (both yes or no to call something, could be multiple choices of tools?)
	// 3) send tool call to handler (automatic, or manual?)
	//    - automatic, but maybe we have an intermediate event to trigger the call?
	//    - e.g. whenever we get a call proposed, it automatically triggers the first one
	// 4) store tool response (as event)
	// 5) pass response to completion again to get chat output

	// If there's a tool call, that may take precedence over an assistant
	// response for the same input. Where do we do that filtering?
}

func TestAutoCall(t *testing.T) {
	session := tracks.NewSession()
	var a AutoCallAgent
	session.Listen(&a)
	track := bridgetest.NewTrackWithSilence(session, 10*time.Millisecond)
	es := bridgetest.AddEventStreamer(session)

	t.Run("empty offer does not trigger anything", func(t *testing.T) {
		span := track.Span(track.End(), track.End())

		evt := recordOffer(span, &OfferEvent{
			Calls: nil,
		})

		events := es.FetchFor(10 * time.Millisecond)
		assert.DeepEqual(t, []tracks.Event{evt}, events, cmpopts.IgnoreFields(tracks.Event{}, "track"))
	})

	t.Run("single offer is triggered", func(t *testing.T) {
		span := track.Span(track.End(), track.End())

		call := Call[any]{
			Name: "get_stock_fundamentals",
			Arguments: map[string]any{
				"symbol": "AAPL",
			},
		}

		evt := recordOffer(span, &OfferEvent{
			Calls: []Call[any]{call},
		})

		expected := tracks.Event{
			EventMeta: tracks.EventMeta{
				Type:  "tool-trigger",
				Start: span.Start(),
				End:   span.End(),
			},
			Data: &TriggerEvent{
				OfferID: evt.ID,
				Call:    call,
			},
		}

		events := es.FetchFor(10 * time.Millisecond)
		assert.DeepEqual(t, []tracks.Event{evt, expected}, events, cmpopts.IgnoreFields(tracks.Event{}, "ID", "track"))
	})

	t.Run("multiple offers triggers the first", func(t *testing.T) {
		span := track.Span(track.End(), track.End())

		call := Call[any]{
			Name: "get_stock_fundamentals",
			Arguments: map[string]any{
				"symbol": "AAPL",
			},
		}

		evt := recordOffer(span, &OfferEvent{
			Calls: []Call[any]{
				call,
				{Name: "not_triggered"},
			},
		})

		expected := tracks.Event{
			EventMeta: tracks.EventMeta{
				Type:  "tool-trigger",
				Start: span.Start(),
				End:   span.End(),
			},
			Data: &TriggerEvent{
				OfferID: evt.ID,
				Call:    call,
			},
		}

		events := es.FetchFor(10 * time.Millisecond)
		assert.DeepEqual(t, []tracks.Event{evt, expected}, events, cmpopts.IgnoreFields(tracks.Event{}, "ID", "track"))
	})
}

func TestTrigger(t *testing.T) {
	session := tracks.NewSession()
	a := CallAgent{
		Name: "strings",
		Runner: Tools{
			"to_upper": {
				Run: func(args any) (any, error) {
					args2 := args.(map[string]any)
					return strings.ToUpper(args2["text"].(string)), nil
				},
			},
		},
	}
	session.Listen(&a)
	track := bridgetest.NewTrackWithSilence(session, 10*time.Millisecond)
	es := bridgetest.AddEventStreamer(session)

	t.Run("trigger", func(t *testing.T) {
		span := track.Span(track.End(), track.End())

		call := Call[any]{
			Name: "to_upper",
			Arguments: map[string]any{
				"text": "hello",
			},
		}

		evt := recordTrigger(span, &TriggerEvent{
			Name: "strings",
			Call: call,
		})

		expected := tracks.Event{
			EventMeta: tracks.EventMeta{
				Type:  "tool-call",
				Start: span.Start(),
				End:   span.End(),
			},
			Data: &CallEvent{
				TriggerID: evt.ID,
				Call:      call,
				Response: Response[any]{
					Content: "HELLO",
				},
			},
		}

		events := es.FetchFor(10 * time.Millisecond)
		assert.DeepEqual(t, []tracks.Event{evt, expected}, events, cmpopts.IgnoreFields(tracks.Event{}, "ID", "track"))
	})
}

func TestSummarize(t *testing.T) {
	session := tracks.NewSession()
	a := Summarizer{
		Name: "stringer",
		Complete: func(content any) (string, string, error) {
			return "prompt", content.(string), nil
		},
	}
	session.Listen(&a)
	track := bridgetest.NewTrackWithSilence(session, 10*time.Millisecond)
	es := bridgetest.AddEventStreamer(session)

	t.Run("trigger", func(t *testing.T) {
		span := track.Span(track.End(), track.End())

		evt := recordCall(span, &CallEvent{
			Call: Call[any]{
				Name: "to_upper",
				Arguments: map[string]any{
					"text": "hello",
				},
			},
			Response: Response[any]{
				Content: "HELLO",
			},
		})

		expected := tracks.Event{
			EventMeta: tracks.EventMeta{
				Type:  "assistant-text",
				Start: span.Start(),
				End:   span.End(),
			},
			Data: &assistant.AssistantTextEvent{
				Name:     "stringer",
				Prompt:   "prompt",
				Response: stringPtr("HELLO"),
			},
		}

		events := es.FetchFor(10 * time.Millisecond)
		assert.DeepEqual(t, []tracks.Event{evt, expected}, events, cmpopts.IgnoreFields(tracks.Event{}, "ID", "track"))
	})
}
