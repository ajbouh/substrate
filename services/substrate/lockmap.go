package substrate

import "sync"

type LockMap struct {
	mu *sync.Mutex

	m map[string]*sync.Mutex
}

func NewLockMap() *LockMap {
	return &LockMap{
		mu: &sync.Mutex{},
		m:  map[string]*sync.Mutex{},
	}
}

func (m *LockMap) Lock(name string) func() {
	m.mu.Lock()

	l, ok := m.m[name]
	unlock := func() {
		l.Unlock()
		m.mu.Lock()
		delete(m.m, name)
		m.mu.Unlock()
	}
	if ok {
		m.mu.Unlock()
		l.Lock()
		return unlock
	}

	l = &sync.Mutex{}
	m.m[name] = l
	l.Lock()
	m.mu.Unlock()
	return unlock
}
