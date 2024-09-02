package space

import (
	"fmt"
	"time"

	"github.com/distribution/reference"
	"github.com/opencontainers/go-digest"
)

type Ref struct {
	Domain    string
	Path      string
	TagPrefix string
}

func (r Ref) Repo() string {
	if r.Domain == "" {
		return ""
	}

	return r.Domain + "/" + r.Path
}

func (r Ref) Tag(t time.Time) string {
	suffix := t.UTC().Format("2006-01-02T150405Z")
	return r.TagPrefix + suffix
}

func (r Ref) String() string {
	return r.Repo() + ":" + r.TagPrefix
}

type RefCommit struct {
	Domain string
	Path   string
	Tag    string
	Digest digest.Digest
}

func (c RefCommit) String() string {
	return c.Domain + "/" + c.Path + "@" + c.Digest.String()
}

func ParseRef(ref string) (*Ref, error) {
	n, err := reference.ParseNormalizedNamed(ref)
	if err != nil {
		return nil, err
	}

	r := &Ref{
		Domain: reference.Domain(n),
		Path:   reference.Path(n),
	}
	if tagged, ok := n.(reference.Tagged); ok {
		r.TagPrefix = tagged.Tag()
	}
	return r, nil
}

func ParseRefCommitFromRepoDigestAndTag(repoDigest, repoTag string) (*RefCommit, error) {
	rd, err := reference.ParseNormalizedNamed(repoDigest)
	if err != nil {
		return nil, err
	}

	rt, err := reference.ParseNormalizedNamed(repoTag)
	if err != nil {
		return nil, err
	}

	domain := reference.Domain(rd)
	path := reference.Path(rd)

	if domain != reference.Domain(rt) || path != reference.Path(rt) {
		return nil, fmt.Errorf("repo digest (%s) and repo tag (%s) path and domain do not match", repoDigest, repoTag)
	}

	digest, ok := rd.(reference.Digested)
	if !ok {
		return nil, fmt.Errorf("repo digest %s (%T) does not implement reference.Digested", rd, rd)
	}

	tagged, ok := rt.(reference.Tagged)
	if !ok {
		return nil, fmt.Errorf("repo tag %s (%T) does not implement reference.Digested", rt, rt)
	}

	return &RefCommit{
		Domain: domain,
		Path:   path,
		Tag:    tagged.Tag(),
		Digest: digest.Digest(),
	}, nil
}
