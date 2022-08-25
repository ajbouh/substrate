package substratefs

import (
	"fmt"
	"os"
	"time"
)

type SpaceViewCreation struct {
	Time time.Time
	Base *Ref
}

type SpaceView struct {
	layout *Layout

	Tip *TipRef

	Time       time.Time
	IsReadOnly bool

	Creation *SpaceViewCreation
}

func (l *Layout) NewSpaceView(tip *TipRef, base *Ref, readOnly, checkpointExistingFirst bool, owner, alias string) (*SpaceView, error) {
	// If BaseRef is empty, create fresh
	// If BaseRef is @tip, define implied checkpoint
	// Otherwise it must be a checkpoint
	var err error
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
		if owner == "" {
			return nil, fmt.Errorf("can't create with nil owner")
		}

		if IsNilRef(base) {
			tip, at, err = l.DeclareTipFromScratch(tip, owner, alias)
		} else if base.TipRef != nil {
			if base != nil && readOnly {
				if checkpointExistingFirst {
					_, err = l.DeclareCheckpointFromTip(base.TipRef)
				}
				tip = base.TipRef
				isNew = false
			} else {
				// TODO Use default alias from base

				tip, at, err = l.DeclareTipFromTip(tip, base.TipRef, owner, alias)
			}
		} else if base.CheckpointRef != nil {
			// TODO Use default alias from base

			tip, at, err = l.DeclareTipFromCheckpoint(tip, base.CheckpointRef, owner, alias)
		}

		if err != nil {
			return nil, err
		}
	}

	if at.IsZero() {
		at = time.Now()
	}

	var creation *SpaceViewCreation
	if isNew {
		creation = &SpaceViewCreation{
			Time: at,
			Base: base,
		}
	}

	return &SpaceView{
		layout: l,

		Time: at,
		Tip:  tip,

		IsReadOnly: readOnly,
		Creation:   creation,
	}, nil
}

func (v *SpaceView) TreePath() string {
	fmt.Printf("TreePath() v=%#v\n", v)
	mountpoint := v.layout.TipTreePath(v.Tip)
	return mountpoint
}

func (v *SpaceView) OwnerFilePath() string {
	return v.layout.SpaceOwnerPath(v.Tip.SpaceID)
}

func (v *SpaceView) AliasFilePath() string {
	return v.layout.SpaceAliasPath(v.Tip.SpaceID)
}

func (v *SpaceView) Owner() (string, error) {
	b, err := os.ReadFile(v.OwnerFilePath())
	if err != nil {
		return "", err
	}

	return string(b), nil
}

func (v *SpaceView) Alias() (string, error) {
	b, err := os.ReadFile(v.AliasFilePath())
	if err != nil {
		return "", err
	}

	return string(b), nil
}

func (v *SpaceView) Await() error {
	logDebugf("mount tip=%s", v.Tip)

	err := v.layout.EnsureTipReady(v.Tip)
	if err != nil {
		return err
	}

	return nil
}
