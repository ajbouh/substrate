package transcriber

import (
	"context"
	"fmt"

	"github.com/ajbouh/bridge/pkg/asr"
	"github.com/ajbouh/bridge/pkg/router"
)

func New(url string) (router.MiddlewareFunc, error) {
	transcriber, err := asr.NewClient(url)
	if err != nil {
		return nil, err
	}

	return func(ctx context.Context, emit router.Emitters) (router.Listeners, error) {
		listener := make(chan *router.CapturedAudio, 100)
		go Run(transcriber, emit.Transcription, listener)

		return router.Listeners{
			CapturedAudio: listener,
		}, nil
	}, nil

}

func Run(s *asr.Client, transcriptionStream chan<- *router.Transcription, audioStream <-chan *router.CapturedAudio) {
	for audio := range audioStream {
		// we have not been speaking for at least 500ms now so lets run inference
		fmt.Printf("transcribing with %d window length\n", len(audio.PCM))

		response, err := s.Transcribe(&router.TranscriptionRequest{
			Audio: &router.Audio{
				Waveform:   audio.PCM,
				SampleRate: 16000,
			},
			Task: "transcribe",
		})

		if err != nil {
			fmt.Printf("error transcribing: %s\n", err)
			continue
		}

		final := audio.Final

		transcript := &router.Transcription{
			ID:    audio.ID + "/transcription",
			Final: final,

			AudioSources:   []*router.CapturedAudio{audio},
			StartTimestamp: audio.StartTimestamp,
			EndTimestamp:   audio.EndTimestamp,

			Language:            response.SourceLanguage,
			LanguageProbability: response.SourceLanguageProbability,
			Duration:            response.Duration,
			AllLanguageProbs:    nil,

			// Reusing!
			Segments: response.Segments,
		}

		for i := range transcript.Segments {
			transcript.Segments[i].Speaker = "Unknown"
			transcript.Segments[i].IsAssistant = false
		}

		transcriptionStream <- transcript
	}
}
