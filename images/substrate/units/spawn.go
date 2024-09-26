package units

import (
	"context"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/ajbouh/substrate/images/substrate/defset"
	"github.com/ajbouh/substrate/images/substrate/provisioner"
	"github.com/ajbouh/substrate/images/substrate/space"
	"github.com/ajbouh/substrate/pkg/toolkit/links"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
)

type SpawnEventFields struct {
	Links map[string]links.Link `json:"links"`

	Type         string `json:"type"`
	HREF         string `json:"href"`
	ActivitySpec string `json:"activityspec"`
	Ephemeral    bool   `json:"ephemeral"`

	SpawnRequest  activityspec.ServiceSpawnRequest  `json:"spawn:request"`
	SpawnResponse activityspec.ServiceSpawnResponse `json:"spawn:response"`
}

type SpawnWithCurrentDefSet struct {
	DefSetLoader    Loader[*defset.DefSet]
	ProvisionDriver provisioner.Driver
	NotifyQueue     *notify.Queue

	SpaceURLs           space.SpaceURLs
	SpaceViewResolver   activityspec.SpaceViewResolver
	SpawnEventNotifiers []notify.Notifier[SpawnEventFields]
}

func (l *SpawnWithCurrentDefSet) Spawn(ctx context.Context, req *activityspec.ServiceSpawnRequest) (*activityspec.ServiceSpawnResponse, <-chan provisioner.Event, error) {
	s := l.DefSetLoader.Load()
	driver := l.ProvisionDriver

	serviceSpawnResolution, err := s.ResolveService(ctx, l.SpaceViewResolver, req)
	if err != nil {
		return nil, nil, err
	}

	serviceSpawnResponse, err := driver.Spawn(ctx, serviceSpawnResolution)
	if err != nil {
		return nil, nil, err
	}

	resolution := serviceSpawnResponse.ServiceSpawnResolution
	spec, _ := resolution.Format()

	ev := SpawnEventFields{
		SpawnRequest:  *req,
		SpawnResponse: *serviceSpawnResponse,

		ActivitySpec: spec,
		HREF:         "/" + spec + "/",
		Ephemeral:    resolution.ServiceInstanceDef.Ephemeral,

		Type:  "spawn",
		Links: map[string]links.Link{},
	}

	ev.Links["instance"] = links.Link{
		Rel:  "instance",
		HREF: ev.HREF,
	}

	for name, p := range resolution.Parameters {
		switch {
		case p.Space != nil:
			ev.Links["space/"+name] = links.Link{
				Rel:  "space",
				HREF: l.SpaceURLs.SpaceURLFunc(p.Space.SpaceID),
				Attributes: map[string]any{
					"space:id":        p.Space.SpaceID,
					"spawn:parameter": name,
				},
			}
		case p.Spaces != nil:
			// TODO
		}
	}

	notify.Later(l.NotifyQueue, l.SpawnEventNotifiers, ev)

	ch, err := l.ProvisionDriver.StatusStream(ctx, serviceSpawnResponse.Name)
	return serviceSpawnResponse, ch, err
}

func (l *SpawnWithCurrentDefSet) Shutdown(ctx context.Context, name string, reason error) error {
	return l.ProvisionDriver.Kill(ctx, name)
}

func (l *SpawnWithCurrentDefSet) Peek(ctx context.Context, req *activityspec.ServiceSpawnRequest) (*activityspec.ServiceSpawnResolution, error) {
	return l.DefSetLoader.Load().ResolveService(ctx, l.SpaceViewResolver, req)
}
