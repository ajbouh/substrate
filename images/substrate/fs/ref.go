package substratefs

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strings"
)

type SpaceID string
type CheckpointID string
type StaticRef string

func (s SpaceID) String() string {
	return string(s)
}

type Ref struct {
	CheckpointRef *CheckpointRef
	TipRef        *TipRef
	StaticRef     *StaticRef
}

func IsNilRef(r *Ref) bool {
	if r == nil {
		return true
	}
	if r.CheckpointRef == nil && r.TipRef == nil {
		return true
	}

	return false
}

func ParseRef(s string) (*Ref, error) {
	if s == "" {
		return nil, nil
	}

	// HACK
	var r Ref
	err := r.UnmarshalJSON([]byte(fmt.Sprintf("%q", s)))
	if err != nil {
		return nil, fmt.Errorf("error parsing ref %q: %w", s, err)
	}
	return &r, nil
}

func ParseTipRef(s string) (*TipRef, error) {
	if s == "" {
		return nil, nil
	}

	var tip TipRef
	err := tip.Parse(s)
	if err != nil {
		return nil, fmt.Errorf("error parsing tip ref %q: %w", s, err)
	}
	return &tip, nil
}

func (r *Ref) MarshalJSON() ([]byte, error) {
	if r.TipRef != nil {
		return r.TipRef.MarshalJSON()
	}
	if r.CheckpointRef != nil {
		return r.CheckpointRef.MarshalJSON()
	}
	if r.StaticRef != nil {
		return json.Marshal(*r.StaticRef)
	}
	return []byte(""), nil
}

func (r *Ref) UnmarshalJSON(data []byte) error {
	if bytes.HasSuffix(data, []byte("@tip\"")) || !bytes.Contains(data, []byte("@")) {
		r.TipRef = &TipRef{}
		return r.TipRef.UnmarshalJSON(data)
	}

	switch string(data) {
	case "\"omega\"":
		s := StaticRef("omega")
		r.StaticRef = &s
	}

	r.CheckpointRef = &CheckpointRef{}
	return r.CheckpointRef.UnmarshalJSON(data)
}

func (r *Ref) String() string {
	if r.TipRef != nil {
		return r.TipRef.String()
	}
	if r.CheckpointRef != nil {
		return r.CheckpointRef.String()
	}
	if r.StaticRef != nil {
		return string(*r.StaticRef)
	}

	return ""
}

type CheckpointRef struct {
	SpaceID      SpaceID
	CheckpointID CheckpointID
}

func (r *CheckpointRef) MarshalJSON() ([]byte, error) {
	return json.Marshal(string(r.SpaceID) + "@" + string(r.CheckpointID))
}

func (r *CheckpointRef) UnmarshalJSON(data []byte) error {
	var s string
	err := json.Unmarshal(data, &s)
	if err != nil {
		return err
	}

	return r.Parse(s)
}

func (r *CheckpointRef) Parse(s string) error {
	split := strings.SplitN(s, "@", 2)
	if len(split) < 2 {
		return fmt.Errorf("invalid checkpoint ref: %q", s)
	}

	r.SpaceID = SpaceID(split[0])
	r.CheckpointID = CheckpointID(split[1])
	return nil
}

func (r *CheckpointRef) String() string {
	return string(r.SpaceID) + "@" + string(r.CheckpointID)
}

func (r *TipRef) Parse(s string) error {
	split := strings.SplitN(s, "@", 2)
	if len(split) == 2 && split[1] != "tip" {
		return fmt.Errorf("invalid tip ref: %q", s)
	}

	r.SpaceID = SpaceID(split[0])
	return nil
}

func (r *TipRef) UnmarshalJSON(data []byte) error {
	var s string
	err := json.Unmarshal(data, &s)
	if err != nil {
		return fmt.Errorf("invalid tip ref: %q (%w)", string(data), err)
	}

	return r.Parse(s)
}

func (r *TipRef) MarshalJSON() ([]byte, error) {
	return json.Marshal(string(r.SpaceID) + "@tip")
}

func (r *TipRef) String() string {
	// Default to the shorter form, which lacks the "@tip"
	return string(r.SpaceID)
}

type TipRef struct {
	SpaceID SpaceID
}
