package reaction

import (
	"encoding/hex"
	"encoding/json"
	"fmt"
	"hash"
	"io"

	"github.com/minio/highwayhash"
)

func ResolveChecksum(name string) (func() hash.Hash, error) {
	switch name {
	case HighwayHashChecksumAlgorithm:
		return newHighwayHash, nil
	}

	return nil, fmt.Errorf("unknown checksum algorithm: %s", name)
}

const DefaultChecksumAlgorithm = HighwayHashChecksumAlgorithm

const HighwayHashChecksumAlgorithm = "HighwayHash"

func newHighwayHash() hash.Hash {
	// use zero key for now. in the future consider using a reaction-specific key.
	key := make([]byte, 32)
	hasher, err := highwayhash.New(key)
	if err != nil {
		// should only error if the key size is wrong and that's hardcoded
		panic(err)
	}
	return hasher
}

type OpChecksummer struct {
	Operation         string            `json:"op"`
	ChecksumAlgorithm string            `json:"hash_alg"`
	ArgChecksums      map[string]string `json:"args"`

	newHasher    func() hash.Hash
	hashStringer func([]byte) string
	argHashers   map[string]hash.Hash
}

func NewOpChecksummer(op string, alg string, newHasher func() hash.Hash) *OpChecksummer {
	return &OpChecksummer{
		Operation:         op,
		ChecksumAlgorithm: alg,
		newHasher:         newHasher,
		hashStringer:      hex.EncodeToString,
		argHashers:        map[string]hash.Hash{},
	}
}

func (ocs *OpChecksummer) Arg(name string) (io.Writer, error) {
	_, ok := ocs.argHashers[name]
	if ok {
		return nil, fmt.Errorf("already declared arg op=%s arg=%s", ocs.Operation, name)
	}

	cs := ocs.newHasher()
	ocs.argHashers[name] = cs
	return cs, nil
}

type OpChecksum struct {
	Operation         string
	ChecksumAlgorithm string
	Checksum          string
}

func (ocs *OpChecksummer) Finish() (*OpChecksum, error) {
	ocs.ArgChecksums = map[string]string{}

	for arg, csr := range ocs.argHashers {
		ocs.ArgChecksums[arg] = ocs.hashStringer(csr.Sum(nil))
	}

	csr := ocs.newHasher()
	err := json.NewEncoder(csr).Encode(ocs) // golang sorts object keys
	if err != nil {
		return nil, err
	}

	return &OpChecksum{
		Operation:         ocs.Operation,
		ChecksumAlgorithm: ocs.ChecksumAlgorithm,
		Checksum:          ocs.hashStringer(csr.Sum(nil)),
	}, err
}
