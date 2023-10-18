package vad

import (
	"context"
	"math"
	"time"

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

	pcmWindow []float32
	windowID  string

	counter int

	audioCh chan<- *router.CapturedAudio

	isSpeaking bool
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
	pcmWindowSize := int(config.SampleWindow.Seconds() * float64(sampleRateMs))
	return &Engine{
		sampleRateMs:  sampleRateMs,
		pcmWindowSize: pcmWindowSize,
		pcmWindow:     make([]float32, 0, pcmWindowSize),
		audioCh:       audioCh,
		isSpeaking:    false,

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
				e.write(s.PCM, s.EndTimestamp)
			}
		}()

		return router.Listeners{
			CapturedSample: ch,
		}, nil
	}
}

// XXX DANGER XXX
// This is highly experiemential and will probably crash in very interesting ways. I have deadlines
// and am hacking towards what I want to demo. Use at your own risk :D
// XXX DANGER XXX
//
// writeVAD only buffers audio if somone is speaking. It will run inference after the audio transitions from
// speaking to not speaking
func (e *Engine) write(pcm []float32, endTimestamp uint32) {
	// TODO normalize PCM and see if we can make it better
	// endTimestamp is the latest packet timestamp + len of the audio in the packet
	// FIXME make these timestamps make sense

	if e.windowID == "" {
		e.windowID = cuid.New()
	}

	if len(e.pcmWindow)+len(pcm) > e.pcmWindowSize {
		// This shouldn't happen hopefully...
		Logger.Infof("GOING TO OVERFLOW PCM WINDOW BY %d", len(e.pcmWindow)+len(pcm)-e.pcmWindowSize)
	}
	e.pcmWindow = append(e.pcmWindow, pcm...)

	forceFlush := false
	if len(e.pcmWindow) >= e.pcmWindowSize {
		forceFlush = true
	}

	isSpeaking, energy, silence := VAD(e.pcmWindow, e.energyThresh, e.silenceThresh)

	defer func() {
		e.isSpeaking = isSpeaking
	}()

	if !isSpeaking && !e.isSpeaking || forceFlush {
		// by having this here it gives us a bit of an opportunity to pause in our speech
		if len(e.pcmWindow) != 0 {
			e.audioCh <- &router.CapturedAudio{
				ID:           e.windowID,
				Final:        true,
				PCM:          append([]float32(nil), e.pcmWindow...),
				EndTimestamp: uint64(endTimestamp),
				// HACK surely there's a better way to calculate this?
				StartTimestamp: uint64(endTimestamp) - uint64(len(e.pcmWindow)/e.sampleRateMs),
			}
			e.windowID = ""
			e.counter = 0

			e.pcmWindow = e.pcmWindow[:0]
		}

		_ = silence
		_ = energy
		// not speaking do nothing
		// Logger.Infof("NOT SPEAKING energy=%#v (energyThreshold=%#v) silence=%#v (silenceThreshold=%#v) endTimestamp=%d ", energy, e.energyThresh, silence, e.silenceThresh, endTimestamp)
		return
	}

	if isSpeaking && e.isSpeaking {
		Logger.Info("STILL SPEAKING")
		// add to buffer and wait
		// FIXME make sure we have space
	}

	if isSpeaking && !e.isSpeaking {
		Logger.Info("JUST STARTED SPEAKING")
		e.isSpeaking = isSpeaking
		// we just started speaking, add to buffer and wait
		// FIXME make sure we have space
	}

	if !isSpeaking && e.isSpeaking {
		Logger.Info("JUST STOPPED SPEAKING")
		// TODO consider waiting for a few more samples?
	}

	if e.counter%3 == 0 {
		e.audioCh <- &router.CapturedAudio{
			ID:           e.windowID,
			Final:        false,
			PCM:          append([]float32(nil), e.pcmWindow...),
			EndTimestamp: uint64(endTimestamp),
			// HACK surely there's a better way to calculate this?
			StartTimestamp: uint64(endTimestamp) - uint64(len(e.pcmWindow)/e.sampleRateMs),
		}
	}
	e.counter++
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
