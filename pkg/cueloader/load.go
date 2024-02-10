package cueloader

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"cuelang.org/go/cue"
	"cuelang.org/go/cue/build"
	"cuelang.org/go/cue/load"
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

type Loader func(mu *sync.Mutex, cc *cue.Context, config *load.Config) *Load

type Transform func(v cue.Value) cue.Value

func NewCueLoader(arg string, transforms ...Transform) Loader {
	return func(mu *sync.Mutex, cc *cue.Context, config *load.Config) *Load {
		l := &Load{}
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

func CopyConfigAndReadFilesIntoOverrides(config *load.Config) (map[string]string, *load.Config, error) {
	copy := *config
	files := map[string]string{}
	err := AddCueFiles(files, copy.Dir, "", false)
	if err != nil {
		return files, &copy, err
	}
	// Reset the overlay
	overlay := map[string]load.Source{}
	for k, v := range files {
		overlay[k] = load.FromString(v)
	}
	copy.Overlay = overlay
	copy.Tags = append([]string{}, copy.Tags...)
	return files, &copy, err
}

func NewCueConfigWatcher(ctx context.Context, config *load.Config, cb func(err error, files map[string]string, config *load.Config)) error {
	watcher, err := NewWatcher(ctx, func(err error) {
		if err != nil {
			cb(err, nil, nil)
			return
		}
		files, copy, err := CopyConfigAndReadFilesIntoOverrides(config)
		cb(err, files, copy)
	})
	if err != nil {
		return err
	}
	watcher.Add(config.Dir)

	return nil
}


func NewCueConfigWatcherFromURL(ctx context.Context, url string, cb func (err error, files map[string]string, config *load.Config)) error {
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return err
	}
	log.Printf("making request of %s", url)
	return ReadStreamEvents(http.DefaultClient, req, func (event *Event) error {
		files, config, err := Unmarshal(event.Data)
		log.Printf("%d files dir=%s tags=%#v", len(files), config.Dir, config.Tags)
		cb(err, files, config)
		return nil
	})
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
