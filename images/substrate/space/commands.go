package space

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"time"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	podmanprovisioner "github.com/ajbouh/substrate/images/substrate/provisioner/podman"
	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
	"github.com/containers/common/pkg/auth"
	"github.com/containers/image/v5/types"
	"github.com/containers/podman/v4/pkg/bindings/containers"
	"github.com/containers/podman/v4/pkg/bindings/images"
	"tractor.dev/toolkit-go/engine/fs"
)

type Void struct{}

var void Void = Void{}

type GetSpacesReturns struct {
	Spaces []activityspec.SpaceEntry `json:"spaces"`
}

var QueryCommand = handle.HTTPCommand(
	"space:query", "List all spaces",
	"GET /substrate/v1/spaces", "/substrate/v1/spaces/{space}",
	func(ctx context.Context,
		t *struct {
			SpaceQueriers []activityspec.SpaceQuerier
		},
		args struct{},
	) (GetSpacesReturns, error) {
		returns := GetSpacesReturns{}
		for _, lister := range t.SpaceQueriers {
			spaces, err := lister.QuerySpaces(ctx)
			if err != nil {
				return returns, err
			}
			returns.Spaces = append(returns.Spaces, spaces...)
		}

		return returns, nil
	})

type SpaceAsFS interface {
	SpaceAsFS(ctx context.Context, spaceID string, readOnly bool) (fs.FS, error)
}

type SpaceURLs interface {
	SpaceTreePathURLFunc(spaceID, path string) string
	SpaceURLFunc(spaceID string) string
}

type SpaceDeleter interface {
	DeleteSpace(ctx context.Context, spaceID string) error
}

var _ SpaceURLs = (*SpacesViaContainerFilesystems)(nil)
var _ SpaceDeleter = (*SpacesViaContainerFilesystems)(nil)
var _ SpaceAsFS = (*SpacesViaContainerFilesystems)(nil)

var DeleteCommand = handle.HTTPCommand(
	"space:delete", "Delete a space",
	"DELETE /substrate/v1/spaces/{space}", "/substrate/v1/spaces/{space}",
	func(ctx context.Context,
		t *struct {
			SpaceDeleter SpaceDeleter
		},
		args struct {
			Space string `json:"space" path:"space"`
		},
	) (Void, error) {
		err := t.SpaceDeleter.DeleteSpace(ctx, args.Space)
		if errors.Is(err, activityspec.ErrNotFound) {
			return void, &handle.HTTPStatusError{Status: http.StatusNotFound}
		}

		return void, err
	})

var GetCommand = handle.HTTPCommand(
	"space:get", "Get a space",
	"GET /substrate/v1/spaces/{space}", "/substrate/v1/spaces/{space}",
	func(ctx context.Context,
		t *struct {
			SpaceViewResolver activityspec.SpaceViewResolver
			SpaceURLs         SpaceURLs
		},
		args struct {
			Space string `json:"space" path:"space"`
		},
	) (*activityspec.SpaceEntry, error) {
		view, err := t.SpaceViewResolver.ResolveSpaceView(ctx, args.Space, false, false, "user")
		if errors.Is(err, activityspec.ErrNotFound) {
			return nil, &handle.HTTPStatusError{Status: http.StatusNotFound}
		}
		if err != nil {
			return nil, err
		}

		return &activityspec.SpaceEntry{
			SpaceID:   view.SpaceID,
			CreatedAt: view.CreatedAt,
			HREF:      t.SpaceURLs.SpaceURLFunc(view.SpaceID),
		}, nil
	})

var NewCommand = handle.Command(
	"space:new",
	"Make a new space",
	func(ctx context.Context,
		t *struct {
			SpaceViewResolver activityspec.SpaceViewResolver
			SpaceURLs         SpaceURLs
		},
		args struct {
			SpaceSpec     string `json:"spacespec"`
			ForceReadOnly bool   `json:"force_read_only"`
		},
	) (*activityspec.SpaceEntry, error) {
		view, err := t.SpaceViewResolver.ResolveSpaceView(ctx, args.SpaceSpec, args.ForceReadOnly, true, "user")
		if err != nil {
			return nil, err
		}

		return &activityspec.SpaceEntry{
			SpaceID: view.SpaceID,
			HREF:    t.SpaceURLs.SpaceURLFunc(view.SpaceID),
		}, nil
	})

// The commands below here should probably not be doing P.Connect directly. Bit of an abstraction violation there.

var LoginCommand = handle.Command(
	"space:login",
	"",
	func(ctx context.Context,
		t *struct {
			P *podmanprovisioner.P
		},
		args struct {
			Username string `json:"username"`
			Password string `json:"password"`
			Registry string `json:"registry"`
		}) (Void, error) {
		ctx, err := t.P.Connect(ctx)
		if err != nil {
			return void, err
		}

		return void, auth.Login(ctx, &types.SystemContext{}, &auth.LoginOptions{
			Password: args.Password,
			Username: args.Username,
		}, []string{args.Registry})
	})

type CommitReturns struct {
	ImageID string
	Commits []RefCommit
}

var CommitCommand = handle.HTTPCommand(
	"space:commit", "Commit and optionally push a space",
	"POST /substrate/v1/spaces/{space}/commit", "/substrate/v1/spaces/{space}",
	func(ctx context.Context,
		t *struct {
			P                             *podmanprovisioner.P
			SpacesViaContainerFilesystems *SpacesViaContainerFilesystems
		},
		args struct {
			SpaceID string `json:"space" path:"space"`

			Author  *string `json:"author"`
			Comment *string `json:"comment"`
			Squash  bool    `json:"squash"`

			Refs []string `json:"refs"`
			Push bool     `json:"push"`
		},
	) (CommitReturns, error) {
		ctx, err := t.P.Connect(ctx)
		if err != nil {
			return CommitReturns{}, err
		}

		containerID, _, err := t.SpacesViaContainerFilesystems.resolveExistingSpaceViewForSpaceID(ctx, args.SpaceID, false)
		if err != nil {
			return CommitReturns{}, err
		}

		if containerID == "" {
			return CommitReturns{}, activityspec.ErrNotFound
		}

		slog.Info("SpaceCommitRefs", "spaceID", args.SpaceID, "refs", args.Refs)

		var parsedRefs []Ref

		if args.Refs != nil {
			for _, ref := range args.Refs {
				parsedRef, err := ParseRef(ref)
				if err != nil {
					return CommitReturns{}, err
				}
				parsedRefs = append(parsedRefs, *parsedRef)
			}
		}

		// if parsedRefs == nil {
		// 	parsedRefs, err = t.P.SpaceRefs(ctx, args.SpaceID)
		// 	if err != nil {
		// 		return CommitReturns{}, err
		// 	}
		// }

		slog.Info("SpaceCommitRefs", "spaceID", args.SpaceID, "parsedRefs", parsedRefs)

		now := time.Now()

		co := &containers.CommitOptions{}
		if args.Squash {
			co.Squash = &args.Squash
		}
		co.Author = args.Author
		co.Comment = args.Comment

		idResponse, err := containers.Commit(ctx, containerID, co)
		if err != nil {
			return CommitReturns{}, err
		}
		slog.Info("SpaceCommitRefs.Commit", "spaceID", args.SpaceID, "idResponse", idResponse)

		imageID := idResponse.ID

		image, err := images.GetImage(ctx, imageID, nil)
		if err != nil {
			return CommitReturns{}, err
		}

		digest := image.Digest

		slog.Info("SpaceLastCommit", "spaceID", args.SpaceID, "image.RepoDigests", image.RepoDigests, "image.RepoTags", image.RepoTags, "digest", digest)

		var errs []error
		var refCommits []RefCommit
		var usedRefs []string
		for _, parsedRef := range parsedRefs {
			repo := parsedRef.Repo()
			tag := parsedRef.Tag(now)

			slog.Info("SpaceLastCommit.Tag", "imageID", imageID, "repo", repo, "tag", tag)
			err := images.Tag(ctx, imageID, tag, repo, nil)
			if err != nil {
				errs = append(errs, err)
				continue
			}
			refCommits = append(refCommits, RefCommit{
				Domain: parsedRef.Domain,
				Path:   parsedRef.Path,
				Tag:    tag,
				Digest: digest,
			})
			usedRefs = append(usedRefs, parsedRef.String())
		}

		if args.Push {
			for _, refCommit := range refCommits {
				err := images.Push(ctx, imageID, refCommit.String(), &images.PushOptions{
					// All *bool // All indicates whether to push all images related to the image list
					// Compress *bool // Compress tarball image layers when pushing to a directory using the 'dir' transport.
					// CompressionFormat *string // CompressionFormat is the format to use for the compression of the blobs
					// CompressionLevel *int // CompressionLevel is the level to use for the compression of the blobs
					// ForceCompressionFormat *bool // ForceCompressionFormat ensures that the compression algorithm set in CompressionFormat is used exclusively, and blobs of other compression algorithms are not reused.
					// AddCompression []string // Add existing instances with requested compression algorithms to manifest list
					// Format *string // Manifest type of the pushed image
					// Password *string // Password for authenticating against the registry.
					// ProgressWriter *io.Writer // ProgressWriter is a writer where push progress are sent. Since API handler for image push is quiet by default, WithQuiet(false) is necessary for the writer to receive progress messages.
					// SkipTLSVerify *bool SkipTLSVerify to skip HTTPS and certificate verification.
					// Username *string // Username for authenticating against the registry.
					// ManifestDigest *string // Manifest of the pushed image.  Set by images.Push.
					SkipTLSVerify: boolPtr(true),
				})
				if err != nil {
					errs = append(errs, err)
					continue
				}
			}
		}

		return CommitReturns{
			ImageID: imageID,
			Commits: refCommits,
		}, errors.Join(errs...)
	})
