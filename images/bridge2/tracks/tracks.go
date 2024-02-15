package tracks

import (
	"fmt"
	"os"
	"path/filepath"
	"reflect"
	"sort"
	"sync"
	"time"

	"github.com/fxamacker/cbor/v2"
	"github.com/gopxl/beep"
	"github.com/rs/xid"
)

var cborenc = func() cbor.EncMode {
	// We have to repeat this here since cbor doesn't have a way to propagate
	// these options down. So since we customize the encoding, calling
	// cbor.Marshal() would lose the options set in the main package.
	opts := cbor.CoreDetEncOptions()
	opts.Time = cbor.TimeRFC3339
	em, err := opts.EncMode()
	if err != nil {
		panic(err)
	}
	return em
}()

type Timestamp time.Duration // relative to stream start
type ID string

type Span interface {
	Track() *Track
	Span(from, to Timestamp) Span
	Start() Timestamp
	End() Timestamp
	Length() time.Duration
	Audio() beep.Streamer
	EventTypes() []string
	Events(typ string) []Event
}

type Handler interface {
	HandleEvent(Event)
}

func newIDWithTime(t time.Time) ID {
	return ID(xid.NewWithTime(t).String())
}

func newID() ID {
	return newIDWithTime(time.Now().UTC())
}

type EventMeta struct {
	Start, End Timestamp
	Type       string
	ID         ID
}

type Event struct {
	EventMeta
	Data  any
	track *Track
}

func (e Event) Track() *Track {
	return e.track
}

func (e Event) Span() Span {
	return &filteredSpan{e.Start, e.End, e.track}
}

func (e *Event) UnmarshalCBOR(data []byte) error {
	type EventRawData struct {
		EventMeta
		Data cbor.RawMessage
	}
	var eraw EventRawData
	if err := cbor.Unmarshal(data, &eraw); err != nil {
		return err
	}
	typ, ok := eventTypes[eraw.Type]
	if !ok {
		return fmt.Errorf("unknown event type %q", eraw.Type)
	}
	value := reflect.New(typ)
	if err := cbor.Unmarshal(eraw.Data, value.Interface()); err != nil {
		return err
	}
	e.EventMeta = eraw.EventMeta
	e.Data = reflect.Indirect(value).Interface()
	return nil
}

type SessionInfo struct {
	ID    ID
	Start time.Time
}

func LoadSessionInfo(root, id string) (*SessionInfo, error) {
	x, err := xid.FromString(id)
	if err != nil {
		return nil, err
	}
	return &SessionInfo{
		ID:    ID(id),
		Start: x.Time(),
	}, nil
}

func LoadSession(root, id string) (*Session, error) {
	var s Session
	f, err := os.Open(filepath.Join(root, id, "session"))
	if err != nil {
		return nil, err
	}
	if err := cbor.NewDecoder(f).Decode(&s); err != nil {
		return nil, err
	}
	// FIXME load the audio tracks as well
	return &s, nil
}

type Session struct {
	EventEmitter
	ID     ID
	Start  time.Time
	tracks sync.Map
}

func NewSession() *Session {
	start := time.Now().UTC()
	return &Session{
		ID:    newIDWithTime(start),
		Start: start,
	}
}

func (s *Session) NewTrack(format beep.Format) *Track {
	start := time.Now().UTC().Sub(s.Start)
	return s.NewTrackAt(Timestamp(start), format)
}

func (s *Session) NewTrackAt(start Timestamp, format beep.Format) *Track {
	t := &Track{
		ID:      newID(),
		Session: s,
		start:   start,
		audio:   newContinuousBuffer(format),
	}
	s.tracks.Store(t.ID, t)
	return t
}

func (s *Session) Tracks() []*Track {
	var out []*Track
	s.tracks.Range(func(key, value any) bool {
		out = append(out, value.(*Track))
		return true
	})
	return out
}

type sessionSnapshot struct {
	ID     ID
	Start  time.Time
	Tracks []*trackSnapshot
}

func (s *Session) snapshot() *sessionSnapshot {
	snap := &sessionSnapshot{
		ID:     s.ID,
		Start:  s.Start,
		Tracks: []*trackSnapshot{}, // empty slice to ensure it doesn't serialize as "null"
	}
	s.tracks.Range(func(key, value any) bool {
		snap.Tracks = append(snap.Tracks, value.(*Track).snapshot())
		return true
	})
	sort.Slice(snap.Tracks, func(i, j int) bool {
		return snap.Tracks[i].Start < snap.Tracks[j].Start
	})
	return snap
}

func (s *Session) MarshalCBOR() ([]byte, error) {
	return cborenc.Marshal(s.snapshot())
}

func (s *Session) UnmarshalCBOR(data []byte) error {
	var s2 sessionSnapshot
	if err := cbor.Unmarshal(data, &s2); err != nil {
		return err
	}
	s.ID = s2.ID
	s.Start = s2.Start
	for _, ts := range s2.Tracks {
		t := trackFromSnapshot(ts)
		t.Session = s
		s.tracks.Store(t.ID, t)
	}
	return nil
}

type Track struct {
	ID      ID
	Session *Session
	start   Timestamp
	audio   *continuousBuffer
	events  sync.Map
}

var _ Span = (*Track)(nil)

func (t *Track) record(typ string, span Span, data any) Event {
	e := Event{
		EventMeta: EventMeta{
			ID:    newID(),
			Start: span.Start(),
			End:   span.End(),
			Type:  typ,
		},
		Data:  data,
		track: t,
	}
	t.events.Store(e.ID, e)
	t.Session.Emit(e)
	return e
}

func (t *Track) UpdateEvent(evt Event) bool {
	// this is a copy so it won't affect the caller, but make sure it's pointing
	// to this track
	evt.track = t
	_, loaded := t.events.Swap(evt.ID, evt)
	// XXX if event was not there before, should we still add it, or skip?
	t.Session.Emit(evt)
	return loaded
}

func (t *Track) EventTypes() []string {
	seen := map[string]bool{}
	var out []string
	t.rangeEvents(func(e Event) bool {
		if seen[e.Type] {
			return true
		}
		seen[e.Type] = true
		out = append(out, e.Type)
		return true
	})
	sort.Strings(out)
	return out
}

func (t *Track) rangeEvents(f func(evt Event) bool) {
	t.events.Range(func(key, value any) bool {
		return f(value.(Event))
	})
}

func (t *Track) Events(typ string) []Event {
	var out []Event
	t.rangeEvents(func(e Event) bool {
		if e.Type == typ {
			out = append(out, e)
		}
		return true
	})
	sort.Slice(out, func(i, j int) bool {
		if out[i].Start < out[j].Start {
			return true
		}
		if out[i].Start > out[j].Start {
			return false
		}
		return out[i].End < out[j].End
	})
	return out
}

func (t *Track) Audio() beep.Streamer {
	return t.audio.StreamerFrom(0)
}

func (t *Track) AudioFormat() beep.Format {
	return t.audio.Format()
}

func (t *Track) AddAudio(streamer beep.Streamer) {
	before := t.End()
	t.audio.Append(streamer)
	after := t.End()
	t.Session.Emit(Event{
		EventMeta: EventMeta{
			// should this still generate an ID even if it's not permanent?
			Start: before,
			End:   after,
			Type:  "audio",
		},
		track: t,
	})
}

func (t *Track) Span(from Timestamp, to Timestamp) Span {
	return &filteredSpan{from, to, t}
}

// Start implements Span.
func (t *Track) Start() Timestamp {
	return t.start
}

func (t *Track) End() Timestamp {
	if t.audio == nil {
		return t.start
	}
	dur := t.audio.Format().SampleRate.D(t.audio.Len())
	return t.start + Timestamp(dur)
}

func (t *Track) Length() time.Duration {
	return time.Duration(t.End() - t.start)
}

func (t *Track) Track() *Track {
	return t
}

type trackSnapshot struct {
	ID     ID
	Events []Event
	Start  Timestamp
	Format beep.Format
}

func (t *Track) snapshot() *trackSnapshot {
	data := trackSnapshot{
		ID:     t.ID,
		Start:  t.start,
		Format: t.audio.Format(),
		Events: []Event{}, // empty slice to ensure it doesn't serialize as "null"
	}
	t.rangeEvents(func(e Event) bool {
		data.Events = append(data.Events, e)
		return true
	})
	sort.Slice(data.Events, func(i, j int) bool {
		ei, ej := data.Events[i], data.Events[j]
		if ei.Start < ej.Start {
			return true
		}
		if ei.Start > ej.Start {
			return false
		}
		return ei.End < ej.End
	})
	return &data
}

func trackFromSnapshot(tm *trackSnapshot) *Track {
	t := &Track{
		ID:    tm.ID,
		start: tm.Start,
		audio: newContinuousBuffer(tm.Format),
	}
	for _, e := range tm.Events {
		e.track = t
		t.events.Store(e.ID, e)
	}
	return t
}

type filteredSpan struct {
	start, end Timestamp
	track      *Track
}

var _ Span = (*filteredSpan)(nil)

func (s *filteredSpan) EventTypes() []string {
	// TODO should it return all types for the Track, or only ones found within this span?
	return s.Track().EventTypes()
}

func (s *filteredSpan) Events(typ string) []Event {
	var out []Event
	for _, a := range s.track.Events(typ) {
		if a.End < s.start || a.Start > s.end {
			continue
		}
		out = append(out, a)
	}
	return out
}

func (s *filteredSpan) Audio() beep.Streamer {
	startOffset := time.Duration(s.start - s.track.start)
	dur := time.Duration(s.end - s.start)
	from := s.track.audio.Format().SampleRate.N(startOffset)
	samples := s.track.audio.Format().SampleRate.N(dur)
	return beep.Take(samples, s.track.audio.StreamerFrom(from))
}

func (s *filteredSpan) End() Timestamp {
	return s.end
}

func (s *filteredSpan) Span(from Timestamp, to Timestamp) Span {
	return &filteredSpan{from, to, s.track}
}

func (s *filteredSpan) Start() Timestamp {
	return s.start
}

func (s *filteredSpan) Length() time.Duration {
	return time.Duration(s.end - s.start)
}

func (s *filteredSpan) Track() *Track {
	return s.track
}

var eventTypes = map[string]reflect.Type{}

func EventRecorder[T any](name string) func(Span, T) Event {
	// TODO(Go 1.22) can use reflect.TypeFor[T]()
	eventTypes[name] = reflect.TypeOf((*T)(nil)).Elem()
	return func(s Span, data T) Event {
		return s.Track().record(name, s, data)
	}
}

func NilEventRecorder(name string) func(Span) Event {
	record := EventRecorder[*struct{}](name)
	return func(s Span) Event {
		return record(s, nil)
	}
}
