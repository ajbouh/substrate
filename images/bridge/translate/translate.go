package translate

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/ajbouh/substrate/images/bridge/tracks"
	"github.com/ajbouh/substrate/images/bridge/transcribe"
)

var recordTranslation = tracks.EventRecorder[*TranslationEvent]("translation")

type TranslationEvent struct {
	SourceEvent tracks.ID
	Translation *Translation
}

type Agent struct {
	Endpoint       string
	TargetLanguage string
}

func (a *Agent) HandleEvent(annot tracks.Event) {
	if annot.Type != "transcription" {
		return
	}

	in := annot.Data.(*transcribe.Transcription)
	// This doesn't account for fuzzy matching, so SourceLanguage
	// comes back as "en", but the canonical for target seems to be "eng".
	if in.SourceLanguage == a.TargetLanguage {
		log.Println("skipping translation for:", in, "already in target language", a.TargetLanguage)
		return
	}

	r, err := a.Translate(&Request{
		SourceLanguage: in.SourceLanguage,
		TargetLanguage: a.TargetLanguage,
		Text:           in.Text(),
	})
	if err != nil {
		log.Println("translate:", err)
		return
	}
	log.Println("translated", r)

	recordTranslation(annot.Span(), &TranslationEvent{
		SourceEvent: annot.ID,
		Translation: r,
	})
}

func (a *Agent) Translate(request *Request) (*Translation, error) {
	log.Println("translating", request)
	payloadBytes, err := json.Marshal(request)
	if err != nil {
		return nil, err
	}

	resp, err := http.Post(a.Endpoint, "application/json", bytes.NewBuffer(payloadBytes))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode == http.StatusCreated || resp.StatusCode == http.StatusOK {
		response := &Translation{}
		err = json.Unmarshal(body, response)
		return response, err
	} else {
		return nil, fmt.Errorf("transcribe: %s", body)
	}
}

type Request struct {
	// doesn't seem to be used, but since it's "required", the requests will be rejected without it
	Task string `json:"task"`

	SourceLanguage string `json:"source_language,omitempty"`
	TargetLanguage string `json:"target_language,omitempty"`
	Text           string `json:"text,omitempty"`
}

type Translation struct {
	TargetLanguage string    `json:"target_language"`
	SourceLanguage string    `json:"source_language"`
	Segments       []Segment `json:"segments"`
}

func (t Translation) Text() string {
	var texts []string
	for _, seg := range t.Segments {
		texts = append(texts, seg.Text)
	}
	return strings.Join(texts, " ")
}

type Segment struct {
	Start float32 `json:"start"`
	End   float32 `json:"end"`
	Text  string  `json:"text"`
}
