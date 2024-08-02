package workingset

import (
	"github.com/ajbouh/substrate/images/bridge2-session/tracks"
)

var recordURLAdded = tracks.EventRecorder[*URLAdded]("working-set-add-url")

// Records adding a URL to the working set.
type URLAdded struct {
	Key string
	URL string
}
