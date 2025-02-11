package commands

import (
	"fmt"
)

type CapMsg struct {
}

var _ Cap = (*CapMsg)(nil)

func (a *CapMsg) Apply(env Env, d Fields) (Fields, error) {
	var err error

	msgIn, err := GetPath[Bindings](d, "pre")
	if err != nil {
		return nil, fmt.Errorf("error plucking input data: %w", err)
	}

	if msgIn == nil {
		msgIn, err = GetPath[Bindings](d, "msg_in")
		if err != nil {
			return nil, fmt.Errorf("error plucking input data: %w", err)
		}
	}

	msgOut, err := GetPath[Bindings](d, "ret")
	if err != nil {
		return nil, fmt.Errorf("error plucking input data: %w", err)
	}
	if msgOut == nil {
		msgOut, err = GetPath[Bindings](d, "msg_out")
		if err != nil {
			return nil, fmt.Errorf("error plucking input data: %w", err)
		}
	}

	d, err = msgIn.PluckInto(d, d)
	if err != nil {
		return nil, fmt.Errorf("error plucking input data: %w", err)
	}

	msg, err := GetPath[Fields](d, "msg")
	if err != nil {
		return nil, fmt.Errorf("error plucking input data: %w", err)
	}

	postData, err := env.Apply(nil, msg)
	if err != nil {
		return nil, fmt.Errorf("error running nested msg: %w", err)
	}

	return msgOut.PluckInto(Fields{}, postData)
}
