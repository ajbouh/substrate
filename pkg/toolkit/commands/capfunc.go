package commands

type CapFunc struct {
	Func func(env Env, d Fields) (Fields, error)
}

var _ Cap = (*CapFunc)(nil)

func (a *CapFunc) Apply(env Env, d Fields) (Fields, error) {
	return a.Func(env, d)
}
