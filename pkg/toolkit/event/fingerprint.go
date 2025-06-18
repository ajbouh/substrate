package event

import (
	"bytes"
	"crypto/sha256"
	"errors"
	"fmt"
	"hash"
	"io"
	"slices"
	"strings"

	"github.com/tidwall/gjson"
)

// A fingerprint is a stable, canonical JSON object derived from another JSON object. It is based on
// a special "self" field in the original object. The "self" field should be an array of keys
// that specifies which other fields to include. The resulting fingerprint contains only those selected
// fields, sorted (recursively).

// For example, the object `{"id": 123, "status": "active", "namespace": 42, "user": "test", "self": ["id", "namespace"]}`
// has the fingerprint: `{"id":123,"namespace":42}`.

type Fingerprint []byte

func (f Fingerprint) Key() FingerprintKey {
	h := sha256.New
	hasher := h()
	hasher.Write(f)
	return FingerprintKey(fmt.Sprintf("%x", hasher.Sum(nil)))
}

type FingerprintKey string

func (k FingerprintKey) String() string {
	return string(k)
}

var leftBrace = []byte{'{'}
var rightBrace = []byte{'}'}
var comma = []byte{','}
var colon = []byte{':'}

func (fp *Fingerprint) String() string {
	return string(*fp)
}

func writeResult(w io.Writer, b []byte, r gjson.Result) (int, error) {
	if r.Index > 0 {
		return w.Write(b[r.Index : r.Index+len(r.Raw)])
	} else {
		return io.WriteString(w, r.Raw)
	}
}

var ErrSelfNotPresent = errors.New("self is not set")
var ErrSelfNotArray = errors.New("self is not an array")

func WriteFingerprintFor(adviseLen func(i int), w io.Writer, b []byte) error {
	self := gjson.GetBytes(b, "self")
	if !self.Exists() {
		return ErrSelfNotPresent
	}
	if self.Type != gjson.JSON || self.Raw[0] != '[' {
		return ErrSelfNotArray
	}
	selfArray := self.Array()
	slices.SortFunc(selfArray, func(a, b gjson.Result) int {
		return strings.Compare(a.Raw, b.Raw)
	})

	selfLen := len(selfArray)

	fields := make([]string, selfLen)
	var totalSize = 2 + selfLen - 1 // count {} and ,
	for i, result := range selfArray {
		if result.Type != gjson.String {
			return fmt.Errorf("bad entry in self at index %d, in %q", i, self.Str)
		}
		field := result.String()
		totalSize += len(result.Raw) + 3 // count result and "":
		fields[i] = field
	}

	vals := make([]gjson.Result, selfLen)
	for i, field := range fields {
		val := gjson.GetBytes(b, field+"|@ugly")
		vals[i] = val
		totalSize += len(val.Raw)
	}

	if adviseLen != nil {
		adviseLen(totalSize)
	}
	var err error
	if _, err = w.Write(leftBrace); err != nil {
		return err
	}
	for i, val := range vals {
		key := selfArray[i]
		if !val.Exists() {
			return fmt.Errorf("self entry %d refers to a field that does not exist: %s", i, key.String())
		}

		if i > 0 {
			if _, err = w.Write(comma); err != nil {
				return err
			}
		}

		if _, err := writeResult(w, b, key); err != nil {
			return err
		}

		if _, err = w.Write(colon); err != nil {
			return err
		}

		if _, err := writeResult(w, b, val); err != nil {
			return err
		}
	}
	_, err = w.Write(rightBrace)
	return err
}

func FingerprintFor(b []byte) (Fingerprint, error) {
	var buf bytes.Buffer
	err := WriteFingerprintFor(buf.Grow, &buf, b)
	if err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func RawFingerprintDigestFor[D any](h func() hash.Hash, d func(hash.Hash) D, b []byte) (D, error) {
	hasher := h()
	err := WriteFingerprintFor(nil, hasher, b)
	if err != nil {
		var d D
		return d, err
	}
	return d(hasher), nil
}

func FingerprintKeyFor(b []byte) (FingerprintKey, error) {
	return RawFingerprintDigestFor(
		sha256.New,
		func(h hash.Hash) FingerprintKey { return FingerprintKey(fmt.Sprintf("%x", h.Sum(nil))) },
		b,
	)
}
