package activityspec

import (
	"context"
	"errors"
)

var (
	ErrNotFound = errors.New("space not found")
)

type SpaceViewResolver interface {
	IsSpaceViewConcrete(v string, t ServiceSpawnParameterType) bool
	ResolveSpaceView(ctx context.Context, s string, forceReadOnly bool, createAllowed bool, ownerIfCreation string) (*SpaceView, error)
}

type SpaceQuerier interface {
	QuerySpaces(ctx context.Context) ([]SpaceEntry, error)
}

type SpaceEntry struct {
	SpaceID   string `json:"space_id"`
	CreatedAt string `json:"created_at"`
}

type SpaceView struct {
	SpaceID   string `json:"space_id"`
	CreatedAt string `json:"created_at"`

	ReadOnly bool               `json:"is_read_only,omitempty"`
	Creation *SpaceViewCreation `json:"creation,omitempty"`

	Await  func() error                                             `json:"-"`
	Mounts func(targetPrefix string) []ServiceInstanceDefSpawnMount `json:"-"`
}

type SpaceViewCreation struct {
	ForkedFromRef string `json:"forked_from_ref,omitempty"`
	ForkedFromID  string `json:"forked_from_id,omitempty"`
}
