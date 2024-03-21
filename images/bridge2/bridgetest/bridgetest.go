package bridgetest

import (
	"context"
	"time"

	"github.com/ajbouh/substrate/images/bridge2/tracks"
	"github.com/gopxl/beep"
	"github.com/gopxl/beep/generators"
)

func NewTrackWithSilence(session *tracks.Session, dur time.Duration) *tracks.Track {
	rate := beep.SampleRate(48000)
	track := session.NewTrackAt(0, beep.Format{
		SampleRate:  rate,
		NumChannels: 2,
		Precision:   2,
	})
	track.AddAudio(generators.Silence(rate.N(dur)))
	return track
}

type EventStreamer struct {
	ch chan tracks.Event
}

func (es *EventStreamer) HandleEvent(annot tracks.Event) {
	es.ch <- annot
}

func (es *EventStreamer) Fetch(ctx context.Context) []tracks.Event {
	var out []tracks.Event
	for {
		select {
		case <-ctx.Done():
			return out
		case e := <-es.ch:
			out = append(out, e)
		}
	}
}

func (es *EventStreamer) FetchFor(dur time.Duration) []tracks.Event {
	ctx, cancel := context.WithTimeout(context.Background(), dur)
	defer cancel()
	return es.Fetch(ctx)
}

func AddEventStreamer(s *tracks.Session) *EventStreamer {
	es := &EventStreamer{ch: make(chan tracks.Event)}
	s.Listen(es)
	return es
}
