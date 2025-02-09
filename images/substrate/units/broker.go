package units

import (
	"context"
	"log/slog"

	"cuelang.org/go/cue"
	"github.com/ajbouh/substrate/images/substrate/defset"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
)

type Broker struct {
	SpaceID string

	DefSetLoader               Loader[*defset.DefSet]
	HTTPResourceReflectHandler *handle.HTTPResourceReflectHandler
}

var _ commands.Reflector = (*Broker)(nil)

func (b *Broker) CloneWithSpace(spaceID string) *Broker {
	return &Broker{
		SpaceID:                    spaceID,
		DefSetLoader:               b.DefSetLoader,
		HTTPResourceReflectHandler: b.HTTPResourceReflectHandler,
	}
}

func (m *Broker) GetHTTPResourceReflectPath() string {
	return "/substrate/v1/services/{service}"
}

func (b *Broker) Reflect(ctx context.Context) (commands.DefIndex, error) {
	// slog.Info("Broker.Reflect()")
	// return commands.DefIndex{}, nil

	di := commands.DefIndex{}
	if b == nil {
		return di, nil
	}

	pv := handle.ContextPathValuer(ctx)
	if pv == nil {
		return di, nil
	}

	serviceName := pv.PathValue("service")
	if serviceName == "" {
		return di, nil
	}

	ds := b.DefSetLoader.Load()
	if ds == nil {
		return di, nil
	}

	var template InstanceParameterTypes
	ok, err := ds.TransformAndDecode(
		&template,
		func(v cue.Value) cue.Value {
			return v.LookupPath(cue.MakePath(cue.Str("services"), cue.Str(serviceName), cue.Str("instances")))
		},
		func(v cue.Value) cue.Value {
			return v.Unify(v.Context().CompileString(`{"": _}`)).LookupPath(cue.MakePath(cue.Str("")))
		},
	)
	if !ok || err != nil {
		return di, err
	}

	bindings := map[string]commands.BindEntry{}
	// slog.Info("Broker.Reflect()", "serviceName", serviceName, "template", *template)

	var spaceParams []string
	var idParams []string
	var otherParams []string
	for name, p := range template.Parameters {
		switch p.Type {
		case "space":
			spaceParams = append(spaceParams, name)
			continue
		case "string":
			if name == "id" {
				idParams = append(idParams, name)
			}
			continue
		}

		otherParams = append(otherParams, name)
	}

	// We're looking for services that we can spawn that need either a single id *and/or* a single space
	points := 0
	if len(spaceParams) == 1 {
		points++
	}
	if len(idParams) == 1 {
		points++
	}

	// slog.Info("Broker.Reflect()", "serviceName", serviceName, "template", *template, "points", points, "spaceParams", spaceParams, "idParams", idParams, "otherParams", otherParams)
	if points == 0 {
		return di, nil
	}

	parameters := map[string]string{}
	for _, idParam := range idParams {
		// Use a blank id to implicitly request a new id.
		parameters[idParam] = ""
	}
	// Use a blank space to implicitly request a new space.
	for _, spaceParam := range spaceParams {
		parameters[spaceParam] = b.SpaceID
	}

	// slog.Info("Broker.Reflect()", "serviceName", serviceName, "template", *template, "points", points, "spaceParams", spaceParams, "idParams", idParams, "otherParams", otherParams, "parameters", parameters)

	// For now we skip services that take *any other parameters* beyond these two. In the future
	// we might want to do something fancy with binding to support accepting just the unset
	// spawn parameters as command parameters. But not right now.
	if len(otherParams) > 0 {
		return di, nil
	}

	// we should now be left with services
	bindings["new"] = commands.BindEntry{
		Command: "instances:new",
		Data: commands.Fields{
			"parameters": commands.Fields{
				"service":    serviceName,
				"parameters": parameters,
			},
		},
	}

	if err != nil {
		slog.Info("error while broker discovering instances", "err", err)
	}
	return commands.Bind(b.HTTPResourceReflectHandler.ReflectorForPathFuncExcluding(b), bindings)
}
