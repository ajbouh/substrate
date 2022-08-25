package router

import (
	"github.com/pion/rtp"
)

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

type CapturedSample struct {
	PCM          []float32
	EndTimestamp uint32
	Packet       *rtp.Packet
}

type CapturedAudio struct {
	ID string `json:"id"`

	PCM                []float32     `json:"-"`
	Packets            []*rtp.Packet `json:"-"`
	PacketSampleCounts []int         `json:"-"`

	Final bool `json:"final"`

	StartTimestamp uint64 `json:"start"`
	EndTimestamp   uint64 `json:"end"`
}

type Transcription struct {
	ID string `json:"id"`

	AudioSources []*CapturedAudio `json:"audio"`

	Final bool `json:"final"`

	StartTimestamp uint64 `json:"start"`
	EndTimestamp   uint64 `json:"end"`

	TranscriptSources []*Transcription `json:"-"`

	Language            string              `json:"language"`
	LanguageProbability float32             `json:"language_prob"`
	Duration            float32             `json:"duration"`
	AllLanguageProbs    *map[string]float32 `json:"all_language_probs,omitempty"`

	Segments []TranscriptionSegment `json:"segments"`
}
