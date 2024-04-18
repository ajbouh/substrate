package assistant

import (
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/ajbouh/substrate/images/bridge2/bridgetest"
	"github.com/ajbouh/substrate/images/bridge2/tracks"
	"github.com/google/go-cmp/cmp/cmpopts"

	// "github.com/stretchr/testify/assert"
	"gotest.tools/assert"
)

func TestFSSync(t *testing.T) {
	path := t.TempDir()
	session := tracks.NewSession()
	a := newFSSync(session, path, 10*time.Millisecond)
	session.Listen(a)

	track := bridgetest.NewTrackWithSilence(session, 10*time.Millisecond)
	_ = track

	halPromptPath := filepath.Join(path, "hal")

	es := bridgetest.AddEventStreamer(session)

	t.Run("adding assistant writes to file", func(t *testing.T) {
		span := track.Span(track.End(), track.End())
		expected := "you are HAL 9000"
		evt := AddAssistant(span, "hal", expected)

		time.Sleep(2 * time.Millisecond)
		actual, err := os.ReadFile(halPromptPath)
		assert.Assert(t, err)
		assert.Equal(t, expected, string(actual))

		// Make sure we only get the one initial event.
		// Writing the file shouldn't trigger a duplicate event.
		events := es.FetchFor(500 * time.Millisecond)
		assert.DeepEqual(t, []tracks.Event{evt}, events, cmpopts.IgnoreFields(tracks.Event{}, "track"))
	})

	t.Run("writing to file updates assistant", func(t *testing.T) {
		newPrompt := "you are HAL 9001"
		assert.Assert(t, os.WriteFile(halPromptPath, []byte(newPrompt), 0644))

		events := es.FetchFor(500 * time.Millisecond)
		expected := tracks.Event{
			EventMeta: tracks.EventMeta{
				Type: "assistant-set-prompt",
			},
			Data: &AssistantPromptEvent{
				Name:           "hal",
				PromptTemplate: newPrompt,
			},
		}
		assert.DeepEqual(t, []tracks.Event{expected}, events, cmpopts.IgnoreFields(tracks.Event{}, "Start", "End", "ID", "track"))
	})

	t.Run("removing assistant deletes file", func(t *testing.T) {
		evt := RemoveAssistant(track.Span(track.End(), track.End()), "hal")

		time.Sleep(10 * time.Millisecond)
		_, err := os.Stat(halPromptPath)
		assert.Assert(t, os.IsNotExist(err), "should get a not-exist error: %v", err)

		events := es.FetchFor(500 * time.Millisecond)
		assert.DeepEqual(t, []tracks.Event{evt}, events, cmpopts.IgnoreFields(tracks.Event{}, "Start", "End", "ID", "track"))
	})
}
