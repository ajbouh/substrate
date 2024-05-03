package tools

import (
	"strings"
	"testing"
	"time"

	"github.com/ajbouh/substrate/images/bridge/bridgetest"
	"github.com/ajbouh/substrate/images/bridge/tracks"
	"github.com/google/go-cmp/cmp/cmpopts"
	"gotest.tools/assert"
)

func TestAutoCall(t *testing.T) {
	session := tracks.NewSession()
	var a AutoTriggerAgent
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
				OfferEvent: evt.ID,
				Call:       call,
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
				OfferEvent: evt.ID,
				Call:       call,
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
				Name:         "strings",
				TriggerEvent: evt.ID,
				Call:         call,
				Response: Response[any]{
					Content: "HELLO",
				},
			},
		}

		events := es.FetchFor(10 * time.Millisecond)
		assert.DeepEqual(t, []tracks.Event{evt, expected}, events, cmpopts.IgnoreFields(tracks.Event{}, "ID", "track"))
	})
}
