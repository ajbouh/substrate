package audio

import "github.com/gopxl/beep"

type Float32Stream struct {
	Samples []float32
	cur     int
}

func (s *Float32Stream) Stream(samples [][2]float64) (n int, ok bool) {
	for i := range samples {
		if s.cur >= len(s.Samples) {
			return i, false
		}
		sample := float64(s.Samples[s.cur])
		samples[i][0], samples[i][1] = sample, sample
		s.cur++
	}
	return len(samples), true
}

func (s *Float32Stream) Err() error {
	return nil
}

func Stream(streamer beep.Streamer, numSamples int) ([]float32, error) {
	buffer := make([][2]float64, numSamples)
	n, ok := streamer.Stream(buffer)
	if !ok && n == 0 {
		return nil, streamer.Err()
	}

	samples := make([]float32, n)
	for i := 0; i < n; i++ {
		samples[i] = float32((buffer[i][0] + buffer[i][1]) / 2)
	}

	return samples, nil
}

func StreamAll(streamer beep.Streamer) ([]float32, error) {
	var allSamples []float32

	for {
		buffer := make([][2]float64, 1024) // Buffer size can be adjusted
		n, ok := streamer.Stream(buffer)
		if !ok {
			if err := streamer.Err(); err != nil {
				return nil, err
			}
			if n == 0 {
				break
			}
		}

		for i := 0; i < n; i++ {
			allSamples = append(allSamples, float32((buffer[i][0]+buffer[i][1])/2))
		}
	}

	return allSamples, nil
}

func NewBufferFromSamples(format beep.Format, samples []float32) *beep.Buffer {
	buf := beep.NewBuffer(format)
	buf.Append(&Float32Stream{Samples: samples})
	return buf
}
