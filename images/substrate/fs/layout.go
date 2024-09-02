package substratefs

import (
	"context"
	"errors"
	"fmt"
	"io/fs"
	"os"
	"path"
	"path/filepath"
	"time"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	ulid "github.com/oklog/ulid/v2"
)

type Layout struct {
	RootPath string

	SpaceIDPrefix      string
	CheckpointIDPrefix string

	AliasesBasename     string
	SpacesBasename      string
	CheckpointsBasename string
	TipBasename         string

	ReadyBasename    string
	TreeBasename     string
	LockBasename     string
	InitialBasename  string
	RecentBasename   string
	PreviousBasename string
	MessageBasename  string

	OwnerBasename string
	AliasBasename string
}

// /aliases/$alias -> /space/$wsid
// /spaces/$wsid/
// ├── owner
// ├── aliases/
// │   ├── $alias -> /aliases/$alias
// ├── log/$ckptid/
// │   ├── tree/
// │   ├── message
// │   ├── previous
// │   ├── initial
// │   └── ready
// └── tip/
//     ├── tree/
//     ├── recent
//     ├── initial
//     └── ready

func NewLayout(root string) *Layout {
	return &Layout{
		RootPath: root,

		SpaceIDPrefix:      "sp-",
		CheckpointIDPrefix: "ckpt-",

		AliasesBasename:     "aliases",
		SpacesBasename:      "spaces",
		CheckpointsBasename: "log",
		TipBasename:         "tip",

		ReadyBasename:    "ready",
		TreeBasename:     "tree",
		LockBasename:     "lock",
		InitialBasename:  "initial",
		PreviousBasename: "previous",
		RecentBasename:   "recent",
		MessageBasename:  "message",

		AliasBasename: "alias",
		OwnerBasename: "owner",
	}
}

var _ activityspec.SpaceQuerier = (*Layout)(nil)

func (l *Layout) QuerySpaces(ctx context.Context) ([]activityspec.SpaceEntry, error) {
	entries, err := os.ReadDir(path.Join(l.RootPath, l.SpacesBasename))
	if err != nil {
		return nil, err
	}

	spaceIDs := make([]activityspec.SpaceEntry, 0, len(entries))
	for _, entry := range entries {
		if entry.IsDir() {
			info, err := entry.Info()
			if err != nil {
				return spaceIDs, err
			}
			spaceIDs = append(spaceIDs, activityspec.SpaceEntry{
				SpaceID:   entry.Name(),
				CreatedAt: info.ModTime().Format(time.RFC3339Nano),
			})
		}
	}

	return spaceIDs, nil
}

func (l *Layout) AliasPath(alias string) string {
	return path.Join(l.RootPath, l.AliasesBasename, alias)
}

func (l *Layout) SpaceBasePath(spaceID SpaceID) string {
	return path.Join(l.RootPath, l.SpacesBasename, string(spaceID))
}

func (l *Layout) SpaceAliasPath(spaceID SpaceID, alias string) string {
	return path.Join(l.SpaceBasePath(spaceID), l.AliasBasename, alias)
}

func (l *Layout) SpaceAliasesBasePath(spaceID SpaceID) string {
	return path.Join(l.SpaceBasePath(spaceID), l.AliasBasename)
}

func (l *Layout) SpaceOwnerPath(spaceID SpaceID) string {
	return path.Join(l.SpaceBasePath(spaceID), l.OwnerBasename)
}

func (l *Layout) CheckpointBasePath(r *CheckpointRef) string {
	return path.Join(l.SpaceBasePath(r.SpaceID), l.CheckpointsBasename, string(r.CheckpointID))
}

func (l *Layout) TipBasePath(r *TipRef) string {
	return path.Join(l.SpaceBasePath(r.SpaceID), l.TipBasename)
}

func (l *Layout) TipMessagePath(r *TipRef) string {
	return path.Join(l.TipBasePath(r), l.MessageBasename)
}

func (l *Layout) CheckpointMessagePath(r *CheckpointRef) string {
	return path.Join(l.CheckpointBasePath(r), l.MessageBasename)
}

func (l *Layout) CheckpointReadyPath(r *CheckpointRef) string {
	return path.Join(l.CheckpointBasePath(r), l.ReadyBasename)
}

func (l *Layout) CheckpointLockPath(r *CheckpointRef) string {
	return path.Join(l.CheckpointBasePath(r), l.LockBasename)
}

func (l *Layout) TipReadyPath(r *TipRef) string {
	return path.Join(l.TipBasePath(r), l.ReadyBasename)
}

func (l *Layout) TipTreePath(r *TipRef) string {
	return path.Join(l.TipBasePath(r), l.TreeBasename)
}

func (l *Layout) CheckpointTreePath(r *CheckpointRef) string {
	return path.Join(l.CheckpointBasePath(r), l.TreeBasename)
}

func (l *Layout) TipRecentPath(r *TipRef) string {
	return path.Join(l.TipBasePath(r), l.RecentBasename)
}

func (l *Layout) CheckpointPreviousPath(r *CheckpointRef) string {
	return path.Join(l.CheckpointBasePath(r), l.PreviousBasename)
}

func (l *Layout) TipInitialPath(r *TipRef) string {
	return path.Join(l.TipBasePath(r), l.InitialBasename)
}

func (l *Layout) CheckpointInitialPath(r *CheckpointRef) string {
	return path.Join(l.CheckpointBasePath(r), l.InitialBasename)
}

func (l *Layout) TipLockPath(r *TipRef) string {
	return path.Join(l.TipBasePath(r), l.LockBasename)
}

func (l *Layout) ResolveAlias(alias string) (*TipRef, error) {
	// We win the alias if our ln succeeds. If it fails then read the alias and use that.
	aliasPath := l.AliasPath(alias)
	target, err := os.Readlink(aliasPath)
	if errors.Is(err, os.ErrNotExist) {
		return nil, nil
	} else if err != nil {
		return nil, fmt.Errorf("error reading alias: %w", err)
	}

	targetDir := filepath.Dir(target)
	if targetDir != path.Join(l.RootPath, l.SpacesBasename) {
		return nil, fmt.Errorf("target is not a valid space: %s", targetDir)
	}

	spaceID := SpaceID(filepath.Base(target))
	ref := &TipRef{SpaceID: spaceID}
	return ref, nil
}

func (l *Layout) declareAlias(alias string, ref *TipRef) (bool, error) {
	// We win the alias if our ln succeeds. If it fails then read the alias and use that.
	aliasPath := l.AliasPath(alias)
	err := os.Symlink(l.SpaceBasePath(ref.SpaceID), aliasPath)
	if os.IsExist(err) {
		return false, nil
	}

	if err != nil {
		return false, err
	}

	// Since aliases are newer than some substratefs installations, ensure basedir for alias exists.
	err = os.Mkdir(l.SpaceAliasesBasePath(ref.SpaceID), 0644)
	if errors.Is(err, os.ErrExist) {
		err = nil
	}

	err = os.Symlink(aliasPath, l.SpaceAliasPath(ref.SpaceID, alias))
	return true, err
}

func (l *Layout) DeclareTipFromScratchOrAlias(tip *TipRef, owner, alias string) (*TipRef, time.Time, error) {
	var err error
	var at time.Time

	tipWasNil := tip == nil
	if tipWasNil {
		if alias != "" {
			tip, err = l.ResolveAlias(alias)
			if tip != nil || err != nil {
				return tip, at, err
			}
		}
		tip, at = l.NewTipRef()
	}

	err = l.declareTip(tip, nil, nil, owner, alias)
	if err != nil {
		if tipWasNil && errors.Is(err, os.ErrExist) {
			// we expect declareTip to try to reserve the alias first if it can, to avoid leaking
			tip, err = l.ResolveAlias(alias)
		}
		return tip, at, err
	}

	return tip, at, nil
}

func (l *Layout) DeclareTipFromCheckpoint(tip *TipRef, ckpt *CheckpointRef, owner, alias string) (*TipRef, time.Time, error) {
	var err error

	var at time.Time
	if tip == nil {
		tip, at = l.NewTipRef()
	}

	err = l.declareTip(tip, ckpt, nil, owner, alias)
	if err != nil {
		return nil, at, err
	}

	return tip, at, nil
}

func (l *Layout) DeclareCheckpointFromTip(tip *TipRef) (*CheckpointRef, error) {
	var err error

	ckpt, err := l.newCheckpoint(tip.SpaceID)
	if err != nil {
		return nil, err
	}

	initial, err := readCheckpointRef(l.TipInitialPath(tip))
	if err != nil {
		return nil, err
	}

	recent, err := readCheckpointRef(l.TipRecentPath(tip))
	if err != nil {
		return nil, err
	}

	err = l.declareCheckpoint(ckpt, initial, recent)
	if err != nil {
		return nil, err
	}

	return ckpt, nil
}

func (l *Layout) DeclareTipFromTip(tip, base *TipRef, owner, alias string) (*TipRef, time.Time, error) {
	ckpt, err := l.DeclareCheckpointFromTip(base)
	if err != nil {
		return nil, time.Time{}, err
	}

	return l.DeclareTipFromCheckpoint(tip, ckpt, owner, alias)
}

func readCheckpointRef(path string) (*CheckpointRef, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	if len(data) == 0 {
		return nil, nil
	}

	var ckpt CheckpointRef
	err = ckpt.Parse(string(data))
	if err != nil {
		return nil, err
	}
	return &ckpt, nil
}

func (l *Layout) EnsureCheckpointReady(r *CheckpointRef) error {
	// Check if ready
	// If so, return
	// Otherwise,
	// Lock checkpoint.
	// Look at recent tip. If recent tip is not ready, fail.
	// Lock tip non-exclusively
	// Sync tip to checkpoint
	// Mark ready

	var ok bool
	var err error
	ok, err = l.IsCheckpointReady(r)
	if err != nil {
		return err
	}
	if ok {
		return nil
	}

	ckptClaim, ok, err := tryLock(l.CheckpointLockPath(r), true)
	if !ok || err != nil {
		if err != nil {
			return err
		}
		return logError("error EnsureCheckpointReady action=lock ref=%s (checkpoint already locked)", r.String())
	}
	defer ckptClaim.Release()

	tip := &TipRef{r.SpaceID}
	ok, err = l.IsTipReady(tip)
	if err != nil {
		return err
	}
	if !ok {
		return logError("error EnsureCheckpointReady action=IsTipReady ref=%s (tip not ready, can't sync checkpoint from it)", r.String())
	}

	return logError("error EnsureCheckpointReady not fully implemented for local substratefs. TODO.")

	// err = juicefs.Sync(l.TipTreePath(tip), l.CheckpointTreePath(r))
	// if err != nil {
	// 	return logError("error EnsureCheckpointReady action=sync ref=%s (%w)", r.String(), err)
	// }

	// err = l.markCheckpointReady(r)
	// if err != nil {
	// 	return logError("error EnsureCheckpointReady action=markCheckpointReady ref=%s (%w)", r.String(), err)
	// }

	// return nil
}

func (l *Layout) EnsureTipReady(r *TipRef) error {
	var ok bool
	var err error

	if ok, err = l.IsTipReady(r); ok || err != nil {
		if err != nil {
			// if tipClaim != nil {
			// 	defer tipClaim.Release()
			// }
			return logError("error EnsureTipReady action=IsTipReady ref=%s (%w)", r.String(), err)
		}

		return nil
	}

	initialCkpt, err := readCheckpointRef(l.TipInitialPath(r))
	if err != nil {
		return logError("error EnsureTipReady action=readCheckpointRef ref=%s path=%s (%w)", r.String(), l.TipInitialPath(r), err)
	}

	if initialCkpt != nil {
		err = l.EnsureCheckpointReady(initialCkpt)
		if err != nil {
			// defer tipClaim.Release()
			return logError("error EnsureTipReady action=EnsureCheckpointReady ref=%s (%w)", r.String(), err)
		}

		return logError("error EnsureCheckpointReady not fully implemented for local substratefs. TODO.")

		// err = juicefs.Sync(l.CheckpointTreePath(initialCkpt), l.TipTreePath(r))
		// if err != nil {
		// 	// defer tipClaim.Release()
		// 	return logError("error EnsureTipReady action=Sync ref=%s (%w)", r.String(), err)
		// }
	}

	recentCkpt, err := readCheckpointRef(l.TipRecentPath(r))
	if err != nil {
		return logError("error EnsureTipReady action=readCheckpointRef ref=%s path=%s (%w)", r.String(), l.TipRecentPath(r), err)
	}

	if recentCkpt != nil {
		err = l.EnsureCheckpointReady(recentCkpt)
		if err != nil {
			// defer tipClaim.Release()
			return logError("error EnsureTipReady action=EnsureCheckpointReady ref=%s (%w)", r.String(), err)
		}
	}

	err = l.markTipReady(r)
	if err != nil {
		// defer tipClaim.Release()
		return logError("error EnsureTipReady action=markTipReady ref=%s (%w)", r.String(), err)
	}

	return nil
}

// func (l *Layout) SaveNewCheckpoint(r *TipRef) (*CheckpointRef, error) {
// 	claim, ok, err := tryLock(l.TipLockPath(r), true)
// 	if !ok || err != nil {
// 		if err != nil {
// 			return nil, err
// 		}
// 		return nil, fmt.Errorf("already locked")
// 	}
// 	defer claim.Release()

// 	ref, err := l.saveNewCheckpoint(r)
// 	if err != nil {
// 		return nil, err
// 	}

// 	return ref, err
// }

func (l *Layout) NewCheckpointRef(w SpaceID) *CheckpointRef {
	return &CheckpointRef{
		SpaceID:      w,
		CheckpointID: CheckpointID(l.CheckpointIDPrefix + ulid.Make().String()),
	}
}

func (l *Layout) NewTipRef() (*TipRef, time.Time) {
	u := ulid.Make()
	return &TipRef{
		SpaceID: SpaceID(l.SpaceIDPrefix + u.String()),
	}, ulid.Time(u.Time())
}

func (l *Layout) IsTipDefined(r *TipRef) (bool, error) {
	if _, err := os.Stat(l.TipBasePath(r)); err == nil {
		return true, nil
	} else if errors.Is(err, os.ErrNotExist) {
		return false, nil
	} else {
		return false, err
	}
}

func (l *Layout) IsCheckpointReady(r *CheckpointRef) (bool, error) {
	ready := l.CheckpointReadyPath(r)
	if _, err := os.Stat(ready); err == nil {
		return true, nil
	} else if errors.Is(err, os.ErrNotExist) {
		return false, nil
	} else {
		return false, err
	}
}

func (l *Layout) IsTipReady(r *TipRef) (bool, error) {
	ready := l.TipReadyPath(r)
	if _, err := os.Stat(ready); err == nil {
		return true, nil
	} else if errors.Is(err, os.ErrNotExist) {
		return false, nil
	} else {
		return false, err
	}
}

func mkdirAll(path string) error {
	var err error
	defer func() {
		logDebugf("mkdirAll path=%s err=%s", path, err)
	}()

	err = os.MkdirAll(path, 0o755)
	return err
}

func writeFile(path string, data []byte) error {
	var err error
	var n int
	defer func() {
		logDebugf("writeFile path=%s data=%q len=%d n=%d err=%s", path, string(data), len(data), n, err)
	}()

	f, err := os.OpenFile(path, os.O_EXCL|os.O_CREATE|os.O_RDWR, fs.FileMode(0o444))
	if err != nil {
		return err
	}

	n, err = f.Write(data)
	return err
}

func (l *Layout) newCheckpoint(id SpaceID) (*CheckpointRef, error) {
	var err error

	w := l.NewCheckpointRef(id)
	err = mkdirAll(l.CheckpointBasePath(w))
	if err != nil {
		return nil, err
	}

	return w, nil
}

func (l *Layout) markCheckpointReady(r *CheckpointRef) error {
	return writeFile(l.CheckpointReadyPath(r), []byte{})
}

func (l *Layout) markTipReady(r *TipRef) error {
	return writeFile(l.TipReadyPath(r), []byte{})
}

func (l *Layout) declareTip(r *TipRef, initial, recent *CheckpointRef, owner, alias string) error {
	var err error

	if alias != "" {
		var ok bool
		ok, err = l.declareAlias(alias, r)
		if err != nil {
			return err
		}
		if !ok {
			return os.ErrExist
		}
	}

	err = mkdirAll(l.TipTreePath(r))
	if err != nil {
		return err
	}

	var ownerData = []byte(owner)
	err = writeFile(l.SpaceOwnerPath(r.SpaceID), ownerData)
	if err != nil {
		return err
	}

	var initialData []byte
	if initial != nil {
		initialData = []byte(initial.String())
	}
	err = writeFile(l.TipInitialPath(r), initialData)
	if err != nil {
		return err
	}

	var recentData []byte
	if recent != nil {
		recentData = []byte(recent.String())
	}
	err = writeFile(l.TipRecentPath(r), recentData)
	if err != nil {
		return err
	}

	return nil
}

func (l *Layout) declareCheckpoint(r *CheckpointRef, initial, previous *CheckpointRef) error {
	var err error

	err = mkdirAll(l.CheckpointTreePath(r))
	if err != nil {
		return err
	}
	var initialData []byte
	if initial != nil {
		initialData = []byte(initial.String())
	}
	err = writeFile(l.CheckpointInitialPath(r), initialData)
	if err != nil {
		return err
	}

	var previousData []byte
	if previous != nil {
		previousData = []byte(previous.String())
	}
	err = writeFile(l.CheckpointPreviousPath(r), previousData)
	if err != nil {
		return err
	}

	return nil
}
