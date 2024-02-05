package tracks

import (
	"testing"
	"time"

	"github.com/fxamacker/cbor/v2"
	"github.com/google/go-cmp/cmp"
	"github.com/google/go-cmp/cmp/cmpopts"
	"github.com/gopxl/beep"
	"github.com/gopxl/beep/generators"
	"github.com/stretchr/testify/require"
	"gotest.tools/assert"
)

var eqopts = cmp.Options{
	cmpopts.IgnoreFields(Event{}, "track"),
}

func init() {
	RegisterEvent[string]("text")
}

func TestTrack(t *testing.T) {
	session := &Session{}
	rate := beep.SampleRate(48000)
	track := session.NewTrackAt(0, beep.Format{
		SampleRate:  rate,
		NumChannels: 2,
		Precision:   2,
	})
	track.AddAudio(generators.Silence(rate.N(10 * time.Millisecond)))
	assert.DeepEqual(t, []Event(nil), track.Events("text"))

	track.RecordEvent("text", "foo-one")
	types := track.EventTypes()
	assert.DeepEqual(t, []string{"text"}, types)

	assert.DeepEqual(t,
		[]Event{
			{EventMeta: EventMeta{Start: 0, End: Timestamp(10 * time.Millisecond), Type: "text"}, Data: "foo-one"},
		},
		track.Events("text"),
		eqopts, cmpopts.IgnoreFields(Track{}, "ID"), cmpopts.IgnoreFields(Event{}, "ID"),
	)

	track.Span(Timestamp(5*time.Millisecond), Timestamp(10*time.Millisecond)).RecordEvent("text", "foo-two")
	assert.DeepEqual(t,
		[]Event{
			{EventMeta: EventMeta{Start: 0, End: Timestamp(10 * time.Millisecond), Type: "text"}, Data: "foo-one"},
			{EventMeta: EventMeta{Start: Timestamp(5 * time.Millisecond), End: Timestamp(10 * time.Millisecond), Type: "text"}, Data: "foo-two"},
		},
		track.Events("text"),
		eqopts, cmpopts.IgnoreFields(Track{}, "ID"), cmpopts.IgnoreFields(Event{}, "ID"),
	)
}

func assertCBORRoundTrip[T any](t *testing.T, in T, opts ...cmp.Option) {
	t.Helper()
	data, err := cbor.Marshal(in)
	require.NoError(t, err)
	var out T
	err = cbor.Unmarshal(data, &out)
	require.NoError(t, err)
	assert.DeepEqual(t, in, out, opts...)
}

func TestSerializeEventTypes(t *testing.T) {
	a := Event{
		EventMeta: EventMeta{
			Start: 0, End: Timestamp(10 * time.Millisecond),
			Type: "text",
		},
		Data: "foo-a",
	}
	assertCBORRoundTrip(t, a, eqopts)

	type MyType struct {
		Foo string
	}
	RegisterEvent[MyType]("my-type")
	b := Event{
		EventMeta: EventMeta{
			Start: 0, End: Timestamp(10 * time.Millisecond),
			Type: "my-type",
		},
		Data: MyType{Foo: "foo-b"},
	}
	assertCBORRoundTrip(t, b, eqopts)
}

func TestSerializeSession(t *testing.T) {
	session := &Session{}
	track := session.NewTrackAt(0, beep.Format{
		SampleRate:  beep.SampleRate(48000),
		NumChannels: 2,
		Precision:   2,
	})
	track.RecordEvent("text", "foo-one")
	track.Span(Timestamp(5*time.Millisecond), Timestamp(10*time.Millisecond)).RecordEvent("text", "foo-two")

	out, err := cbor.Marshal(session)
	require.NoError(t, err)

	var session2 Session
	require.NoError(t, cbor.Unmarshal(out, &session2))

	assert.DeepEqual(t, session.snapshot(), session2.snapshot(), eqopts)
}

func audioGenerator(t *testing.T) beep.Streamer {
	t.Helper()
	gen, err := generators.SineTone(beep.SampleRate(1000), 300)
	require.NoError(t, err)
	return gen
}

func assertEqualAudio(t *testing.T, format beep.Format, a, b beep.Streamer) {
	t.Helper()
	buf1 := beep.NewBuffer(format)
	buf1.Append(a)
	buf2 := beep.NewBuffer(format)
	buf2.Append(b)
	assert.DeepEqual(t, buf1, buf2, cmp.AllowUnexported(beep.Buffer{}))
}

func discardSamples(t *testing.T, n int, s beep.Streamer) {
	t.Helper()
	var samples [512][2]float64
	for n > 0 {
		m, ok := s.Stream(samples[:n])
		require.True(t, ok)
		n -= m
	}
}

func TestAudio(t *testing.T) {
	format := beep.Format{
		SampleRate:  beep.SampleRate(1000),
		NumChannels: 1,
		Precision:   2,
	}
	session := &Session{}
	track := session.NewTrackAt(0, format)
	gen := audioGenerator(t)

	// get the stream before we start adding audio to make sure it can capture all
	// the available audio
	initStream := track.Audio()

	assert.Equal(t, Timestamp(0), track.End(), "End should start at 0")

	track.AddAudio(beep.Take(format.SampleRate.N(1*time.Second), gen))
	assert.Equal(t, Timestamp(1*time.Second), track.End(), "adding one second of audio at the sample rate should increase the End by 1s")

	track.AddAudio(beep.Take(format.SampleRate.N(1*time.Second), gen))
	assert.Equal(t, Timestamp(2*time.Second), track.End(), "End should now be 2s")

	fullSamples := format.SampleRate.N(2 * time.Second)
	// taking a Span of the full audio should match the generator
	assertEqualAudio(t, format, beep.Take(fullSamples, audioGenerator(t)), track.Span(0, track.End()).Audio())
	// taking the audio from the streamer started before adding audio should also
	// match
	assertEqualAudio(t, format, beep.Take(fullSamples, audioGenerator(t)), beep.Take(fullSamples, initStream))

	// pick a start that won't align with the sine wave to make sure we're getting
	// the right segment
	midStart := 101 * time.Millisecond
	midEnd := 1500 * time.Millisecond
	middle := track.Span(Timestamp(midStart), Timestamp(midEnd))
	genMid := audioGenerator(t)
	discardSamples(t, format.SampleRate.N(midStart), genMid)
	genMid = beep.Take(format.SampleRate.N(midEnd-midStart), genMid)
	assertEqualAudio(t, format, genMid, middle.Audio())
}

func TestUpdateEvent(t *testing.T) {
	format := beep.Format{
		SampleRate:  beep.SampleRate(1000),
		NumChannels: 1,
		Precision:   2,
	}
	session := &Session{}
	track := session.NewTrackAt(0, format)

	eventData := func(typ string) (data []any) {
		for _, e := range track.Events(typ) {
			data = append(data, e.Data)
		}
		return
	}

	e1 := track.RecordEvent("text", "original")
	assert.DeepEqual(t, []any{"original"}, eventData("text"))

	e1.Data = "modified"
	// modifying the returned event should not affect the stored event directly
	assert.DeepEqual(t, []any{"original"}, eventData("text"))

	assert.Assert(t, track.UpdateEvent(e1))
	assert.DeepEqual(t, []any{"modified"}, eventData("text"))
}
