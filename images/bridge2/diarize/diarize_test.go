package diarize

import (
	"testing"
	"time"

	"github.com/ajbouh/substrate/images/bridge2/bridgetest"
	"github.com/ajbouh/substrate/images/bridge2/tracks"
	"github.com/google/go-cmp/cmp/cmpopts"
	"gotest.tools/assert"
	"gotest.tools/assert/cmp"
)

func TestPriorSamples(t *testing.T) {
	session := tracks.NewSession()
	track := bridgetest.NewTrackWithSilence(session, 60*time.Second)

	speaker1 := tracks.ID("speaker1")
	speaker2 := tracks.ID("speaker2")
	sec := tracks.Timestamp(time.Second)
	recordDiarization(track.Span(0*sec, 1*sec), &Diarization{SpeakerID: speaker1})
	recordDiarization(track.Span(1*sec, 2*sec), &Diarization{SpeakerID: speaker2})
	recordDiarization(track.Span(2*sec, 3*sec), &Diarization{SpeakerID: speaker1})
	recordDiarization(track.Span(3*sec, 30*sec), &Diarization{SpeakerID: speaker2})

	maxSampleLength := 5 * time.Second
	padding := 1 * time.Second
	actual := collectSamples(track, maxSampleLength, padding)

	assert.DeepEqual(t, samples{
		{speaker1, timeRange{0 * time.Second, 3 * time.Second}, nil},
		{speaker2, timeRange{3 * time.Second, 9 * time.Second}, nil},
	}, actual, cmpopts.IgnoreFields(sample{}, "Audio"))
}

func TestMapSpeakers(t *testing.T) {
	speaker1 := tracks.ID("id-speaker1")
	speaker2 := tracks.ID("id-speaker2")

	samples := samples{
		{speaker1, timeRange{0 * time.Second, 3 * time.Second}, nil},
		{speaker2, timeRange{3 * time.Second, 9 * time.Second}, nil},
	}
	timespans := []Timespan{
		{"new sample speaker1", 0, 1},
		{"new sample speaker1", 1, 2},
		{"new sample speaker2", 3, 4},
		{"new sample speaker2", 4, 8},
		{"new sample speaker1", 9, 10},
		{"new sample speaker2", 10, 11},
		{"new sample speaker 3", 11, 12},
	}
	actual, _ := samples.MapSpeakers(timespans)
	t.Logf("actual: %#v", actual)
	assert.Equal(t, speaker1, actual["new sample speaker1"])
	assert.Equal(t, speaker2, actual["new sample speaker2"])
	assert.Assert(t, speaker1 != actual["new sample speaker3"], "new speaker should have a new id, not %v", speaker1)
	assert.Assert(t, speaker2 != actual["new sample speaker3"], "new speaker should have a new id, not %v", speaker2)
}

func TestMapSpeakersNoPreviousSamples(t *testing.T) {
	samples := samples{}
	timespans := []Timespan{
		{"new sample speaker1", 0, 1},
		{"new sample speaker1", 1, 2},
		{"new sample speaker2", 3, 4},
		{"new sample speaker2", 4, 8},
		{"new sample speaker1", 9, 10},
		{"new sample speaker2", 10, 11},
		{"new sample speaker3", 11, 12},
	}
	actual, _ := samples.MapSpeakers(timespans)
	t.Logf("actual: %#v", actual)
	assert.Assert(t, cmp.Len(actual, 3))
	unique := make(map[tracks.ID]struct{})
	for _, id := range actual {
		unique[id] = struct{}{}
	}
	assert.Assert(t, cmp.Len(unique, 3), "should have gotten 3 new unique ids")
}
