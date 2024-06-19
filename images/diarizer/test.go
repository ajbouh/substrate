package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
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
	url := "http://localhost:8000/v1/diarize"
	audio, err := os.ReadFile("test.ogg")
	fatal(err)
	request := &DiarizeRequest{
		AudioData: &audio,
	}

	payloadBytes, err := json.Marshal(request)
	fatal(err)

	// Send POST request to the API
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(payloadBytes))
	fatal(err)
	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	fatal(err)
	log.Println(string(body))

	// Check the response status code
	if resp.StatusCode == http.StatusCreated || resp.StatusCode == http.StatusOK {
		response := DiarizeResponse{}
		err = json.Unmarshal(body, &response)
		fatal(err)
		fmt.Println(response)
	} else {
		fatal(fmt.Errorf("error: %s", body))
	}

}

type Timespan struct {
	Start   float32 `json:"start"`
	End     float32 `json:"end"`
	Speaker string  `json:"speaker"`
}

type DiarizeRequest struct {
	AudioData *[]byte `json:"audio_data,omitempty"`
}

type DiarizeResponse struct {
	Timespans []Timespan `json:"timespans"`
}
