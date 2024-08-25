package activityspec

import (
	"context"
	"time"
)

type SpaceViewResolver interface {
	IsSpaceViewConcrete(v string, t ServiceSpawnParameterType) bool
	ResolveSpaceView(ctx context.Context, s string, forceReadOnly bool, ownerIfCreation string) (*SpaceView, error)
}

type SpaceView struct {
	SpaceID  string             `json:"space_id"`
	ReadOnly bool               `json:"is_read_only,omitempty"`
	Creation *SpaceViewCreation `json:"creation,omitempty"`

	Await  func() error                                             `json:"-"`
	Mounts func(targetPrefix string) []ServiceInstanceDefSpawnMount `json:"-"`
}

type SpaceViewCreation struct {
	Time time.Time `json:"time"`

	ForkedFromRef string `json:"forked_from_ref,omitempty"`
	ForkedFromID  string `json:"forked_from_id,omitempty"`
}
