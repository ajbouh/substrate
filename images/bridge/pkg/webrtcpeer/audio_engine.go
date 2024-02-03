package webrtcpeer

import (
	"math"
	"sync/atomic"
	"time"

	"github.com/ajbouh/substrate/images/bridge/pkg/router"
	"github.com/ajbouh/substrate/images/bridge/pkg/webrtcpeer/internal"

	"github.com/pion/rtp"
	"github.com/pion/webrtc/v3/pkg/media"
)

const (
	sampleRate          = 16000 // asr.SampleRate // (16000)
	incomingChannels    = 1     // decode into 1 channel since that is what whisper.cpp wants
	outgoingChannels    = 2     // we use 2 outgoingChannels for the output
	outgoingFrameSizeMs = 20
	incomingFrameSizeMs = 60
)

var outgoingFrameSize = outgoingChannels * outgoingFrameSizeMs * sampleRate / 1000
var incomingFrameSize = incomingChannels * incomingFrameSizeMs * sampleRate / 1000

// AudioEngine is used to convert RTP Opus packets to raw PCM audio to be sent to Whisper
// and to convert raw PCM audio from Coqui back to RTP Opus packets to be sent back over WebRTC
type AudioEngine struct {
	// RTP Opus packets to be converted to PCM
	rtpIn chan *rtp.Packet
	// RTP Opus packets converted from PCM to be sent over WebRTC
	mediaOut chan media.Sample

	dec *internal.OpusDecoder
	enc *internal.OpusEncoder

	// slice to hold raw pcm data during decoding
	incomingPCM []float32

	firstTimeStamp  uint32
	latestTimeStamp uint32
	capture         chan<- *router.CapturedSample

	// shouldInfer determines if we should run TTS inference or not
	shouldInfer atomic.Bool
}

func NewAudioEngine(capture chan<- *router.CapturedSample) (*AudioEngine, error) {
	dec, err := internal.NewOpusDecoder(sampleRate, incomingChannels)
	if err != nil {
		return nil, err
	}

	enc, err := internal.NewOpusEncoder(outgoingChannels, outgoingFrameSizeMs)
	if err != nil {
		return nil, err
	}

	var shouldInfer atomic.Bool
	shouldInfer.Store(true)

	ae := &AudioEngine{
		rtpIn:          make(chan *rtp.Packet),
		mediaOut:       make(chan media.Sample),
		incomingPCM:    make([]float32, incomingFrameSize),
		dec:            dec,
		enc:            enc,
		capture:        capture,
		firstTimeStamp: 0,
		shouldInfer:    shouldInfer,
	}

	return ae, nil
}

func (a *AudioEngine) RtpIn() chan<- *rtp.Packet {
	return a.rtpIn
}

func (a *AudioEngine) MediaOut() <-chan media.Sample {
	return a.mediaOut
}

func (a *AudioEngine) Start() {
	Logger.Info("Starting audio engine")
	go a.decode()
}

// Encode takes in raw f32le pcm, encodes it into opus RTP packets and sends those over the rtpOut chan
func (a *AudioEngine) Encode(pcm []float32, inputChannelCount, inputSampleRate int) error {
	opusFrames, err := a.enc.Encode(pcm, inputChannelCount, inputSampleRate)
	if err != nil {
		Logger.Error(err, "error encoding pcm")
	}

	go a.sendMedia(opusFrames)

	return nil
}

// sendMedia turns opus frames into media samples and sends them on the channel
func (a *AudioEngine) sendMedia(frames []internal.OpusFrame) {
	for _, f := range frames {
		sample := convertOpusToSample(f)
		a.mediaOut <- sample
		// this is important to properly pace the samples
		time.Sleep(time.Millisecond * outgoingFrameSizeMs)
	}

	// start inferring audio again
	// a.Unpause()
}

func convertOpusToSample(frame internal.OpusFrame) media.Sample {
	return media.Sample{
		Data:               frame.Data,
		PrevDroppedPackets: 0, // FIXME support dropping packets
		Duration:           time.Millisecond * outgoingFrameSizeMs,
	}
}

// decode reads over the in channel in a loop, decodes the RTP packets to raw PCM and sends the data on another channel
func (a *AudioEngine) decode() {
	for {
		pkt, ok := <-a.rtpIn
		if !ok {
			Logger.Info("rtpIn channel closed...")
			return
		}
		if !a.shouldInfer.Load() {
			continue
		}
		if a.firstTimeStamp == 0 {
			Logger.Debug("Resetting timestamp bc firstTimeStamp is 0...  ", pkt.Timestamp)
			a.firstTimeStamp = pkt.Timestamp
		}

		if pkt.Timestamp < a.latestTimeStamp {
			Logger.Debug("Out of order packet!", pkt.Timestamp, "<", a.latestTimeStamp)
			a.latestTimeStamp = pkt.Timestamp
		} else {
			a.latestTimeStamp = pkt.Timestamp
		}

		if _, err := a.decodePacket(pkt); err != nil {
			Logger.Error(err, "error decoding opus packet ")
		}
	}
}

func (a *AudioEngine) decodePacket(pkt *rtp.Packet) (int, error) {
	incomingSamplesPerChannel, err := a.dec.Decode(pkt.Payload, a.incomingPCM)
	// we decode to float32 here since that is what whisper.cpp takes
	if err != nil {
		Logger.Error(err, "error decoding fb packet")
		return 0, err
	} else {
		timestampMS := (pkt.Timestamp - a.firstTimeStamp) / ((sampleRate / 1000) * 3)
		lengthOfRecordingMs := uint32(incomingSamplesPerChannel / (sampleRate / 1000))
		timestampRecordingEnds := timestampMS + lengthOfRecordingMs
		incomingPCM := a.incomingPCM[:incomingSamplesPerChannel*incomingChannels]

		a.capture <- &router.CapturedSample{
			PCM:          incomingPCM,
			EndTimestamp: timestampRecordingEnds,
			Packet:       pkt,
		}
		return incomingSamplesPerChannel, nil
	}
}

// This function converts f32le to s16le bytes for writing to a file
func convertToBytes(in []float32, out []byte) int {
	currIndex := 0
	for i := range in {
		res := int16(math.Floor(float64(in[i] * 32767)))

		out[currIndex] = byte(res & 0b11111111)
		currIndex++

		out[currIndex] = (byte(res >> 8))
		currIndex++
	}
	return currIndex
}
