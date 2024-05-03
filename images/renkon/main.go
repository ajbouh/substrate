package main

import (
	"net/http"

	"github.com/ajbouh/substrate/images/renkon/dist"
	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
	"github.com/ajbouh/substrate/pkg/toolkit/service"

	"tractor.dev/toolkit-go/engine"
)

func main() {
	engine.Run(
		&service.Service{},
		httpframework.Route{
			Route:   "/",
			Handler: http.StripPrefix("/", http.FileServer(http.FS(dist.Dir))),
		},
	)
}
