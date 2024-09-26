package event

import "github.com/oklog/ulid/v2"

type IDFunc func() ID

func MakeID() ID {
	return ID(ulid.Make())
}

func ParseID(s string) (ID, error) {
	id, err := ulid.Parse(s)
	return ID(id), err
}
