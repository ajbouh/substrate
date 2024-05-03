package sys

import (
	"context"
	"os"
	"time"

	"github.com/ajbouh/substrate/images/sys/sysfs"
)

var sysfsd string = "/sys"

func SetSysfsd(s string) {
	sysfsd = s
}

type Sample struct {
	MachineID            string `json:"machine_id"`
	StartMicros          int64  `json:"start_us"`
	SampleDurationMicros int64  `json:"sample_duration_us"`

	Errors []string `json:"errors,omitempty"`

	Root *sysfs.Root `json:"root"`
}

type Sampler struct {
	MachineID string
}

func (s *Sampler) Exports(ctx context.Context) (any, error) {
	return map[string]any{"data": s.Get()}, nil
}

func (s *Sampler) Get() *Sample {
	start := time.Now().UTC()

	sample := &Sample{
		MachineID:   os.Getenv("SUBSTRATE_MACHINE_ID"),
		StartMicros: start.UnixMicro(),
	}

	var errs []error
	var err error

	r := sysfs.Root{}
	err = r.Read(os.DirFS(sysfsd))
	if err != nil {
		errs = append(errs, err)
	} else {
		sample.Root = &r
	}

	if len(errs) != 0 {
		sample.Errors = make([]string, 0, len(errs))
		for _, err := range errs {
			sample.Errors = append(sample.Errors, err.Error())
		}
	}

	sample.SampleDurationMicros = time.Now().UTC().Sub(start).Microseconds()

	return sample
}
