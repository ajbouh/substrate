package main

import (
	"github.com/ajbouh/substrate/images/quickjs/units"
	"github.com/ajbouh/substrate/pkg/toolkit/engine"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
)

func main() {
	engine.Run(
		&service.Service{
			ExportsRoute: "/",
		},
		units.EvalCommand,
		units.AddReflectorAsGlobal,
	)
}
