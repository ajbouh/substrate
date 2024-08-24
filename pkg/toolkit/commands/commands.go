package commands

import "context"

type Source interface {
	Reflector
	Runner
}

type Delegate interface {
	Commands(ctx context.Context) Source
}
