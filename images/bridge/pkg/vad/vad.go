package vad

import (
	"context"
	"math"
	"time"

	"github.com/pion/rtp"

	logr "github.com/ajbouh/bridge/pkg/log"
	"github.com/ajbouh/bridge/pkg/router"
	"github.com/lucsky/cuid"
)

var Logger = logr.New()

type Engine struct {
	sampleRateMs  int
	pcmWindowSize int

	energyThresh  float32
	silenceThresh float32

	vadGapSamples int
	maxPendingMs  int

	pcmWindow          []float32
	packets            []*rtp.Packet
	packetSampleCounts []int
	windowID           string

	audioCh chan<- *router.CapturedAudio

	isSpeaking bool
	pendingMs  int
}

type Config struct {
	// // This is determined by the hyperparameter configuration that whisper was trained on.
	// // See more here: https://github.com/ggerganov/whisper.cpp/issues/909
	SampleRate int //   = 16000 // 16kHz
	// sampleRateMs = SampleRate / 1000
	// // This determines how much audio we will be passing to whisper inference.
	// // We will buffer up to (whisperSampleWindowMs - pcmSampleRateMs) of old audio and then add
	// // audioSampleRateMs of new audio onto the end of the buffer for inference
	SampleWindow time.Duration // = 24000 // 24 second sample window
	// windowSize     = sampleWindowMs * sampleRateMs
	// // This determines how often we will try to run inference.
	// // We will buffer (pcmSampleRateMs * whisperSampleRate / 1000) samples and then run inference
	// pcmSampleRateMs = 500 // FIXME PLEASE MAKE ME AN CONFIG PARAM
	// pcmWindowSize   = pcmSampleRateMs * sampleRateMs
}

func NewEngine(config Config, audioCh chan<- *router.CapturedAudio) *Engine {
	sampleRateMs := config.SampleRate / 1000
	pcmWindowSize := int(config.SampleWindow.Seconds() * float64(config.SampleRate))
	return &Engine{
		sampleRateMs:  sampleRateMs,
		pcmWindowSize: pcmWindowSize,
		pcmWindow:     make([]float32, 0, pcmWindowSize),
		audioCh:       audioCh,
		isSpeaking:    false,
		vadGapSamples: sampleRateMs * 700,
		pendingMs:     0,
		maxPendingMs:  500,

		// this is an arbitrary number I picked after testing a bit
		// feel free to play around
		energyThresh:  0.0005,
		silenceThresh: 0.015,
	}
}

func New(config Config) router.MiddlewareFunc {
	return func(ctx context.Context, emit router.Emitters) (router.Listeners, error) {
		e := NewEngine(config, emit.CapturedAudio)

		ch := make(chan *router.CapturedSample, 100)
		go func() {
			for s := range ch {
				e.write(s)
			}
		}()

		return router.Listeners{
			CapturedSample: ch,
		}, nil
	}
}

// writeVAD only buffers audio if somone is speaking. It will run inference after the audio transitions from
// speaking to not speaking
func (e *Engine) write(captured *router.CapturedSample) {
	pcm := captured.PCM
	endTimestamp := captured.EndTimestamp
	packet := captured.Packet

	// TODO normalize PCM and see if we can make it better
	// endTimestamp is the latest packet timestamp + len of the audio in the packet
	// FIXME make these timestamps make sense

	if e.windowID == "" {
		e.windowID = cuid.New()
	}

	if len(e.pcmWindow)+len(pcm) > e.pcmWindowSize {
		// This shouldn't happen hopefully...
		Logger.Infof("GOING TO OVERFLOW PCM WINDOW BY %d len(e.pcmWindow)=%d len(pcm)=%d e.pcmWindowSize=%d", len(e.pcmWindow)+len(pcm)-e.pcmWindowSize, len(e.pcmWindow), len(pcm), e.pcmWindowSize)
	}

	e.pcmWindow = append(e.pcmWindow, pcm...)
	e.packets = append(e.packets, packet)
	e.packetSampleCounts = append(e.packetSampleCounts, len(pcm))
	e.pendingMs += len(pcm) / e.sampleRateMs

	flushFinal := false
	if len(e.pcmWindow) >= e.pcmWindowSize {
		flushFinal = true
	}

	// only look at the last N samples (at most) of pcmWindow, flush if we see silence there
	vadGapSamples := e.vadGapSamples
	vadStartIx := len(e.pcmWindow) - vadGapSamples
	if vadStartIx < 0 {
		vadStartIx = 0
	}

	wasSpeaking := e.isSpeaking
	isSpeaking, energy, silence := VAD(e.pcmWindow[vadStartIx:], e.energyThresh, e.silenceThresh)
	if isSpeaking {
		e.isSpeaking = true
	}

	if len(e.pcmWindow) != 0 && !isSpeaking && wasSpeaking {
		flushFinal = true
	}

	if flushFinal {
		e.audioCh <- &router.CapturedAudio{
			ID:                 e.windowID,
			Final:              true,
			PCM:                append([]float32(nil), e.pcmWindow...),
			Packets:            append([]*rtp.Packet(nil), e.packets...),
			PacketSampleCounts: append([]int(nil), e.packetSampleCounts...),
			EndTimestamp:       uint64(endTimestamp),
			// HACK surely there's a better way to calculate this?
			StartTimestamp: uint64(endTimestamp) - uint64(len(e.pcmWindow)/e.sampleRateMs),
		}
		e.windowID = ""
		e.isSpeaking = false
		e.pcmWindow = e.pcmWindow[:0]
		e.packetSampleCounts = e.packetSampleCounts[:0]
		e.packets = e.packets[:0]
		e.pendingMs = 0

		_ = silence
		_ = energy
		// not speaking do nothing
		// Logger.Infof("NOT SPEAKING energy=%#v (energyThreshold=%#v) silence=%#v (silenceThreshold=%#v) endTimestamp=%d ", energy, e.energyThresh, silence, e.silenceThresh, endTimestamp)
		return
	}

	if isSpeaking && wasSpeaking {
		Logger.Info("STILL SPEAKING")
	}

	if isSpeaking && !wasSpeaking {
		Logger.Info("JUST STARTED SPEAKING")
	}

	flushDraft := false

	if e.pendingMs >= e.maxPendingMs && isSpeaking {
		flushDraft = true
	}

	if flushDraft {
		e.audioCh <- &router.CapturedAudio{
			ID:                 e.windowID,
			Final:              false,
			PCM:                append([]float32(nil), e.pcmWindow...),
			Packets:            append([]*rtp.Packet(nil), e.packets...),
			PacketSampleCounts: append([]int(nil), e.packetSampleCounts...),
			EndTimestamp:       uint64(endTimestamp),
			// HACK surely there's a better way to calculate this?
			StartTimestamp: uint64(endTimestamp) - uint64(len(e.pcmWindow)/e.sampleRateMs),
		}
		e.pendingMs = 0
	}
}

// NOTE This is a very rough implemntation. We should improve it :D
// VAD performs voice activity detection on a frame of audio data.
func VAD(frame []float32, energyThresh, silenceThresh float32) (bool, float32, float32) {
	// Compute frame energy
	energy := float32(0)
	for i := 0; i < len(frame); i++ {
		energy += frame[i] * frame[i]
	}
	energy /= float32(len(frame))

	// Compute frame silence
	silence := float32(0)
	for i := 0; i < len(frame); i++ {
		silence += float32(math.Abs(float64(frame[i])))
	}
	silence /= float32(len(frame))

	// Apply energy threshold
	if energy < energyThresh {
		return false, energy, silence
	}

	// Apply silence threshold
	if silence < silenceThresh {
		return false, energy, silence
	}

	return true, energy, silence
}
