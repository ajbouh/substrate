package substratehttp

import (
	"context"
	"fmt"

	"cuelang.org/go/cue"
	"github.com/ajbouh/substrate/images/substrate/defset"
	"github.com/ajbouh/substrate/images/substrate/httputil"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
	"tractor.dev/toolkit-go/engine"
)

type EvalHandler struct {
	Prefix string
}

type EvalReturns struct {
	Source string `json:"source"`
}

func (h *EvalHandler) Units() []engine.Unit {
	return []engine.Unit{
		&commands.HTTPResourceCommand{
			ReflectPath: h.Prefix,
			Pattern:     fmt.Sprintf("POST %s/v1/eval", h.Prefix),
			Handler: commands.Command(
				"eval",
				"Evaluate a CUE expression",
				func(ctx context.Context,
					t *struct {
						DefSetLoader notify.Loader[*defset.DefSet]
					},
					args struct {
						Expression string `json:"expression"`
					},
				) (EvalReturns, error) {
					defset := t.DefSetLoader.Load()

					var resp []byte
					func() {
						defset.CueMu.Lock()
						defer defset.CueMu.Unlock()

						// HACK just trying to make an empty struct
						scope := defset.CueContext.CompileString("{...}", cue.ImportPath("_"))
						scope = scope.FillPath(cue.MakePath(cue.Hid("_root", "_")), defset.RootValue)

						result := defset.CueContext.CompileString(args.Expression, cue.ImportPath("_"), cue.Scope(scope), cue.InferBuiltins(true))

						_, resp = httputil.WriteCueValue("application/cue", result)
					}()

					return EvalReturns{
						Source: string(resp),
					}, nil
				}),
		},
	}
}