package main

import (
	"github.com/ajbouh/substrate/images/gstreamer-pipeline/pipeline"
	"github.com/ajbouh/substrate/pkg/toolkit/service"

	"github.com/ajbouh/substrate/pkg/toolkit/engine"
)

func main() {
	engine.Run(
		&service.Service{},
		&pipeline.Glib{},
		&pipeline.PipelineSlotMap{},
		&pipeline.HTTPPatchHandler{},
		&pipeline.HTTPGetHandler{},
	)
}
