package substratefs

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
)

var _ activityspec.SpaceViewResolver = (*Layout)(nil)

func (l *Layout) IsSpaceViewConcrete(v string, t activityspec.ServiceSpawnParameterType) bool {
	switch t {
	case activityspec.ServiceSpawnParameterTypeSpace:
		return v != "" && !strings.HasPrefix(string(v), spaceViewForkPrefix)
	case activityspec.ServiceSpawnParameterTypeSpaces:
		for _, s := range strings.Split(v, activityspec.SpaceViewMultiSep) {
			if string(s) == "" || strings.HasPrefix(string(s), spaceViewForkPrefix) {
				return false
			}
		}
	}

	return true
}

type SpaceViewRequest struct {
	SpaceAlias              *string `json:"space_alias,omitempty"`
	SpaceID                 string  `json:"space,omitempty" form:"space,omitempty"`
	SpaceBaseRef            *string `json:"space_base_ref,omitempty" form:"space_base_ref,omitempty"`
	ReadOnly                bool    `json:"read_only,omitempty" form:"read_only,omitempty"`
	CheckpointExistingFirst bool    `json:"checkpoint_existing_first,omitempty" form:"checkpoint_existing_first,omitempty"`
}

const spaceViewForkPrefix = "~"
const spaceViewAliasPrefix = "$"

// const spaceViewPlaceholder = "^"

func ParseViewRequest(v string, forceReadOnly bool) *SpaceViewRequest {
	readOnly := false
	if strings.HasSuffix(v, ":ro") {
		v = strings.TrimSuffix(v, ":ro")
		readOnly = true
	}
	readOnly = forceReadOnly
	if strings.HasPrefix(v, spaceViewForkPrefix) {
		baseRef := strings.TrimPrefix(v, spaceViewForkPrefix)
		return &SpaceViewRequest{
			SpaceBaseRef: &baseRef,
			ReadOnly:     readOnly,
		}
	}
	if strings.HasPrefix(v, spaceViewAliasPrefix) {
		alias := strings.TrimPrefix(v, spaceViewAliasPrefix)
		return &SpaceViewRequest{
			SpaceAlias: &alias,
			ReadOnly:   readOnly,
		}
	}

	return &SpaceViewRequest{
		SpaceID:  v,
		ReadOnly: readOnly,
	}
}

func (l *Layout) ResolveSpaceView(ctx context.Context, s string, forceReadOnly bool, createAllowed bool, ownerIfCreation string) (*activityspec.SpaceView, error) {
	var err error

	viewRequest := ParseViewRequest(s, forceReadOnly)
	spaceRef := viewRequest.SpaceID
	baseRef := ""
	if viewRequest.SpaceBaseRef != nil {
		baseRef = *viewRequest.SpaceBaseRef
	}
	alias := ""
	readOnly := viewRequest.ReadOnly
	checkpointExistingFirst := viewRequest.CheckpointExistingFirst

	tip, err := ParseTipRef(spaceRef)
	if err != nil {
		return nil, fmt.Errorf("error parsing tip=%s err=%s", spaceRef, err)
	}

	var base *Ref
	if baseRef != "" && baseRef != "scratch" {
		base, err = ParseRef(baseRef)
		if err != nil {
			return nil, fmt.Errorf("error parsing base=%s err=%s", baseRef, err)
		}
	}

	// If BaseRef is empty, create fresh
	// If BaseRef is @tip, define implied checkpoint
	// Otherwise it must be a checkpoint
	var tipExists bool
	var at time.Time
	var isNew bool
	var initialTip *TipRef = tip

	defer func() {
		logDebugf("NewFacet initialTip=%s tip=%s base=%s readOnly=%#v checkpointExistingFirst=%#v tipExists=%#v isNew=%#v err=%s", initialTip, tip, base, readOnly, checkpointExistingFirst, tipExists, isNew, err)
	}()

	// Only create if tip doesn't exist
	if tip != nil {
		tipExists, err = l.IsTipDefined(tip)
		if err != nil {
			return nil, err
		}
	}

	isNew = !tipExists

	if !tipExists {
		if ownerIfCreation == "" {
			return nil, fmt.Errorf("can't create with nil owner")
		}

		if IsNilRef(base) {
			tip, at, err = l.DeclareTipFromScratchOrAlias(tip, ownerIfCreation, alias)
		} else if base.TipRef != nil {
			if base != nil && readOnly {
				if checkpointExistingFirst {
					_, err = l.DeclareCheckpointFromTip(base.TipRef)
				}
				tip = base.TipRef
				isNew = false
			} else {
				// TODO Use default alias from base

				tip, at, err = l.DeclareTipFromTip(tip, base.TipRef, ownerIfCreation, alias)
			}
		} else if base.CheckpointRef != nil {
			// TODO Use default alias from base

			tip, at, err = l.DeclareTipFromCheckpoint(tip, base.CheckpointRef, ownerIfCreation, alias)
		}

		if err != nil {
			return nil, err
		}
	}

	if at.IsZero() {
		at = time.Now()
	}

	var creation *activityspec.SpaceViewCreation
	if isNew {
		creation = &activityspec.SpaceViewCreation{}

		if base != nil {
			if base.CheckpointRef != nil {
				creation.ForkedFromRef = base.CheckpointRef.String()
				creation.ForkedFromID = base.CheckpointRef.SpaceID.String()
			}
			if base.TipRef != nil {
				creation.ForkedFromRef = base.TipRef.String()
				creation.ForkedFromID = base.TipRef.SpaceID.String()
			}
		}
	}

	return &activityspec.SpaceView{
		SpaceID: tip.SpaceID.String(),

		ReadOnly: readOnly,
		Creation: creation,

		Await: func() error {
			logDebugf("mount tip=%s", tip)
			err := l.EnsureTipReady(tip)
			if err != nil {
				return err
			}

			return nil
		},
		Mounts: func(targetPrefix string) []activityspec.ServiceInstanceDefSpawnMount {
			treeMountMode := "rw"
			if readOnly {
				treeMountMode = "ro"
			}

			treePath := l.TipTreePath(tip)
			ownerFilePath := l.SpaceOwnerPath(tip.SpaceID)

			return []activityspec.ServiceInstanceDefSpawnMount{
				{
					Type:        "bind",
					Source:      treePath,
					Destination: targetPrefix + "/tree",
					Mode:        []string{treeMountMode, "z"},
				},
				{
					Type:        "bind",
					Source:      ownerFilePath,
					Destination: targetPrefix + "/owner",
					Mode:        []string{"ro", "z"},
				},
			}
		},
	}, nil
}
