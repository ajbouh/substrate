package commands

import (
	"context"
	"errors"
	"strconv"
	"sync"
)

type CapSeq struct {
}

type MsgsBatchBreak struct {
	And []DataPointer `json:"and"`
	Out Bindings      `json:"out"`
}

type MsgsBatch struct {
	Msgs  map[string]Fields `json:"msgs"`
	Break []MsgsBatchBreak  `json:"break"`

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
	var i int
	var iStr string
	for i < LenGetPath(d, "seq") {
		iStr = strconv.Itoa(i)

		batchPre, err := GetPath[Bindings](d, "seq", iStr, "pre")
		if err != nil {
			return nil, err
		}

		stepFields, err := GetPath[Fields](d, "seq", iStr)
		if err != nil {
			return nil, err
		}

		stepFields, err = batchPre.PluckInto(stepFields, d)
		if err != nil {
			return nil, err
		}

		err = SetPath(d, []string{"seq", iStr}, stepFields)
		if err != nil {
			return nil, err
		}

		batch, err := As[MsgsBatch](stepFields)
		if err != nil {
			return nil, err
		}

		// TODO support timeout
		batchCtx, cancel := context.WithCancel(env.Context())

		var batchErrs []error
		var mu sync.Mutex
		var didBreak bool
		mapReduce(batch.Msgs,
			func(k string, p Fields) (Fields, error) {
				return env.New(batchCtx, nil).Apply(nil, p)
			},
			func(k string, pre Fields, ret Fields, err error) {
				mu.Lock()
				defer mu.Unlock()

				if err != nil {
					batchErrs = append(batchErrs, err)
					return
				}

				err = SetPath(stepFields, []string{"par", k}, ret)
				if err != nil {
					batchErrs = append(batchErrs, err)
					return
				}

				for _, b := range batch.Break {
					for _, probe := range b.And {
						maybe, ok, err := MaybeGet[any](stepFields, probe)
						if err != nil {
							batchErrs = append(batchErrs, err)
							continue
						}
						if !ok || (maybe != nil && maybe != false) {
							continue
						}

						d, err = b.Out.PluckInto(d, stepFields)
						if err != nil {
							batchErrs = append(batchErrs, err)
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
			err = errors.Join(batchErrs...)
			if err != nil {
				return nil, err
			}
		}

		stepFields, err = batch.Out.PluckInto(Fields{}, stepFields)
		if err != nil {
			return nil, err
		}

		err = SetPath(d, []string{"seq", iStr}, stepFields)
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
