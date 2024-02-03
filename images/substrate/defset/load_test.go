package defset_test

import (
	"context"
	"os"
	"path/filepath"
	"reflect"
	"strconv"
	"sync"
	"testing"
	"time"

	"cuelang.org/go/cue/cuecontext"
	"cuelang.org/go/cue/load"
	"github.com/ajbouh/substrate/images/substrate/defset"
)

func assertLoad(t *testing.T, l *defset.CueLoad, want map[string]any, err string) {
	if l == nil {
		t.Fatalf("unexpected nil load")
	}
	if err != "" {
		if l.Err == nil {
			t.Fatalf("missing expected error: %s; want %s", l.Err, err)
		}
		if l.Err.Error() != err {
			t.Fatalf("unexpected error: %s; want %s", l.Err, err)
		}
	} else {
		if l.Err != nil {
			t.Fatalf("unexpected error: %s", l.Err)
		}
	}

	v := map[string]any{}
	l.Value.Decode(&v)

	if !reflect.DeepEqual(want, v) {
		t.Fatalf("value = %#v; want %#v; from %#v", v, want, l.Value)
	}
}

type loadNowCase struct {
	name  string
	files map[string]string
	arg   string
	want  map[string]any
}

func runLoadNowCase(t *testing.T, c loadNowCase) {
	dir := t.TempDir()
	cc := cuecontext.New()
	config := &load.Config{
		Dir: dir,
	}
	for n, s := range c.files {
		os.WriteFile(filepath.Join(dir, n), []byte(s), 0644)
	}

	l := defset.NewCueLoader(config, c.arg)(&sync.Mutex{}, cc)
	assertLoad(t, l, c.want, "")
}

func TestLoadNow(t *testing.T) {
	loadCases := []loadNowCase{
		{
			name: "simple",
			files: map[string]string{
				"defs.cue": `{one: 1}`,
			},
			arg:  "defs.cue",
			want: map[string]any{"one": 1},
		},
		{
			name: "simple",
			files: map[string]string{
				"defs.cue": `{one: 1}`,
			},
			arg:  "defs.cue",
			want: map[string]any{"one": 1},
		},
		{
			name: "multiple-files",
			files: map[string]string{
				"defs.cue": `package defs
{one: 1}`,
				"other.cue": `package defs
{uno: 1}`,
			},
			arg:  ":defs",
			want: map[string]any{"one": 1, "uno": 1},
		},
	}
	for _, c := range loadCases {
		t.Run(c.name, func(t *testing.T) { runLoadNowCase(t, c) })
	}
}

type loadUntilCaseOp struct {
	want  map[string]any
	write map[string]string
	err   string
}

type loadUntilCase struct {
	name string
	arg  string

	ops []loadUntilCaseOp
}

func runLoadUntilCase(t *testing.T, c loadUntilCase) {
	dir := t.TempDir()
	cc := cuecontext.New()
	config := &load.Config{
		Dir: dir,
	}
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	cl := make(chan *defset.CueLoad, 1)
	loader := defset.NewCueLoader(config, c.arg)
	mu := &sync.Mutex{}
	defset.NewCueWatcher(ctx, config, func(err error) {
		cl <- loader(mu, cc)
	})

	for i, op := range c.ops {
		t.Run("op="+strconv.Itoa(i), func(t *testing.T) {
			for n, s := range op.write {
				os.WriteFile(filepath.Join(dir, n), []byte(s), 0644)
			}

			select {
			case l := <-cl:
				assertLoad(t, l, op.want, op.err)
			case <-time.After(time.Second):
				t.Fatalf("no event before timeout")
			}
		})
	}
}

func TestLoadUntil(t *testing.T) {
	loadCases := []loadUntilCase{
		{
			name: "simple",
			arg:  "defs.cue",
			ops: []loadUntilCaseOp{
				{
					write: map[string]string{
						"defs.cue": `{one: 1}`,
					},
					want: map[string]any{"one": 1},
				},
				{
					write: map[string]string{
						"defs.cue": `{two: 2}`,
					},
					want: map[string]any{"two": 2},
				},
				{
					write: map[string]string{
						"defs.cue": `{three: 3}`,
					},
					want: map[string]any{"three": 3},
				},
			},
		},
		{
			name: "multifiles",
			arg:  ":defs",
			ops: []loadUntilCaseOp{
				{
					write: map[string]string{
						"one.cue": `package defs
{one: 1}`,
					},
					want: map[string]any{"one": 1},
				},
				{
					write: map[string]string{
						"two.cue": `package defs
{two: 2}`,
					},
					want: map[string]any{"one": 1, "two": 2},
				},
				{
					write: map[string]string{
						"three.cue": `package defs
{three: 3}`,
					},
					want: map[string]any{"one": 1, "two": 2, "three": 3},
				},
				{
					write: map[string]string{
						"two.cue": ``,
					},
					want: map[string]any{"one": 1, "three": 3},
				},
			},
		},
	}
	for _, c := range loadCases {
		t.Run(c.name, func(t *testing.T) { runLoadUntilCase(t, c) })
	}
}
