package commands

import (
	"context"
	"errors"
	"log/slog"
	"strconv"
	"sync"
)

type CapSeq struct {
}

type CapSeqStepBreak struct {
	And []DataPointer `json:"and"`
	Out Bindings      `json:"out"`
}

type CapSeqStep struct {
	Par   map[string]Fields `json:"par"`
	Break []CapSeqStepBreak `json:"break"`

	Out Bindings `json:"out"`
}

var _ Cap = (*CapSeq)(nil)

func mapReduce[K comparable, P any, R any](
	m map[K]P,
	mapper func(k K, p P) (R, error),
	reducer func(k K, p P, r R, err error),
) {
	if len(m) == 0 {
		return
	}

	var wg sync.WaitGroup
	wg.Add(len(m))

	for k, p := range m {
		go func(k K, p P) {
			defer wg.Done()
			r, err := mapper(k, p)
			reducer(k, p, r, err)
		}(k, p)
	}

	wg.Wait()
}

func (a *CapSeq) Apply(env Env, d Fields) (Fields, error) {
	slog.Info("CapSeq.Apply", "d", d)
	var i int
	var iStr string

	slog.Info("CapSeq.Apply LenGetPath", "LenGetPath", LenGetPath(d, "seq"))
	for i < LenGetPath(d, "seq") {
		slog.Info("CapSeq.Apply LenGetPath", "i", i, "LenGetPath", LenGetPath(d, "seq"))
		iStr = strconv.Itoa(i)

		stepFields, err := GetPath[Fields](d, "seq", iStr)
		if err != nil {
			return nil, err
		}

		batchPre, err := GetPath[Bindings](stepFields, "pre")
		if err != nil {
			return nil, err
		}

		stepFields, err = batchPre.PluckInto(stepFields, d)
		if err != nil {
			return nil, err
		}

		d, err = SetPath(d, []string{"seq", iStr}, stepFields)
		if err != nil {
			return nil, err
		}

		step, err := As[CapSeqStep](stepFields)
		if err != nil {
			return nil, err
		}

		// TODO support timeout
		stepCtx, cancel := context.WithCancel(env.Context())

		var stepErrs []error
		var mu sync.Mutex
		var didBreak bool
		mapReduce(step.Par,
			func(k string, p Fields) (Fields, error) {
				p, err := p.Clone()
				if err != nil {
					return p, err
				}
				return env.New(stepCtx, nil).Apply(nil, p)
			},
			func(k string, p Fields, ret Fields, err error) {
				slog.Info("mapReduce", "k", k, "p", p, "ret", ret, "err", err)
				mu.Lock()
				defer mu.Unlock()

				if err != nil {
					stepErrs = append(stepErrs, err)
					return
				}

				stepFields, err = SetPath(stepFields, []string{"par", k}, ret)
				if err != nil {
					stepErrs = append(stepErrs, err)
					return
				}

				for _, b := range step.Break {
					for _, probe := range b.And {
						maybe, ok, err := MaybeGet[any](stepFields, probe)
						if err != nil {
							stepErrs = append(stepErrs, err)
							continue
						}
						if !ok || (maybe != nil && maybe != false) {
							continue
						}

						d, err = b.Out.PluckInto(d, stepFields)
						if err != nil {
							stepErrs = append(stepErrs, err)
							return
						}

						cancel()
						didBreak = true
						break
					}
				}
			},
		)

		if !didBreak {
			err = errors.Join(stepErrs...)
			if err != nil {
				return nil, err
			}
		}

		d, err = step.Out.PluckInto(d, stepFields)
		if err != nil {
			return nil, err
		}

		i++
	}

	ret, err := GetPath[Bindings](d, "ret")
	if err != nil {
		return nil, err
	}
	if len(ret) > 0 {
		return ret.PluckInto(Fields{}, d)
	}

	return GetPath[Fields](d, "seq", iStr)
}
