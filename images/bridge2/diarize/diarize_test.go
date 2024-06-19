package diarize

import (
	"testing"
	"time"

	"github.com/ajbouh/substrate/images/bridge2/bridgetest"
	"github.com/ajbouh/substrate/images/bridge2/tracks"
	"github.com/ajbouh/substrate/images/bridge2/vad"
	"github.com/google/go-cmp/cmp/cmpopts"
	"github.com/gopxl/beep"
	"gotest.tools/assert"
	"gotest.tools/assert/cmp"
)

func TestPriorSamples(t *testing.T) {
	session := tracks.NewSession()
	track := bridgetest.NewTrackWithSilence(session, 60*time.Second)

	speaker1 := tracks.ID("speaker1")
	speaker2 := tracks.ID("speaker2")
	sec := tracks.Timestamp(time.Second)
	recordSpeakerDetected(track.Span(0*sec, 1*sec), &SpeakerDetected{SpeakerID: speaker1})
	recordSpeakerDetected(track.Span(1*sec, 2*sec), &SpeakerDetected{SpeakerID: speaker2})
	recordSpeakerDetected(track.Span(2*sec, 3*sec), &SpeakerDetected{SpeakerID: speaker1})
	recordSpeakerDetected(track.Span(3*sec, 30*sec), &SpeakerDetected{SpeakerID: speaker2})

	maxSampleLength := 5 * time.Second
	padding := 1 * time.Second
	_, actual := greedySampler{maxSampleLength, padding}.CollectSamples(track)

	assert.DeepEqual(t, samples{
		{speaker1, TimeRange{0 * time.Second, 3 * time.Second}, nil},
		{speaker2, TimeRange{3 * time.Second, 9 * time.Second}, nil},
	}, actual, cmpopts.IgnoreFields(sample{}, "Audio"))
}

func TestMapSpeakers(t *testing.T) {
	speaker1 := tracks.ID("id-speaker1")
	speaker2 := tracks.ID("id-speaker2")

	samples := samples{
		{speaker1, TimeRange{0 * time.Second, 3 * time.Second}, nil},
		{speaker2, TimeRange{3 * time.Second, 9 * time.Second}, nil},
	}
	timespans := []SpeakerClientResult{
		{"new sample speaker1", TimeRange{0 * time.Second, 1 * time.Second}},
		{"new sample speaker1", TimeRange{1 * time.Second, 2 * time.Second}},
		{"new sample speaker2", TimeRange{3 * time.Second, 4 * time.Second}},
		{"new sample speaker2", TimeRange{4 * time.Second, 8 * time.Second}},
		{"new sample speaker1", TimeRange{9 * time.Second, 10 * time.Second}},
		{"new sample speaker2", TimeRange{10 * time.Second, 11 * time.Second}},
		{"new sample speaker3", TimeRange{11 * time.Second, 12 * time.Second}},
	}
	actual, _ := samples.mapSpeakers(timespans)
	t.Logf("actual: %#v", actual)
	assert.Equal(t, speaker1, actual["new sample speaker1"])
	assert.Equal(t, speaker2, actual["new sample speaker2"])
	assert.Assert(t, speaker1 != actual["new sample speaker3"], "new speaker should have a new id, not %v", speaker1)
	assert.Assert(t, speaker2 != actual["new sample speaker3"], "new speaker should have a new id, not %v", speaker2)
}

func TestMapSpeakersNoPreviousSamples(t *testing.T) {
	samples := samples{}
	timespans := []SpeakerClientResult{
		{"new sample speaker1", TimeRange{0 * time.Second, 1 * time.Second}},
		{"new sample speaker1", TimeRange{1 * time.Second, 2 * time.Second}},
		{"new sample speaker2", TimeRange{3 * time.Second, 4 * time.Second}},
		{"new sample speaker2", TimeRange{4 * time.Second, 8 * time.Second}},
		{"new sample speaker1", TimeRange{9 * time.Second, 10 * time.Second}},
		{"new sample speaker2", TimeRange{10 * time.Second, 11 * time.Second}},
		{"new sample speaker3", TimeRange{11 * time.Second, 12 * time.Second}},
	}
	actual, _ := samples.mapSpeakers(timespans)
	t.Logf("actual: %#v", actual)
	assert.Assert(t, cmp.Len(actual, 3))
	unique := make(map[tracks.ID]struct{})
	for _, id := range actual {
		unique[id] = struct{}{}
	}
	assert.Assert(t, cmp.Len(unique, 3), "should have gotten 3 new unique ids")
}

type mockClient []SpeakerClientResult

func (m mockClient) Diarize(audio beep.Streamer, format beep.Format) ([]SpeakerClientResult, error) {
	return m, nil
}

func TestEvents(t *testing.T) {
	session := tracks.NewSession()
	track := bridgetest.NewTrackWithSilence(session, 60*time.Second)

	speaker1 := tracks.ID("id-speaker1")
	speaker2 := tracks.ID("id-speaker2")

	sec := tracks.Timestamp(time.Second)
	recordSpeakerDetected(track.Span(0*sec, 5*sec), &SpeakerDetected{SpeakerID: speaker1})
	recordSpeakerDetected(track.Span(5*sec, 10*sec), &SpeakerDetected{SpeakerID: speaker2})

	streamer := bridgetest.AddEventStreamer(session)

	agent := Agent{
		Client: mockClient{
			{"sample-speaker1", TimeRange{0 * time.Second, 5 * time.Second}},
			{"sample-speaker2", TimeRange{6 * time.Second, 11 * time.Second}},
			{"sample-speaker3", TimeRange{12 * time.Second, 22 * time.Second}},
			{"sample-speaker1", TimeRange{22 * time.Second, 32 * time.Second}},
		},
		Sampler: greedySampler{SampleLength: 5 * time.Second, Padding: 1 * time.Second},
	}
	agent.Initialize()
	session.Listen(&agent)
	activityEvent := vad.RecordActivity(track.Span(
		tracks.Timestamp(10*time.Second),
		tracks.Timestamp(30*time.Second),
	))

	events := streamer.FetchFor(100 * time.Millisecond)

	// validate the structure for the new speaker first, then extract the
	// randomly assigned ID
	assert.DeepEqual(t,
		[]tracks.Event{
			activityEvent,
			{
				EventMeta: tracks.EventMeta{
					Type: "diarize-speaker-name",
				},
				Data: &SpeakerName{},
			},
		},
		events[:2],
		cmpopts.IgnoreFields(tracks.Event{}, "ID", "track"),
		cmpopts.IgnoreFields(SpeakerName{}, "SpeakerID", "Name"),
	)

	speaker3 := events[1].Data.(*SpeakerName).SpeakerID

	assert.DeepEqual(t,
		[]tracks.Event{
			{
				EventMeta: tracks.EventMeta{
					Type:  "diarize-speaker-detected",
					Start: tracks.Timestamp(10 * time.Second),
					End:   tracks.Timestamp(20 * time.Second),
				},
				Data: &SpeakerDetected{
					SpeakerID:           speaker3,
					InternalSpeakerName: "sample-speaker3",
				},
			},
			{
				EventMeta: tracks.EventMeta{
					Type:  "diarize-speaker-detected",
					Start: tracks.Timestamp(20 * time.Second),
					End:   tracks.Timestamp(30 * time.Second),
				},
				Data: &SpeakerDetected{
					SpeakerID:           speaker1,
					InternalSpeakerName: "sample-speaker1",
				},
			},
		},
		events[2:],
		cmpopts.IgnoreFields(tracks.Event{}, "ID", "track"),
	)
}
