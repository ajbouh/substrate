package translator

import (
	"bytes"
	"context"
	"fmt"

	"github.com/ajbouh/bridge/pkg/asr"
	"github.com/ajbouh/bridge/pkg/oggwriter"
	"github.com/ajbouh/bridge/pkg/router"
)

func New(url string, useAudio bool, targetLanguage string, languageAliases ...string) (router.MiddlewareFunc, error) {
	client, err := asr.NewClient(url)
	if err != nil {
		return nil, err
	}

	languageAliasesSet := map[string]bool{}
	languageAliasesSet[targetLanguage] = true
	for _, l := range languageAliases {
		languageAliasesSet[l] = true
	}

	var fn func(t *router.Transcription) (*router.TranscriptionResponse, error)

	if useAudio {
		fn = func(t *router.Transcription) (*router.TranscriptionResponse, error) {
			audioSources := t.AudioSources
			b := &bytes.Buffer{}

			audioData, err := oggwriter.RenderOggPackets(b, 16000, 1, audioSources[0].Packets, audioSources[0].PacketSampleCounts)
			if err != nil {
				return nil, err
			}

			return client.Transcribe(&router.TranscriptionRequest{
				AudioData:      &audioData,
				Task:           "translate",
				TargetLanguage: &targetLanguage,
			})
		}
	} else {
		fn = func(t *router.Transcription) (*router.TranscriptionResponse, error) {
			text := ""
			for _, segment := range t.Segments {
				if segment.Text != "" {
					text += segment.Text
				} else {
					for _, word := range segment.Words {
						text += word.Word
					}
				}
			}
			return client.Transcribe(&router.TranscriptionRequest{
				Text:           &text,
				Task:           "translate",
				TargetLanguage: &targetLanguage,
				SourceLanguage: &t.Language,
			})
		}

	}

	return func(ctx context.Context, emit router.Emitters) (router.Listeners, error) {
		listener := make(chan router.Document, 100)
		s := &Translator{
			idSuffix:        "/translation[" + targetLanguage + "]",
			languageAliases: languageAliasesSet,
			fn:              fn,
		}
		go s.Run(emit.Transcription, listener)

		return router.Listeners{
			FinalDocument: listener,
		}, nil
	}, nil
}

type Translator struct {
	fn              func(t *router.Transcription) (*router.TranscriptionResponse, error)
	idSuffix        string
	languageAliases map[string]bool
}

func (s *Translator) Run(
	transcriptionStream chan<- *router.Transcription,
	listener <-chan router.Document,
) {
	observed := map[string]bool{}

	for doc := range listener {
		var t *router.Transcription
		for i := len(doc.Transcriptions) - 1; i >= 0; i-- {
			t = doc.Transcriptions[i]

			if !t.Final {
				continue
			}

			break
		}

		// Only respond to things that aren't based on other parts of the transcript. This avoids loops.
		if t == nil || len(t.TranscriptSources) > 0 {
			continue
		}

		if s.languageAliases[t.Language] || t.Language == "" || len(t.AudioSources) == 0 || t.TranscriptSources != nil {
			continue
		}

		// we'll fall behind as we wait for an answer. don't try to respond to one of these messages after we've seen it.
		if observed[t.ID] {
			continue
		}

		observed[t.ID] = true

		audioSources := t.AudioSources
		response, err := s.fn(t)

		if err != nil {
			fmt.Printf("error transcribing: %s\n", err)
			continue
		}

		final := t.Final
		for _, a := range audioSources {
			if !a.Final {
				final = false
			}
		}

		transcript := &router.Transcription{
			ID:    t.ID + s.idSuffix,
			Final: final,

			AudioSources:   audioSources,
			StartTimestamp: audioSources[0].StartTimestamp,
			EndTimestamp:   audioSources[0].EndTimestamp,

			Language:            response.TargetLanguage,
			LanguageProbability: 1,
			Duration:            response.Duration,
			AllLanguageProbs:    nil,

			// Reusing!
			Segments: response.Segments,
		}

		fmt.Printf("Foreign language detected language=%s translating to English...\n", t.Language)

		transcript.TranscriptSources = []*router.Transcription{t}
		transcript.AllLanguageProbs = nil

		for i := range transcript.Segments {
			transcript.Segments[i].Speaker = "Translator (" + transcript.Language + ")"
			transcript.Segments[i].IsAssistant = true
		}

		transcriptionStream <- transcript
	}
}
