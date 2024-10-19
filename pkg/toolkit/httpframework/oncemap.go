package httpframework

import (
	"github.com/puzpuzpuz/xsync/v3"
	"golang.org/x/sync/singleflight"
)

type OnceMap[T any] struct {
	cache *xsync.MapOf[string, T]
	group singleflight.Group
}

func NewOnceMap[T any]() *OnceMap[T] {
	return &OnceMap[T]{
		cache: xsync.NewMapOf[string, T](),
		group: singleflight.Group{},
	}
}

func (o *OnceMap[T]) LoadOrCompute(key string, fn func() (T, error)) (T, error) {
	// Check cache
	value, found := o.cache.Load(key)
	if found {
		return value, nil
	}
	_, err, _ := o.group.Do(key, func() (any, error) {
		// try again
		if _, found := o.cache.Load(key); found {
			return nil, nil
		}
		// compute
		data, innerErr := fn()
		if innerErr == nil {
			o.cache.Store(key, data)
		}
		return nil, innerErr
	})
	if err != nil {
		o.group.Forget(key)
	}
	value, _ = o.cache.Load(key)
	return value, err
}

func (o *OnceMap[T]) Size() int {
	return o.cache.Size()
}

func (o *OnceMap[T]) Range(f func(key string, value T) bool) {
	o.cache.Range(f)
}

func (o *OnceMap[T]) Load(key string) (T, bool) {
	return o.cache.Load(key)
}

func (o *OnceMap[T]) LoadAndDelete(key string) (T, bool) {
	o.group.Forget(key)
	return o.cache.LoadAndDelete(key)
}

func (o *OnceMap[T]) LoadOrStore(key string, val T) (T, bool) {
	return o.cache.LoadOrStore(key, val)
}
