package diarize

import (
	"github.com/ajbouh/substrate/images/bridge/tracks"
)

var recordSpeakerDetected = tracks.EventRecorder[*SpeakerDetected]("diarize-speaker-detected")
var recordSpeakerName = tracks.EventRecorder[*SpeakerName]("diarize-speaker-name")

// Records the ID of a speaker that was detected for the duration of the
// enclosing event.
type SpeakerDetected struct {
	SpeakerID           tracks.ID
	InternalSpeakerName string // Internal name provided by the speaker diarization model before normalization
}

type SpeakerDetectedEvent tracks.EventT[*SpeakerDetected]

// Provides a display name for the speaker ID.
// A random human-readable name will be generated by default when a new speaker
// ID is recorded, but can be overridden by later values.
type SpeakerName struct {
	SpeakerID tracks.ID
	Name      string
}

type SpeakerNameEvent tracks.EventT[*SpeakerName]
