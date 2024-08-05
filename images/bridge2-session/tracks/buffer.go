package tracks

import (
	"sync"

	"github.com/gopxl/beep"
)

type continuousBuffer struct {
	mu    sync.Mutex
	cond  sync.Cond
	audio *beep.Buffer
}

func newContinuousBuffer(format beep.Format) *continuousBuffer {
	b := &continuousBuffer{audio: beep.NewBuffer(format)}
	b.cond.L = &b.mu
	return b
}

func (b *continuousBuffer) Format() beep.Format {
	return b.audio.Format()
}

func (b *continuousBuffer) Append(s beep.Streamer) {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.audio.Append(s)
	b.cond.Broadcast()
}

func (b *continuousBuffer) Len() int {
	b.mu.Lock()
	defer b.mu.Unlock()
	return b.audio.Len()
}

func (b *continuousBuffer) StreamerFrom(start int) beep.Streamer {
	return beep.Iterate(func() beep.Streamer {
		b.mu.Lock()
		defer b.mu.Unlock()
		for {
			end := b.audio.Len()
			if end > start {
				stream := b.audio.Streamer(start, end)
				start = end
				return stream
			}
			b.cond.Wait()
		}
	})
}
