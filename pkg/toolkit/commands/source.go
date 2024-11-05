package commands

import "context"

type Source interface {
	Reflector
	Runner
}

type Delegate interface {
	Commands(ctx context.Context) Source
}

// This is a HACK to cope with the lack of nesting in engine.Run
type Wrapper interface {
	WrapsCommandsSource() Source
}
