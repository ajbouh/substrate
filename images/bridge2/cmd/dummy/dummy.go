package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/ajbouh/substrate/pkg/commands"
	"tractor.dev/toolkit-go/engine"
	"tractor.dev/toolkit-go/engine/cli"
	"tractor.dev/toolkit-go/engine/daemon"
)

func main() {
	engine.Run(
		Main{},
	)
}

type Main struct {
	Daemon *daemon.Framework
	port   int
}

func (m *Main) commandSource() commands.Source {
	src := commands.NewStaticSource([]commands.Entry{
		{Name: "to_lower",
			Def: commands.Def{
				Description: `to_lower(text: str) -> str
			Args:
				text (str): Text to convert.

			Returns:
				text (bool): Outpu.`,
				Parameters: commands.FieldDefs{
					"text": {
						Name:        "text",
						Type:        "string",
						Description: "Text to lower-case.",
					},
				},
				Returns: nil,
			},
			Run: func(ctx context.Context, args commands.Fields) (commands.Fields, error) {
				text := args.String("text")
				return commands.Fields{
					"text": strings.ToLower(text),
				}, nil
			},
		},
	})
	return src
}

func fatal(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func must[T any](t T, err error) T {
	fatal(err)
	return t
}

func parsePort(port string) int {
	port16 := must(strconv.ParseUint(port, 10, 16))
	return int(port16)
}

func getEnv(key, def string) string {
	v := os.Getenv(key)
	if v == "" {
		return def
	}
	return v
}

func (m *Main) Initialize() {
	// basePath := os.Getenv("SUBSTRATE_URL_PREFIX")
	// ensure the path starts and ends with a slash for setting <base href>
	// m.basePath = must(url.JoinPath("/", basePath, "/"))
	// log.Println("got basePath", m.basePath, "from SUBSTRATE_URL_PREFIX", basePath)
	m.port = parsePort(getEnv("PORT", "8080"))
}

func (m *Main) InitializeCLI(root *cli.Command) {
	root.Run = func(ctx *cli.Context, args []string) {
		if err := m.Daemon.Run(ctx); err != nil {
			log.Fatal(err)
		}
	}
}

func (m *Main) TerminateDaemon(ctx context.Context) error {
	return nil
}

func (m *Main) Serve(ctx context.Context) {
	handler := &commands.HTTPHandler{
		Source: &commands.DynamicSource{
			Sources: []commands.Source{
				m.commandSource(),
			},
		},
	}
	http.HandleFunc("REFLECT /", func(w http.ResponseWriter, r *http.Request) {
		handler.ServeHTTPReflect(w, r)
	})
	http.HandleFunc("POST /", func(w http.ResponseWriter, r *http.Request) {
		handler.ServeHTTPRun(w, r)
	})
	log.Printf("running on http://localhost:%d ...", m.port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", m.port), nil))
}
