package main

import (
	"github.com/ajbouh/substrate/images/msgtun/units"
	"github.com/ajbouh/substrate/pkg/duplex"
	"github.com/ajbouh/substrate/pkg/toolkit/engine"
	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
)

func main() {
	engine.Run(
		&service.Service{
			ExportsRoute: "/{$}",
		},
		&httpframework.Route{
			Route:   "GET /duplex.min.js",
			Handler: duplex.JS,
		},
		&units.SourceMux{},
	)
}
