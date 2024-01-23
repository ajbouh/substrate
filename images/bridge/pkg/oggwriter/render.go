package oggwriter

import (
	"bytes"

	"github.com/pion/rtp"
)

func RenderOggPackets(b *bytes.Buffer, sampleRate uint32, channelCount uint16, pkts []*rtp.Packet, sampleCounts []int) ([]byte, error) {
	b.Reset()
	var err error
	wr, err := NewWith(b, sampleRate, channelCount)
	if err != nil {
		return nil, err
	}

	// From https://datatracker.ietf.org/doc/html/rfc7845.html#page-9
	// The granule position of an audio data page is in units of PCM audio
	// samples at a fixed rate of 48 kHz (per channel; a stereo stream's
	// granule position does not increment at twice the speed of a mono
	// stream).  It is possible to run an Opus decoder at other sampling
	// rates, but all Opus packets encode samples at a sampling rate that
	// evenly divides 48 kHz.  Therefore, the value in the granule position
	// field always counts samples assuming a 48 kHz decoding rate, and the
	// rest of this specification makes the same assumption.
	sampleFactor := int(48000/sampleRate) / int(channelCount)

	if len(pkts) > 0 {
		for i, pkt := range pkts {
			err = wr.WriteRTP(pkt, sampleFactor*sampleCounts[i])
			if err != nil {
				return nil, err
			}
		}
	}

	wr.Close()

	data := b.Bytes()
	b.Reset()
	return data, nil
}
