package commands_test

import (
	"context"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
	"github.com/ajbouh/substrate/pkg/toolkit/engine"
	"github.com/ajbouh/substrate/pkg/toolkit/engine/daemon"
	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
)

// Run assembles units and starts the program.
func InitHandler(units ...engine.Unit) http.Handler {
	asm := Assemble(units...)

	var h []http.Handler

	for i := len(asm.Units()) - 1; i >= 0; i-- {
		u := asm.Units()[i]
		r, ok := u.(*httpframework.Framework)
		if ok {
			h = append(h, r)
		}
	}

	if len(h) != 1 {
		panic(fmt.Errorf("expected 1 http.Handler, got %d", len(h)))
	}
	return h[0]
}

func Assemble(units ...engine.Unit) *engine.Assembly {
	asm, err := engine.New(units...)
	if err != nil {
		log.Fatal(err)
	}

	// add assembly
	if err := asm.Add(asm); err != nil {
		panic(err)
	}

	// add daemon framework
	d := &daemon.Framework{}
	if err := asm.Add(d); err != nil {
		panic(err)
	}

	// // add cli framework
	// c := &cli.Framework{}
	// if err := asm.Add(c); err != nil {
	// 	panic(err)
	// }

	// add logger
	if err := asm.Add(slog.Default()); err != nil {
		panic(err)
	}

	// re-assemble
	asm, err = engine.Assemble(asm.Units()...)
	if err != nil {
		panic(err)
	}

	for i := len(asm.Units()) - 1; i >= 0; i-- {
		u := asm.Units()[i]
		r, ok := u.(daemon.Initializer)
		if ok {
			if err := r.InitializeDaemon(); err != nil {
				panic(err)
			}
		}
	}

	return asm
}

func TestCallCommand(t *testing.T) {
	type EchoReturn struct {
		Output string `json:"output"`
	}
	h := InitHandler(
		&service.Service{},
		handle.Command("echo", "Echo",
			func(ctx context.Context,
				t *struct{},
				args struct {
					Input string `json:"input"`
				}) (EchoReturn, error) {
				slog.Info("echo", "args", args)
				return EchoReturn{Output: args.Input}, nil
			}),
	)

	client := &struct {
		Reflector commands.URLReflector
	}{}
	Assemble(&service.Service{}, client)

	srv := httptest.NewServer(h)
	defer srv.Close()

	// XXX using CallURL here, though this should be ported to use cap-based
	// client such as in bridge/calls
	// CallURL seems like it's not used, and could probably be removed since
	// AFAICT that pattern is being deprecated.
	response, err := commands.CallURL[EchoReturn](context.Background(), client.Reflector, srv.URL, "echo", commands.Fields{
		"input": "hello world",
	})
	if err != nil {
		t.Fatalf("error calling command: %v", err)
	}
	t.Logf("Response: %+v", response)
}
