package tracks

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"reflect"
	"slices"
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

func (t Timestamp) String() string {
	return time.Duration(t).String()
}

func (t Timestamp) Sub(o Timestamp) time.Duration {
	return time.Duration(t) - (time.Duration(o))
}

func (t Timestamp) Add(d time.Duration) Timestamp {
	return t + Timestamp(d)
}

type ID string

func (id ID) Compare(other ID) int {
	// since these are based on xid, we can compare bytes to get time-based ordering
	return bytes.Compare([]byte(id), []byte(other))
}

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

func NewID() ID {
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

var ErrSessionNotFound = fmt.Errorf("session not found")

func LoadSession(root string) (*Session, error) {
	var s Session
	f, err := os.Open(filepath.Join(root, "session"))
	if err != nil {
		if os.IsNotExist(err) {
			return nil, ErrSessionNotFound
		}
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

	// TODO should we move this logic directly into EventEmitter?
	EventHandlers []Handler
}

func NewSession() *Session {
	start := time.Now().UTC()
	return &Session{
		ID:    newIDWithTime(start),
		Start: start,
	}
}

func (s *Session) Initialize() {
	for _, handler := range s.EventHandlers {
		s.Listen(handler)
	}
}

// Return a channel which will be notified when the session receives a new
// event. Designed to debounce handling for one update at a time. The channel
// will be closed when the context is cancelled to allow "range" loops over
// the updates.
func (sess *Session) UpdateHandler(ctx context.Context) <-chan struct{} {
	log.Printf("UpdateHandler...")
	defer log.Printf("UpdateHandler... done")

	ch := make(chan struct{}, 1)
	// start with a message in order to send an update right away
	ch <- struct{}{}
	h := HandlerFunc(func(e Event) {
		if e.Type == "audio" {
			// if this is a transient event like "audio" we don't need to save
			return
		}
		select {
		case ch <- struct{}{}:
		default:
		}
	})
	go func() {
		<-ctx.Done()
		sess.Unlisten(h)
		close(ch)
	}()
	sess.Listen(h)
	return ch
}

func (s *Session) NewTrack(format beep.Format) *Track {
	return s.NewTrackAt(s.now(), format)
}

func (s *Session) now() Timestamp {
	return Timestamp(time.Now().UTC().Sub(s.Start))
}

func (s *Session) NewTrackAt(start Timestamp, format beep.Format) *Track {
	t := &Track{
		ID:      NewID(),
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

func (s *Session) Track(id ID) *Track {
	track, ok := s.tracks.Load(id)
	if !ok {
		return nil
	}
	return track.(*Track)
}

func (s *Session) SpanNow() Span {
	tracks := s.Tracks()
	if len(tracks) == 0 {
		return nil
	}
	// since we don't have "global" events for the session right now, find the
	// track with the most recent data to add this span to
	latestTrack := slices.MaxFunc(tracks, func(a, b *Track) int {
		if a.End() > b.End() {
			return 1
		}
		if a.End() < b.End() {
			return -1
		}
		return a.ID.Compare(b.ID)
	})
	now := s.now()
	return latestTrack.Span(now, now)
}

type SessionSnapshot struct {
	ID     ID
	Start  time.Time
	Tracks []*trackSnapshot
}

func (s *Session) Snapshot() *SessionSnapshot {
	snap := &SessionSnapshot{
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
	return cborenc.Marshal(s.Snapshot())
}

func (s *Session) UnmarshalCBOR(data []byte) error {
	var s2 SessionSnapshot
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
			ID:    NewID(),
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

type jsonEvent struct {
	EventMeta `json:",inline"`
	Data      json.RawMessage `json:"data"`
}

func RecordJSONEvent(track *Track, jsonData []byte) (*Event, error) {
	var je jsonEvent
	if err := json.Unmarshal(jsonData, &je); err != nil {
		return nil, err
	}
	if je.ID != "" {
		return nil, fmt.Errorf("ID field is not allowed in JSON event")
	}
	// TODO if start/end are missing, do we default to Now()?
	typ, ok := eventTypes[je.Type]
	if !ok {
		return nil, fmt.Errorf("unknown event type %q", je.Type)
	}
	s := track.Span(je.Start, je.End)
	data := reflect.New(typ)
	json.Unmarshal(je.Data, data.Interface())
	event := track.record(je.Type, s, data.Elem().Interface())
	return &event, nil
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
