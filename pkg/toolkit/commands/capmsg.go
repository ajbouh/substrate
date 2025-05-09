package commands

import (
	"fmt"
)

type CapMsg struct {
}

var _ Cap = (*CapMsg)(nil)

func (a *CapMsg) Apply(env Env, d Fields) (Fields, error) {
	var err error

	msgIn, ok, err := MaybeGetPath[Bindings](d, "pre")
	if err != nil {
		return nil, fmt.Errorf("error getting pre: %w", err)
	}

	if !ok {
		msgIn, _, err = MaybeGetPath[Bindings](d, "msg_in")
		if err != nil {
			return nil, fmt.Errorf("error getting msg_in: %w", err)
		}
	}

	d, err = msgIn.PluckInto(d, d)
	if err != nil {
		return nil, fmt.Errorf("error plucking input data: %w", err)
	}

	msg, err := GetPath[Fields](d, "msg")
	if err != nil {
		return nil, fmt.Errorf("error getting msg: %w", err)
	}

	d["msg"], err = env.Apply(nil, msg)
	if err != nil {
		return nil, fmt.Errorf("error running nested msg: %w", err)
	}

	msgOut, ok, err := MaybeGetPath[Bindings](d, "ret")
	if err != nil {
		return nil, fmt.Errorf("error getting ret: %w", err)
	}
	if !ok {
		msgOut, _, err = MaybeGetPath[Bindings](d, "msg_out")
		if err != nil {
			return nil, fmt.Errorf("error getting msg_out: %w", err)
		}
	}

	d, err = msgOut.PluckInto(Fields{}, d)
	return d, err
}
