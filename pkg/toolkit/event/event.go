package event

import (
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"errors"
	"log/slog"

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

var _ sql.Scanner = (*SHA256Digest)(nil)
var _ json.Marshaler = (*SHA256Digest)(nil)

var ErrScanValue = errors.New("SHA256Digest: source value must be a byte slice")

func SHA256DigestFromBytes(b []byte) SHA256Digest {
	var m SHA256Digest
	copy(m[:], b)
	return m
}

func (m *SHA256Digest) Scan(src any) error {
	defer func() { slog.Info("SHA256Digest.Scan", "src", src, "m", m) }()
	switch x := src.(type) {
	case nil:
		return nil
	case []byte:
		copy(m[:], x)
		return nil
	}

	return ErrScanValue
}

func (m *SHA256Digest) MarshalJSON() ([]byte, error) {
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
