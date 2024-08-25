package substratedb

import (
	"context"
	"time"

	"github.com/ajbouh/substrate/images/substrate/activityspec"

	ulid "github.com/oklog/ulid/v2"
)

func (s *DB) ServiceSpawned(
	ctx context.Context,
	req *activityspec.ServiceSpawnRequest,
	res *activityspec.ServiceSpawnResponse,
) error {
	views := &res.ServiceSpawnResolution
	usesSpaces := false
loop:
	for _, view := range views.Parameters {
		switch {
		case view.Space != nil:
			usesSpaces = true
			break loop
		case view.Spaces != nil:
			usesSpaces = true
			break loop
		}
	}

	// Return early if we're not using any spaces
	if !usesSpaces {
		return nil
	}

	var err error

	var spaces = []*Space{}
	entropy := ulid.DefaultEntropy()
	now := time.Now()
	nowTs := ulid.Timestamp(now)

	visitSpace := func(viewName string, multi bool, view *activityspec.SpaceView) error {
		spaceID := view.SpaceID

		if view.Creation != nil {
			spaces = append(spaces, &Space{
				Owner:         req.User,
				ID:            spaceID,
				ForkedFromRef: &view.Creation.ForkedFromRef,
				ForkedFromID:  &view.Creation.ForkedFromID,
				CreatedAt:     now,
			})
		}

		err := s.WriteCollectionMembership(ctx, &CollectionMembership{
			Owner:       "system",
			Name:        "spawn",
			SpaceID:     spaceID,
			ServiceSpec: req.ServiceName,
			CreatedAt:   now,
			IsPublic:    true,
			Attributes:  map[string]any{},
		})
		return err
	}

	for viewName, view := range views.Parameters {
		switch {
		case view.Space != nil:
			err = visitSpace(viewName, false, view.Space)
			if err != nil {
				return err
			}
		case view.Spaces != nil:
			for _, v := range *view.Spaces {
				err = visitSpace(viewName, true, &v)
				if err != nil {
					return err
				}
			}
		}
	}

	if res.ServiceSpawnResolution.ServiceInstanceDef.Ephemeral {
		return nil
	}

	eventULID := ulid.MustNew(nowTs, entropy)
	eventID := "ev-" + eventULID.String()
	viewspecReq := req.CanonicalFormat
	err = s.WriteEvent(ctx, &Event{
		ID:        eventID,
		Type:      "spawn",
		Timestamp: now,
		// Parameters:       req.ActivitySpec.Parameters,
		ActivitySpec: viewspecReq,
		User:         req.User,
		Service:      req.ServiceName,
		Response:     res,
	})
	if err != nil {
		return err
	}

	for _, sp := range spaces {
		err = s.WriteSpace(ctx, sp)
		if err != nil {
			return err
		}
	}

	viewspec, _ := views.Format()

	if !res.ServiceSpawnResolution.ServiceInstanceDef.Ephemeral && len(spaces) > 0 {
		err = s.WriteActivity(ctx, &Activity{
			ActivitySpec: viewspec,
			CreatedAt:    now,
			Service:      req.ServiceName,
		})
		if err != nil {
			return err
		}
	}

	return nil
}
