package commands

import (
	"context"
	"errors"
	"strconv"
	"sync"
)

type CapSeq struct {
}

type CapSeqStepBreak struct {
	And []DataPointer `json:"and"`
	Out Bindings      `json:"out"`
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
	var i int
	var iStr string

	for i < LenGetPath(d, "seq") {
		iStr = strconv.Itoa(i)

		stepFields, err := GetPath[Fields](d, "seq", iStr)
		if err != nil {
			return nil, err
		}

		batchPre, _, err := MaybeGetPath[Bindings](stepFields, "pre")
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

		par, err := GetPath[map[string]Fields](d, "seq", iStr, "par")
		if err != nil {
			return nil, err
		}

		// TODO support timeout
		stepCtx, cancel := context.WithCancel(env.Context())

		var stepErrs []error
		var mu sync.Mutex
		var didBreak bool
		mapReduce(par,
			func(k string, p Fields) (Fields, error) {
				p, err := p.Clone()
				if err != nil {
					return p, err
				}
				return env.New(stepCtx, nil).Apply(nil, p)
			},
			func(k string, p Fields, ret Fields, err error) {
				mu.Lock()
				defer mu.Unlock()

				if err != nil {
					stepErrs = append(stepErrs, err)
					return
				}

				parFields, err := GetPath[Fields](stepFields, "par")
				if err != nil {
					stepErrs = append(stepErrs, err)
					return
				}

				parFields[k] = ret
				stepFields["par"] = parFields

				brk, _, err := MaybeGetPath[[]CapSeqStepBreak](d, "seq", iStr, "break")
				if err != nil {
					stepErrs = append(stepErrs, err)
					return
				}

				for _, b := range brk {
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

		out, _, err := MaybeGetPath[Bindings](d, "seq", iStr, "out")
		if err != nil {
			return nil, err
		}

		d, err = out.PluckInto(d, stepFields)
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
		d, err = ret.PluckInto(Fields{}, d)
	} else {
		d, err = GetPath[Fields](d, "seq", iStr)
	}

	return d, err
}
