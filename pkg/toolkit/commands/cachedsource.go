package commands

import "context"

type CachedSource struct {
	Defs      DefIndex
	DefRunner DefRunner
}

var _ Runner = (*CachedSource)(nil)
var _ Reflector = (*CachedSource)(nil)

func (h *CachedSource) Reflect(ctx context.Context) (DefIndex, error) {
	return h.Defs.Reflect(ctx)
}

func (h *CachedSource) String() string {
	return "*CachedSource[" + h.Defs.String() + "]"
}

func (h *CachedSource) Run(ctx context.Context, name string, params Fields) (Fields, error) {
	def, ok := h.Defs[name]
	if !ok {
		return nil, ErrNoSuchCommand
	}

	f, err := h.DefRunner.RunDef(ctx, def, Fields{"parameters": params})
	if err != nil {
		return nil, err
	}

	returns, _ := Get[Fields](f, "returns")
	return returns, nil
}
