package audio

import (
	"errors"
	"fmt"
	"io"

	"github.com/go-audio/audio"
	"github.com/go-audio/wav"
)

func float32ToInt16(f []float32) []int {
	int16Data := make([]int, len(f))
	for i, v := range f {
		if v < -1 {
			v = -1
		} else if v > 1 {
			v = 1
		}
		int16Data[i] = int(v * 32767)
	}
	return int16Data
}

func ToWav(pcmData []float32, sampleRate int) ([]byte, error) {

	int16PCMData := float32ToInt16(pcmData)

	out := NewByteSliceWriteSeeker(1024)

	// Create a new encoder
	enc := wav.NewEncoder(out, sampleRate, 16, 1, 1)

	// Convert int16 PCM data to an audio.IntBuffer
	buf := &audio.IntBuffer{Data: int16PCMData, Format: &audio.Format{SampleRate: sampleRate, NumChannels: 1}}

	// Write the buffer to the encoder
	if err := enc.Write(buf); err != nil {
		return nil, fmt.Errorf("Error writing to WAV file: %v", err)
	}

	// Close the encoder to flush any remaining data
	if err := enc.Close(); err != nil {
		return nil, fmt.Errorf("Error closing WAV file: %v", err)
	}

	return out.Bytes(), nil
}

type ByteSliceWriteSeeker struct {
	data   []byte
	offset int64
}

func NewByteSliceWriteSeeker(initialSize int64) *ByteSliceWriteSeeker {
	return &ByteSliceWriteSeeker{
		data:   make([]byte, 0, initialSize),
		offset: 0,
	}
}

func (b *ByteSliceWriteSeeker) Write(p []byte) (n int, err error) {
	// Grow the buffer if necessary
	endPos := b.offset + int64(len(p))
	if endPos > int64(cap(b.data)) {
		// Double it until it's large enough.
		newSize := cap(b.data)
		for endPos > int64(newSize) {
			newSize *= 2
		}
		newData := make([]byte, len(b.data), newSize)
		copy(newData, b.data)
		b.data = newData
	}
	if endPos > int64(len(b.data)) {
		b.data = b.data[:endPos]
	}

	// Copy data into the buffer at the current offset
	copy(b.data[b.offset:], p)
	b.offset += int64(len(p))
	return len(p), nil
}

func (b *ByteSliceWriteSeeker) Seek(offset int64, whence int) (int64, error) {
	var newOffset int64
	switch whence {
	case io.SeekStart:
		newOffset = offset
	case io.SeekCurrent:
		newOffset = b.offset + offset
	case io.SeekEnd:
		newOffset = int64(len(b.data)) + offset
	default:
		return 0, errors.New("ByteSliceWriteSeeker.Seek: invalid whence")
	}

	if newOffset < 0 {
		return 0, errors.New("ByteSliceWriteSeeker.Seek: negative position")
	}

	b.offset = newOffset
	return newOffset, nil
}

func (b *ByteSliceWriteSeeker) Bytes() []byte {
	return b.data
}
