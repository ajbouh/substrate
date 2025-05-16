package commands_test

import (
	"context"
	"encoding/json"
	"log/slog"
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
)

func TestEchoCommand(t *testing.T) {
	client := &struct {
		Env commands.Env
	}{}
	Assemble(&service.Service{}, client)

	type Args struct {
		Input any `json:"input"`
	}

	type Returns struct {
		Output any `json:"output"`
	}

	h := InitHandler(
		&service.Service{},
		handle.Command("echo", "Echo",
			func(ctx context.Context,
				t *struct{},
				args Args) (Returns, error) {
				slog.Info("echo", "args", args)
				return Returns{Output: args.Input}, nil
			}),
	)

	srv := httptest.NewServer(h)
	defer srv.Close()

	got, err := commands.CallURL[Returns](context.Background(), client.Env, srv.URL, "echo", commands.Fields{
		"input": "hello world",
	})
	if err != nil {
		t.Fatalf("error calling command: %v", err)
	}

	want := &Returns{Output: "hello world"}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("got %q; want %q", got, want)
	}
}

func TestHTTPCommand(t *testing.T) {
	client := &struct {
		Env commands.Env
	}{}
	Assemble(&service.Service{}, client)

	type Args struct {
		B any    `json:"b"`
		Q string `json:"q" query:"q"`
		P string `json:"p" path:"p"`
		H string `json:"h" header:"H"`
	}

	type Returns struct {
		B any    `json:"b"`
		Q string `json:"q"`
		P string `json:"p"`
		H string `json:"h"`
	}

	h := InitHandler(
		&service.Service{},
		handle.HTTPCommand("echo", "Echo",
			"POST /echo/{p}", "/",
			func(ctx context.Context,
				t *struct{},
				args Args) (Returns, error) {
				slog.Info("echo", "args", args)
				return Returns(args), nil
			}),
	)

	srv := httptest.NewServer(h)
	defer srv.Close()

	got, err := commands.CallURL[Returns](context.Background(), client.Env, srv.URL, "echo", commands.Fields{
		"b": "inbody",
		"q": "inquery",
		"p": "inpath",
		"h": "inheader",
	})
	if err != nil {
		t.Fatalf("error calling command: %v", err)
	}

	want := &Returns{
		B: "inbody",
		Q: "inquery",
		P: "inpath",
		H: "inheader",
	}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("got %q; want %q", got, want)
	}
}

func TestHTTPCommandWithJSONInQuery(t *testing.T) {
	client := &struct {
		Env commands.Env
	}{}
	Assemble(&service.Service{}, client)

	type Args struct {
		Q json.RawMessage `json:"q" query:"q"`
	}

	type Returns struct {
		Q any `json:"q"`
	}

	h := InitHandler(
		&service.Service{},
		handle.HTTPCommand("echo", "Echo",
			"POST /echo/{p}", "/",
			func(ctx context.Context,
				t *struct{},
				args Args) (Returns, error) {
				slog.Info("echo", "args", args)
				return Returns{Q: args.Q}, nil
			}),
	)

	srv := httptest.NewServer(h)
	defer srv.Close()

	got, err := commands.CallURL[Returns](context.Background(), client.Env, srv.URL, "echo", commands.Fields{
		"q": "[2, true]",
	})
	if err != nil {
		t.Fatalf("error calling command: %v", err)
	}

	want := &Returns{
		Q: []any{float64(2), true},
	}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("got %#v; want %#v", got, want)
	}
}

func TestHTTPCommandWithPathVarInReflectURL(t *testing.T) {
	client := &struct {
		Env commands.Env
	}{}
	Assemble(&service.Service{}, client)

	type Args struct {
		B any    `json:"b"`
		Q string `json:"q" query:"q"`
		P string `json:"p" path:"p"`
		H string `json:"h" header:"H"`
	}

	type Returns struct {
		B any    `json:"b"`
		Q string `json:"q"`
		P string `json:"p"`
		H string `json:"h"`
	}

	h := InitHandler(
		&service.Service{},
		handle.HTTPCommand("echo", "Echo",
			"POST /echo/{p}", "/r/{p}",
			func(ctx context.Context,
				t *struct{},
				args Args) (Returns, error) {
				slog.Info("echo", "args", args)
				return Returns(args), nil
			}),
	)

	srv := httptest.NewServer(h)
	defer srv.Close()

	got, err := commands.CallURL[Returns](context.Background(), client.Env, srv.URL+"/r/inpath", "echo", commands.Fields{
		"b": "inbody",
		"q": "inquery",
		"h": "inheader",
	})
	if err != nil {
		t.Fatalf("error calling command: %v", err)
	}

	want := &Returns{
		B: "inbody",
		Q: "inquery",
		P: "inpath",
		H: "inheader",
	}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("got %q; want %q", got, want)
	}
}
