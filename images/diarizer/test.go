package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

func fatal(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func main() {
	url := "http://localhost:8000/v1/transcribe"
	audio, err := os.ReadFile("test.ogg")
	fatal(err)
	request := &TranscriptionRequest{
		Task:      "transcribe",
		AudioData: &audio,
	}

	payloadBytes, err := json.Marshal(request)
	fatal(err)

	// Send POST request to the API
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(payloadBytes))
	fatal(err)
	defer resp.Body.Close()

	// Read the response body
	body, err := ioutil.ReadAll(resp.Body)
	fatal(err)

	// Check the response status code
	if resp.StatusCode == http.StatusCreated || resp.StatusCode == http.StatusOK {
		response := TranscriptionResponse{}
		err = json.Unmarshal(body, &response)
		fmt.Println(response)
	} else {
		fatal(fmt.Errorf("error: %s", body))
	}

}

type Word struct {
	Start       float32 `json:"start"`
	End         float32 `json:"end"`
	Word        string  `json:"word"`
	Probability float32 `json:"prob"`
}

type TranscriptionSegment struct {
	ID               uint32  `json:"id"`
	Seek             uint32  `json:"seek"`
	Start            float32 `json:"start"`
	End              float32 `json:"end"`
	Text             string  `json:"text"`
	Temperature      float32 `json:"temperature"`
	AvgLogprob       float32 `json:"avg_logprob"`
	CompressionRatio float32 `json:"compression_ratio"`
	NoSpeechProb     float32 `json:"no_speech_prob"`
	Words            []Word  `json:"words"`

	Speaker     string `json:"speaker"`
	IsAssistant bool   `json:"is_assistant"`
}

type TranscriptionRequest struct {
	AudioData *[]byte `json:"audio_data,omitempty"`
	Text      *string `json:"text,omitempty"`

	Task           string  `json:"task"`
	SourceLanguage *string `json:"source_language,omitempty"`
	TargetLanguage *string `json:"target_language,omitempty"`

	Segments *[]TranscriptionSegment `json:"segments,omitempty"`
}

type TranscriptionResponse struct {
	TargetLanguage            string              `json:"target_language"`
	SourceLanguage            string              `json:"source_language"`
	SourceLanguageProbability float32             `json:"source_language_prob"`
	Duration                  float32             `json:"duration"`
	AllLanguageProbs          *map[string]float32 `json:"all_language_probs,omitempty"`

	Segments []TranscriptionSegment `json:"segments"`
}
