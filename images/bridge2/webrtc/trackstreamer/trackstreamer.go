package trackstreamer

import (
	"io"
	"time"

	"github.com/gopxl/beep"
	"gopkg.in/hraban/opus.v2"

	"github.com/pion/interceptor"
	"github.com/pion/rtp"
	"github.com/pion/rtp/codecs"
	"github.com/pion/webrtc/v3/pkg/media"
	"github.com/pion/webrtc/v3/pkg/media/samplebuilder"
)

const (
	decodeBufDuration = 60 * time.Millisecond
)

type sampleDecoder interface {
	DecodeFloat32(data []byte, buf []float32) (int, error)
}

type TrackStreamer struct {
	format    beep.Format
	dec       sampleDecoder
	decodeBuf []float32
	pcm       []float32
	reader    SampleReader
}

func New(track RTPReader, format beep.Format) (beep.Streamer, error) {
	dec, err := opus.NewDecoder(format.SampleRate.N(time.Second), format.NumChannels)
	if err != nil {
		return nil, err
	}
	sampleBuffer := samplebuilder.New(20, &codecs.OpusPacket{}, uint32(format.SampleRate.N(time.Second)))
	return &TrackStreamer{
		format:    format,
		decodeBuf: make([]float32, format.NumChannels*format.SampleRate.N(decodeBufDuration)),
		dec:       dec,
		reader:    NewSampledReader(track, sampleBuffer),
	}, nil
}

var _ beep.Streamer = (*TrackStreamer)(nil)

func (*TrackStreamer) Err() error {
	return nil
}

func (t *TrackStreamer) Stream(samples [][2]float64) (n int, ok bool) {
	for i := range samples {
		samples[i], ok = t.nextPCM()
		if !ok {
			return i, false
		}
	}
	return len(samples), true
}

func (t *TrackStreamer) decodeNextPacket(buf []float32) (int, error) {
	s, err := t.reader.NextSample()
	if err != nil {
		return 0, err
	}
	return t.dec.DecodeFloat32(s.Data, buf)
}

func (t *TrackStreamer) nextPCM() (sample [2]float64, ok bool) {
	for len(t.pcm) == 0 {
		n, err := t.decodeNextPacket(t.decodeBuf)
		if err != nil {
			if err == io.EOF {
				return [2]float64{}, false
			}
			continue // if we have a bad packet, try to get another
		}
		t.pcm = t.decodeBuf[:n*t.format.NumChannels]
	}
	left := float64(t.pcm[0])
	right := left
	if t.format.NumChannels > 1 {
		right = float64(t.pcm[1])
	}
	t.pcm = t.pcm[t.format.NumChannels:]
	return [2]float64{left, right}, true
}

type RTPReader interface {
	ReadRTP() (*rtp.Packet, interceptor.Attributes, error)
}

type RTPWriter interface {
	WriteRTP(*rtp.Packet) error
}

type SampleReader interface {
	NextSample() (*media.Sample, error)
}

type sampledReader struct {
	sampler *samplebuilder.SampleBuilder
	rtp     RTPReader
}

func (r *sampledReader) NextSample() (*media.Sample, error) {
	s := r.sampler.Pop()
	for s == nil {
		pkt, _, err := r.rtp.ReadRTP()
		if err != nil {
			return nil, err
		}
		r.sampler.Push(pkt)
		s = r.sampler.Pop()
	}
	return s, nil
}

func NewSampledReader(rtp RTPReader, sampler *samplebuilder.SampleBuilder) SampleReader {
	return &sampledReader{
		sampler: sampler,
		rtp:     rtp,
	}
}

func Tee(r RTPReader, w RTPWriter) RTPReader {
	return &teeReader{r, w}
}

type teeReader struct {
	r RTPReader
	w RTPWriter
}

func (t *teeReader) ReadRTP() (pkt *rtp.Packet, attr interceptor.Attributes, err error) {
	pkt, attr, err = t.r.ReadRTP()
	if pkt != nil {
		if err := t.w.WriteRTP(pkt.Clone()); err != nil {
			return pkt, attr, err
		}
	}
	return
}
