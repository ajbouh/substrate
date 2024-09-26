package event

import (
	"encoding/hex"
	"encoding/json"
	"errors"

	"github.com/oklog/ulid/v2"
)

// includes abstract counter, for ordering events
type ID = ulid.ULID

// should implement these interfaces. not sure how to demand that's the case though.
// var _ sql.Scanner = (ID)(nil)
// var _ encoding.TextMarshaler = (ID)(nil)
// var _ encoding.TextUnmarshaler = (ID)(nil)
// var _ encoding.BinaryMarshaler = (ID)(nil)
// var _ encoding.BinaryUnmarshaler = (ID)(nil)

var zeroValueID = ID{}

func IsZeroID(id ID) bool {
	return id.Compare(zeroValueID) == 0
}

type SHA256Digest [32]byte

func (m SHA256Digest) MarshalJSON() ([]byte, error) {
	return json.Marshal(hex.EncodeToString(m[:]))
}

// once an event has been stored, it is assigned an id
type Event struct {
	ID    ID `json:"id"`
	At    ID `json:"at"`
	Since ID `json:"since"`

	DataSize   int          `json:"data_size,omitempty"`
	DataSHA256 SHA256Digest `json:"data_sha256,omitempty"`

	FieldsSize   int          `json:"fields_size,omitempty"`
	FieldsSHA256 SHA256Digest `json:"fields_sha256,omitempty"`

	Payload json.RawMessage `json:"fields"`
}

func Unmarshal[T any](evts []Event, strict bool) ([]T, error) {
	ts := make([]T, 0, len(evts))
	var errs []error
	for _, event := range evts {
		var t T
		err := json.Unmarshal(event.Payload, &t)
		if err != nil {
			if strict {
				return ts, err
			} else {
				errs = append(errs, err)
				continue
			}
		}
		ts = append(ts, t)
	}

	return ts, errors.Join(errs...)
}
