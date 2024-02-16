package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/chromedp/cdproto/runtime"
	"github.com/chromedp/chromedp"
	"github.com/chromedp/chromedp/kb"
)

type CommandFields map[string]any

type CommandFieldDef struct {
	Description string
	Name        string
	Type        string // "string", "number", "boolean"
}

type CommandFieldDefs map[string]CommandFieldDef

type CommandDef struct {
	Description string           `json:"description,omitempty"`
	Parameters  CommandFieldDefs `json:"parameters,omitempty"`
	Returns     CommandFieldDefs `json:"returns,omitempty"`
}

type CommandRequest struct {
	Command    string
	Parameters CommandFields
}

type CommandResponseError struct {
	Message string
}

type CommandResponse struct {
	Error   *CommandResponseError
	Returns CommandFields
}

type CommandIndex map[string]CommandDef

type CommandRunnerFunc func(ctx context.Context, p CommandFields) (CommandFields, error)

func (f CommandFields) String(k string) string {
	v, ok := f[k]
	if ok {
		return v.(string)
	}
	return ""
}

func (f CommandFields) Bool(k string) bool {
	v, ok := f[k]
	if ok {
		return v.(bool)
	}
	return false
}

type CDPCommander struct {
	Endpoint string
	Debug    bool

	builtinCommands     map[string]CommandRunnerFunc
	builtinCommandIndex CommandIndex

	ctx    context.Context
	finish func()
}

func (c *CDPCommander) commandIndex(ctx context.Context) (CommandIndex, error) {
	page := CommandIndex{}
	err := chromedp.Run(c.ctx,
		chromedp.Evaluate(`window?.substrate?.r0?.commands?.index`, &page),
	)
	if err != nil {
		return nil, err
	}

	ci := CommandIndex{}
	for name, def := range page {
		ci["page:"+name] = def
	}
	for name, def := range c.builtinCommandIndex {
		ci[name] = def
	}

	return ci, nil
}

func (c *CDPCommander) runCommand(ctx context.Context, name string, p CommandFields) (CommandFields, error) {
	if cmd, ok := c.builtinCommands[name]; ok {
		return cmd(ctx, p)
	}

	if !strings.HasPrefix(name, "page:") {
		return nil, fmt.Errorf("no such command: %q", name)
	}

	name = strings.TrimPrefix(name, "page:")

	b, err := json.Marshal(p)
	if err != nil {
		return nil, err
	}

	var result CommandFields
	err = chromedp.Run(c.ctx,
		chromedp.Evaluate(fmt.Sprintf(`window.substrate.r0.commands.run(%q,%s)`, name, string(b)),
			&result,
			func(ep *runtime.EvaluateParams) *runtime.EvaluateParams {
				return ep.WithAwaitPromise(true)
			},
		),
	)
	return result, err
}

// TODO GET if accepts text/event-stream, stream update events
// func acceptsTextEventStream(r *http.Request) bool {
// 	availableMediaTypes := []contenttype.MediaType{
// 		contenttype.NewMediaType("text/plain"), // A dummy value so matching doesn't assume text/event-stream
// 		contenttype.NewMediaType("text/event-stream"),
// 	}
// 	if accepted, _, err := contenttype.GetAcceptableMediaType(r, availableMediaTypes); err == nil && accepted.Type == "text" && accepted.Subtype == "event-stream" {
// 		return true
// 	}
// 	return false
// }

func (c *CDPCommander) serveError(w http.ResponseWriter, err error, code int) {
	if c.Debug {
		b, e := json.Marshal(map[string]any{"error": err.Error()})
		if e == nil {
			http.Error(w, string(b), code)
			return
		}
		log.Printf("failed to produce JSON version of error message: %s; will not include it in response", e)
	}

	log.Printf("request error: %s", err)
	http.Error(w, `{"error": "unspecified"}`, code)
}

func (c *CDPCommander) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// GET returns commands (with meta header including url, update timestamp, revision id)
	// POST runs a command (accepts meta header including url, update timestamp, revision id; errors on meta mismatch)
	switch {
	case r.Method == http.MethodGet:
		h := w.Header()
		h.Set("Content-Type", "application/json")
		commands, err := c.commandIndex(c.ctx)
		if err != nil {
			c.serveError(w, err, http.StatusInternalServerError)
			return
		}
		b, err := json.Marshal(commands)
		if err != nil {
			c.serveError(w, err, http.StatusInternalServerError)
			return
		}
		w.Write(b)
	case r.Method == http.MethodPost:
		var commandRequest CommandRequest
		defer r.Body.Close()
		b, err := io.ReadAll(r.Body)
		if err != nil {
			c.serveError(w, err, http.StatusBadRequest)
			return
		}

		err = json.Unmarshal(b, &commandRequest)
		if err != nil {
			c.serveError(w, err, http.StatusBadRequest)
			return
		}

		res, err := c.runCommand(c.ctx, commandRequest.Command, commandRequest.Parameters)
		if err != nil {
			c.serveError(w, err, http.StatusInternalServerError)
			return
		}

		b, err = json.Marshal(res)
		if err != nil {
			c.serveError(w, err, http.StatusInternalServerError)
			return
		}
		w.Write(b)
	default:
		http.Error(w, `{"error": "method must be GET or POST"}`, http.StatusMethodNotAllowed)
	}
}

func (a *CDPCommander) defineBuiltin(name string, def CommandDef, run CommandRunnerFunc) {
	a.builtinCommands[name] = run
	a.builtinCommandIndex[name] = def
}

func (a *CDPCommander) Initialize() {
	log.Printf("CDPCommander Initialize")
	a.builtinCommands = map[string]CommandRunnerFunc{}
	a.builtinCommandIndex = CommandIndex{}
	a.defineBuiltin("tab:navigate",
		CommandDef{
			Description: "Visit the given `url`",
			Parameters: CommandFieldDefs{
				"url": CommandFieldDef{
					Type: "string",
				},
				"lazy": CommandFieldDef{
					Type: "boolean",
				},
			},
		},
		func(ctx context.Context, p CommandFields) (CommandFields, error) {
			url := p.String("url")
			if p.Bool("lazy") {
				var u string
				err := chromedp.Run(a.ctx, chromedp.Location(&u))
				if err != nil {
					return nil, err
				}

				if u == url {
					return CommandFields{
						"navigated": false,
					}, nil
				}
			}

			return CommandFields{
				"navigated": true,
			}, chromedp.Run(a.ctx, chromedp.Navigate(url))
		},
	)
	a.defineBuiltin("tab:reload",
		CommandDef{
			Description: "Reload the tab's current url",
		},
		func(ctx context.Context, p CommandFields) (CommandFields, error) {
			return nil, chromedp.Run(a.ctx, chromedp.Reload())
		},
	)
	a.defineBuiltin("tab:back",
		CommandDef{
			Description: "Go to the previous page",
		},
		func(ctx context.Context, p CommandFields) (CommandFields, error) {
			return nil, chromedp.Run(a.ctx, chromedp.NavigateBack())
		},
	)
	a.defineBuiltin("tab:evaluate",
		CommandDef{
			Description: "Evaluate given javascript",
		},
		func(ctx context.Context, p CommandFields) (CommandFields, error) {
			var result CommandFields
			return result, chromedp.Run(a.ctx, chromedp.Evaluate(p.String("js"),
				&result,
				func(ep *runtime.EvaluateParams) *runtime.EvaluateParams {
					return ep.WithAwaitPromise(true)
				},
			),
			)
		},
	)
	a.defineBuiltin("tab:scrollup",
		CommandDef{
			Description: "Scroll up",
		},
		func(ctx context.Context, p CommandFields) (CommandFields, error) {
			return nil, chromedp.Run(a.ctx, chromedp.KeyEvent(kb.Shift+" "))
		},
	)
	a.defineBuiltin("tab:scrolldown",
		CommandDef{
			Description: "Scroll down",
		},
		func(ctx context.Context, p CommandFields) (CommandFields, error) {
			return nil, chromedp.Run(a.ctx, chromedp.KeyEvent(" "))
		},
	)
	a.defineBuiltin("tab:click",
		CommandDef{
			Description: "Click on a link with the given `text`",
		},
		func(_ context.Context, p CommandFields) (CommandFields, error) {
			ctx := a.ctx
			timeout := p.String("timeout")
			if timeout != "" {
				dur, err := time.ParseDuration(timeout)
				if err != nil {
					return nil, err
				}

				var cancel func()
				ctx, cancel = context.WithTimeout(ctx, dur)
				defer cancel()
			}

			selector := p.String("selector")
			if selector != "" {
				text := p.String("text")
				if text != "" {
					selector = fmt.Sprintf(`//a[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '%s')]`, text)
				}
			}
			// return nil, chromedp.Run(ctx, chromedp.Click(selector, chromedp.NodeVisible))
			return nil, chromedp.Run(ctx, chromedp.Click(selector))
		},
	)

	ctx := context.Background()
	ctx, _ = chromedp.NewRemoteAllocator(ctx, a.Endpoint)
	a.ctx, a.finish = chromedp.NewContext(ctx)
}
