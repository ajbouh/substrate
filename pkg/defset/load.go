package defset

import (
	"context"
	"errors"
	"fmt"
	"log"
	"strings"
	"sync"
	"time"

	"cuelang.org/go/cue"
	"cuelang.org/go/cue/build"
	cueerrors "cuelang.org/go/cue/errors"
	"cuelang.org/go/cue/load"
	"github.com/fsnotify/fsnotify"

	"github.com/ajbouh/substrate/pkg/activityspec"
	"github.com/ajbouh/substrate/pkg/blackboard"
	"github.com/ajbouh/substrate/pkg/substratefs"
)

type CueLoad struct {
	LoadStart    time.Time
	LoadEnd      time.Time
	LoadInstance build.Instance

	BuildStart time.Time
	BuildEnd   time.Time
	BuildValue cue.Value

	TransformStart time.Time
	TransformEnd   time.Time
	Value          cue.Value
	Err            error
}

type CueLoader func(mu *sync.Mutex, cc *cue.Context) *CueLoad

type CueTransform func(v cue.Value) cue.Value

func NewCueLoader(config *load.Config, arg string, transforms ...CueTransform) CueLoader {
	return func(mu *sync.Mutex, cc *cue.Context) *CueLoad {
		l := &CueLoad{}
		fmt.Println("LoadStart")
		l.LoadStart = time.Now()
		instance := load.Instances([]string{arg}, config)[0]
		l.LoadEnd = time.Now()
		fmt.Println("LoadEnd")
		if err := instance.Err; err != nil {
			l.Err = errors.Join(l.Err, instance.Err)
			return l
		}
		if l.Err != nil {
			return l
		}

		if mu != nil {
			mu.Lock()
			defer mu.Unlock()
		}
		fmt.Println("BuildStart")
		l.BuildStart = time.Now()
		l.BuildValue = cc.BuildInstance(instance)
		l.BuildEnd = time.Now()
		fmt.Println("BuildEnd")

		if l.BuildValue.Err() != nil {
			fmt.Println("BuildErr")
			l.Err = l.BuildValue.Err()
			return l
		}

		l.Value = l.BuildValue
		fmt.Println("TransformStart")
		l.TransformStart = time.Now()
		for _, transform := range transforms {
			// fmt.Println("->", l.Value)
			l.Value = transform(l.Value)
			if l.Value.Err() != nil {
				fmt.Println("TransformErr")
				l.Err = l.Value.Err()
				return l
			}
		}
		// fmt.Println("->", l.Value)
		l.TransformEnd = time.Now()
		fmt.Println("TransformEnd")

		return l
	}
}

func NewCueWatcher(ctx context.Context, config *load.Config, cb func(err error)) error {
	watcher, err := NewWatcher(ctx, cb)
	if err != nil {
		return err
	}
	watcher.Add(config.Dir)

	return nil
}

func NewWatcher(ctx context.Context, cb func(err error)) (*fsnotify.Watcher, error) {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		fmt.Printf("WARN: error starting fsnotify, live editing disabled!\n")
		return nil, err
	}

	debounceInterval := 100 * time.Millisecond
	go func() {
		defer log.Println("done watching")
		debounce := time.NewTimer(debounceInterval)
		for {
			select {
			case event, ok := <-watcher.Events:
				if !ok {
					return
				}
				log.Println("event: ", event)
				debounce.Reset(debounceInterval)
			case <-debounce.C:
				log.Println("debounced")
				cb(nil)
			case err, ok := <-watcher.Errors:
				if !ok {
					return
				}
				log.Println("error: ", err)
				cb(err)
			}
		}
	}()

	go func() {
		defer log.Println("closing watcher")
		defer watcher.Close()
		<-ctx.Done()
	}()

	return watcher, nil
}

func LookupPathTransform(p cue.Path) CueTransform {
	return func(v cue.Value) cue.Value {
		return v.LookupPath(p)
	}
}

func FillPathCompileTransform(p cue.Path, s string) CueTransform {
	return func(v cue.Value) cue.Value {
		cc := v.Context()
		return v.FillPath(p, cc.CompileString(s))
	}
}

func FillPathEncodeTransform(p cue.Path, o any) CueTransform {
	return func(v cue.Value) cue.Value {
		cc := v.Context()
		return v.FillPath(p, cc.Encode(o))
	}
}

type DefSetLoader func(
	cueMu *sync.Mutex,
	cc *cue.Context,
	pc *activityspec.ProvisionerCache,
	layout *substratefs.Layout,
) *DefSet

func NewDefLoader(cueLoader CueLoader) DefSetLoader {
	return func(
		cueMu *sync.Mutex,
		cc *cue.Context,
		pc *activityspec.ProvisionerCache,
		layout *substratefs.Layout,
	) *DefSet {
		load := cueLoader(cueMu, cc)

		sds := &DefSet{
			Blackboard: blackboard.New(cc, cueMu),
			Services:   map[string]cue.Value{},
			CueMu:      cueMu,
			CueContext: cc,
			Layout:     layout,
		}
		if load.Err != nil {
			sds.Err = fmt.Errorf("error loading cue defs: %w", load.Err)
			return sds
		}

		value := load.Value

		sds.CueMu.Lock()
		defer sds.CueMu.Unlock()

		err := value.Validate()
		if err != nil {
			sds.Err = fmt.Errorf("error validating cue defs: %w", err)
			return sds
		}

		ctx := context.Background()

		fields, err := value.Fields()
		if err != nil {
			sds.Err = fmt.Errorf("error decoding service fields: %w", err)
			return sds
		}

		for fields.Next() {
			sel := fields.Selector()
			if !sel.IsString() {
				continue
			}
			serviceName := sel.Unquoted()
			serviceDef := fields.Value()

			err := serviceDef.Validate()
			if err != nil {
				errs := cueerrors.Errors(err)
				messages := make([]string, 0, len(errs))
				for _, err := range errs {
					messages = append(messages, err.Error())
				}
				log.Printf("service definition error: %s", strings.Join(messages, "\n"))
			}
			fmt.Println("found service", serviceName, "->", serviceDef)
			sds.Services[serviceName] = serviceDef

			callDefs, err := serviceDef.LookupPath(cue.MakePath(cue.Str("calls"))).List()
			if err != nil {
				continue
			}
			for callDefs.Next() {
				callDef := callDefs.Value()
				sds.Blackboard.Offer(ctx, blackboard.Input{Value: callDef}, activityspec.ServiceDefRefinement(pc, serviceName, serviceDef, callDef))
			}
		}

		return sds
	}
}
