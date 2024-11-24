package cueloader

import (
	"context"
	"errors"
	"log"
	"log/slog"
	"os"
	"path/filepath"
	"time"

	"cuelang.org/go/cue"
	"cuelang.org/go/cue/build"
	"cuelang.org/go/cue/load"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
	"github.com/fsnotify/fsnotify"
)

type Load struct {
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

type Lock interface {
	Lock()
	Unlock()
}

type Loader struct {
	arg        string
	transforms []Transform
}

type Transform func(v cue.Value) cue.Value

func NewCueLoader(arg string, transforms ...Transform) *Loader {
	return &Loader{
		arg:        arg,
		transforms: transforms,
	}
}

func (r *Loader) LoadCue(cueMu Lock, cc *cue.Context, config *load.Config) *Load {
	l := &Load{}
	// log.Println("LoadStart")
	l.LoadStart = time.Now()
	instance := load.Instances([]string{r.arg}, config)[0]
	l.LoadEnd = time.Now()
	// log.Println("LoadEnd")
	if err := instance.Err; err != nil {
		l.Err = errors.Join(l.Err, instance.Err)
		return l
	}
	if l.Err != nil {
		return l
	}

	if cueMu != nil {
		cueMu.Lock()
		defer cueMu.Unlock()
	}
	// log.Println("BuildStart")
	l.BuildStart = time.Now()
	l.BuildValue = cc.BuildInstance(instance)
	l.Value = l.BuildValue
	l.BuildEnd = time.Now()
	// log.Println("BuildEnd")

	if l.BuildValue.Err() != nil {
		// log.Println("BuildErr")
		l.Err = l.BuildValue.Err()
		return l
	}

	// log.Println("TransformStart")
	l.TransformStart = time.Now()
	for _, transform := range r.transforms {
		// log.Println("->", l.Value)
		l.Value = transform(l.Value)
		if l.Value.Err() != nil {
			log.Println("TransformErr")
			l.Err = l.Value.Err()
			return l
		}
	}
	// log.Println("->", l.Value)
	l.TransformEnd = time.Now()
	// log.Println("TransformEnd")

	log.Printf("load=%s build=%s transform=%s", l.LoadEnd.Sub(l.LoadStart), l.BuildEnd.Sub(l.BuildStart), l.TransformEnd.Sub(l.TransformStart))

	return l
}

type CueModuleChanged struct {
	Error                  error
	Files                  map[string]string
	CueLoadConfigWithFiles *load.Config
}

type CueConfigWatcher struct {
	ReadyFile        string
	NotifyQueue      *notify.Queue
	Config           *load.Config
	CueModuleChanged []notify.Notifier[*CueModuleChanged]
}

func (w *CueConfigWatcher) Serve(ctx context.Context) {
	log.Printf("CueConfigWatcher serve %#v", w)
	watcher, err := NewWatcher(ctx, func(err error) {
		if w.ReadyFile != "" {
			readyFilePath := filepath.Join(w.Config.Dir, w.ReadyFile)
			if _, err := os.Stat(readyFilePath); err != nil {
				log.Printf("ignoring file event; ready file not visible; %#v", err)
				return
			}
		}

		if err != nil {
			notify.Later(w.NotifyQueue, w.CueModuleChanged, &CueModuleChanged{err, nil, nil})
			return
		}
		files, copy, err := CopyConfigAndReadFilesIntoOverrides(w.Config)
		notify.Later(w.NotifyQueue, w.CueModuleChanged, &CueModuleChanged{err, files, copy})
	})
	if err != nil {
		log.Printf("error starting cue module watcher: %s", err)
		return
	}
	watcher.Add(w.Config.Dir)
}

func NewWatcher(ctx context.Context, cb func(err error)) (*fsnotify.Watcher, error) {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Printf("WARN: error starting fsnotify, live editing disabled!\n")
		return nil, err
	}

	debounceInterval := 100 * time.Millisecond
	go func() {
		defer slog.Info("cueloader watcher done")
		debounce := time.NewTimer(debounceInterval)
		for {
			select {
			case event, ok := <-watcher.Events:
				if !ok {
					return
				}
				slog.Info("cueloader watcher event", "event", event)
				debounce.Reset(debounceInterval)
			case <-debounce.C:
				slog.Info("cueloader watcher event debounced")
				cb(nil)
			case err, ok := <-watcher.Errors:
				if !ok {
					return
				}
				slog.Info("cueloader watcher error", err)
				cb(err)
			}
		}
	}()

	go func() {
		defer slog.Info("cueloader watcher closing")
		defer watcher.Close()
		<-ctx.Done()
	}()

	return watcher, nil
}

func LookupPathTransform(p cue.Path) Transform {
	return func(v cue.Value) cue.Value {
		return v.LookupPath(p)
	}
}

func FillPathCompileTransform(p cue.Path, s string) Transform {
	return func(v cue.Value) cue.Value {
		cc := v.Context()
		return v.FillPath(p, cc.CompileString(s))
	}
}

func FillPathEncodeTransform(p cue.Path, o any) Transform {
	return func(v cue.Value) cue.Value {
		cc := v.Context()
		return v.FillPath(p, cc.Encode(o))
	}
}

func FillPathEncodeTransformCurrent(p cue.Path, f func() any) Transform {
	return func(v cue.Value) cue.Value {
		cc := v.Context()
		return v.FillPath(p, cc.Encode(f()))
	}
}
