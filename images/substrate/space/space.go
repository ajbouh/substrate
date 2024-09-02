package space

import (
	"context"
	"fmt"
	"log/slog"
	"strings"

	"cuelang.org/go/cue"
	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/ajbouh/substrate/images/substrate/defset"
	"github.com/ajbouh/substrate/images/substrate/provisioner"
	podmanprovisioner "github.com/ajbouh/substrate/images/substrate/provisioner/podman"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
	"github.com/containers/podman/v4/pkg/bindings/containers"
	"github.com/containers/podman/v4/pkg/bindings/images"
	"github.com/containers/podman/v4/pkg/specgen"
	"github.com/oklog/ulid/v2"
	"golang.org/x/sync/singleflight"
)

const LabelSubstrateContainerRole = "substrate:role"
const LabelSubstrateSpace = "substrate:space"

type LabelSubstrateContainerRoleValue string

const LabelSubstrateContainerRoleSpace LabelSubstrateContainerRoleValue = "space"

const cntrPrefix = "cntr:"
const spaceIDPrefix = "sp-"
const spaceViewForkPrefix = "fork:"

type SpacesViaContainerFilesystems struct {
	P            *podmanprovisioner.P
	DefSetLoader notify.Loader[*defset.DefSet]

	containerLegacyGroup   singleflight.Group
	containerIDSpaceMounts *provisioner.OnceMap[string]
}

var _ activityspec.SpaceViewResolver = (*SpacesViaContainerFilesystems)(nil)
var _ activityspec.SpaceQuerier = (*SpacesViaContainerFilesystems)(nil)

func boolPtr(b bool) *bool {
	return &b
}

func (p *SpacesViaContainerFilesystems) Initialize() {
	p.containerIDSpaceMounts = provisioner.NewOnceMap[string]()
}

func (p *SpacesViaContainerFilesystems) createContainerSpecForSpace(imageID, spaceID string) (*specgen.SpecGenerator, string) {
	s := specgen.NewSpecGenerator(imageID, false)
	if spaceID == "" {
		u := ulid.Make()
		spaceID = spaceIDPrefix + u.String()
	}
	s.Name = spaceID
	s.Entrypoint = []string{"/bin/false"}
	s.Labels = map[string]string{
		podmanprovisioner.LabelSubstrateNamespace: p.P.Namespace,
		LabelSubstrateContainerRole:               string(LabelSubstrateContainerRoleSpace),
		LabelSubstrateSpace:                       spaceID,
	}
	return s, spaceID
}

func (p *SpacesViaContainerFilesystems) QuerySpaces(ctx context.Context) ([]activityspec.SpaceEntry, error) {
	ctx, err := p.P.Connect(ctx)
	if err != nil {
		return nil, err
	}

	existing, err := containers.List(ctx, &containers.ListOptions{
		All: boolPtr(true),
		Filters: map[string][]string{
			"label=" + LabelSubstrateContainerRole: []string{string(LabelSubstrateContainerRoleSpace)},
		},
	})
	if err != nil {
		return nil, err
	}

	results := make([]activityspec.SpaceEntry, 0, len(existing))
	for _, container := range existing {
		results = append(results, activityspec.SpaceEntry{
			SpaceID:   cntrPrefix + container.ID,
			CreatedAt: container.CreatedAt,
		})
	}

	return results, nil
}

func (p *SpacesViaContainerFilesystems) DeleteSpace(ctx context.Context, spaceID string) error {
	ctx, err := p.P.Connect(ctx)
	if err != nil {
		return err
	}

	containerID, _, err := p.resolveExistingSpaceViewForSpaceID(ctx, spaceID, false)
	if err != nil {
		return err
	}

	if containerID == "" {
		return activityspec.ErrNotFound
	}

	labels, err := spaceGetLabels(ctx, containerID)
	if err != nil {
		return err
	}

	if labels[LabelSubstrateContainerRole] != string(LabelSubstrateContainerRoleSpace) {
		return activityspec.ErrNotFound
	}

	_, err = containers.Remove(ctx, containerID, nil)
	return err
}

func (p *SpacesViaContainerFilesystems) resolveExistingSpaceViewForSpaceID(ctx context.Context, spaceID string, readOnly bool) (string, *activityspec.SpaceView, error) {
	slog.Info("resolveExistingSpaceViewForSpaceID", "spaceID", spaceID)

	if strings.HasPrefix(spaceID, spaceIDPrefix) {
		found, err := checkContainerIDExists(ctx, spaceID)
		if err != nil {
			return "", nil, err
		}
		if found {
			view, err := p.spaceViewFor(ctx, spaceID, spaceID, readOnly)
			return spaceID, view, err
		}

		// try importing from legacy space source
		view, err := p.resolveLegacySpaceView(ctx, spaceID, readOnly)
		return spaceID, view, err
	}

	if strings.HasPrefix(spaceID, cntrPrefix) {
		id := strings.TrimPrefix(spaceID, cntrPrefix)
		found, err := checkContainerIDExists(ctx, id)
		if err != nil {
			return "", nil, err
		}
		if !found {
			return "", nil, activityspec.ErrNotFound
		}

		view, err := p.spaceViewFor(ctx, id, spaceID, readOnly)
		return id, view, err
	}

	return "", nil, nil
}

func (p *SpacesViaContainerFilesystems) ResolveSpaceView(ctx context.Context, spaceID string, forceReadOnly bool, createAllowed bool, ownerIfCreation string) (*activityspec.SpaceView, error) {
	readOnly := forceReadOnly

	slog.Info("ResolveSpaceView", "request", spaceID)

	ctx, err := p.P.Connect(ctx)
	if err != nil {
		return nil, err
	}

	if spaceID == "" || spaceID == "scratch" || spaceID == "fork:scratch" {
		var newSpaceImage string
		err := p.DefSetLoader.Load().DecodeLookupPath(cue.MakePath(cue.Def("#var"), cue.Str("substrate"), cue.Str("new_space_image")), &newSpaceImage)
		if err != nil {
			return nil, err
		}
		spaceID = "fork:" + newSpaceImage
	}

	_, view, err := p.resolveExistingSpaceViewForSpaceID(ctx, spaceID, readOnly)
	if view != nil || err != nil {
		return view, err
	}

	if !createAllowed {
		return nil, activityspec.ErrNotFound
	}

	if strings.HasPrefix(spaceID, spaceViewForkPrefix) {
		baseID := strings.TrimPrefix(spaceID, spaceViewForkPrefix)
		if mightBeRemote(baseID) {
			imgs, err := images.Pull(ctx, baseID, &images.PullOptions{
				// AllTags: *bool // AllTags can be specified to pull all tags of an image. Note that this only works if the image does not include a tag.
				// Policy *string // Policy is the pull policy. Supported values are "missing", "never", "newer", "always". An empty string defaults to "always".
				// Password *string // Password for authenticating against the registry.
				// ProgressWriter *io.Writer // ProgressWriter is a writer where pull progress are sent.
				// SkipTLSVerify *bool // SkipTLSVerify to skip HTTPS and certificate verification.
				// Username *string // Username for authenticating against the registry.
			})
			if err != nil {
				return nil, err
			}

			baseID = imgs[0]
		}

		s, spaceID := p.createContainerSpecForSpace(baseID, "")
		c, err := containers.CreateWithSpec(ctx, s, nil)
		if err != nil {
			return nil, err
		}

		view, err := p.spaceViewFor(ctx, c.ID, spaceID, readOnly)
		if err == nil {
			view.Creation = &activityspec.SpaceViewCreation{
				ForkedFromRef: baseID,
			}
		}
		return view, err
	}

	return nil, fmt.Errorf("unknown type of space view: %#v", spaceID)
}

func (p *SpacesViaContainerFilesystems) spaceViewFor(ctx context.Context, containerID, spaceID string, readOnly bool) (*activityspec.SpaceView, error) {
	mountPath, err := p.resolveContainerIDMountPath(ctx, containerID)
	if err != nil {
		return nil, err
	}

	return &activityspec.SpaceView{
		SpaceID:  spaceID,
		ReadOnly: readOnly,
		Await: func() error {
			return nil
		},
		Mounts: func(targetPrefix string) []activityspec.ServiceInstanceDefSpawnMount {
			var mode = "rw"
			if readOnly {
				mode = "ro"
			}
			return []activityspec.ServiceInstanceDefSpawnMount{
				{
					Type:        "bind",
					Source:      mountPath,
					Destination: targetPrefix,
					Mode:        mode,
				},
			}
		},
	}, nil
}

func (p *SpacesViaContainerFilesystems) resolveContainerIDMountPath(ctx context.Context, containerID string) (string, error) {
	mount, err := p.containerIDSpaceMounts.LoadOrCompute(containerID, func() (string, error) {
		mounts, err := containers.GetMountedContainerPaths(ctx, nil)
		// slog.Info("containers.GetMountedContainerPaths", "containerID", containerID, "mounts", mounts, "err", err)
		if err != nil {
			return "", err
		}
		mount, ok := mounts[containerID]
		if ok {
			return mount, nil
		}

		// HACK to work around this error: "unmarshalling into (*string)(0xc0075cf630), data \"/var/lib/containers/storage/overlay/2ea72a5dee09036e2cdd2318066cc5399a5b0b98c434fddd9688a32fc2e36a56/merged\\n\": invalid character '/' looking for beginning of value"
		// ... don't use this result directly. keep the error around though in case we never find the mount.
		mount, mountErr := containers.Mount(ctx, containerID, nil)
		if mountErr == nil {
			return mount, nil
		}

		// recheck
		mounts, err = containers.GetMountedContainerPaths(ctx, nil)
		if err != nil {
			return "", err
		}
		mount, ok = mounts[containerID]
		if ok {
			return mount, nil
		}

		return "", mountErr
	})

	slog.Info("resolveMountedSpaceID", "containerID", containerID, "mount", mount, "err", err)
	return mount, err
}
