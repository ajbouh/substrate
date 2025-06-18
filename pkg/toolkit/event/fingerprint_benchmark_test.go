package event_test

import (
	"crypto/sha1"
	"crypto/sha256"
	"crypto/sha512"
	"hash"
	"testing"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

// A realistic JSON payload for benchmarking.
var benchmarkJSON = []byte(`{
	"id": "evt_123456789",
	"object": "event",
	"api_version": "2022-11-15",
	"created": 1678886400,
	"data": {
		"object": {
			"id": "cus_abcdef123456",
			"object": "customer",
			"balance": 0,
			"created": 1678886400,
			"currency": "usd",
			"description": "Customer for benchmark test",
			"email": "alyssaphacker@example.com"
		}
	},
	"livemode": false,
	"pending_webhooks": 1,
	"request": {
		"id": "req_987654321",
		"idempotency_key": "a-unique-key-for-this-request"
	},
	"type": "customer.created",
	"self": ["id", "object", "api_version", "created", "data", "type"]
}`)

// Package-level variables to store results and prevent compiler optimizations.
var (
	resultFingerprint event.Fingerprint
	resultDigest      []byte
)

// BenchmarkRawFingerprintDigestFor measures the performance of creating the fingerprint only.
func BenchmarkRawFingerprintDigestFor(b *testing.B) {
	var fp event.Fingerprint
	var err error

	b.ReportAllocs()
	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		fp, err = event.FingerprintFor(benchmarkJSON)
		if err != nil {
			b.Fatalf("RawFingerprintDigestFor failed: %v", err)
		}
	}

	resultFingerprint = fp
}

// BenchmarkRawFingerprintWithDifferentHashes measures the full process using various hash algorithms.
func BenchmarkRawFingerprintWithDifferentHashes(b *testing.B) {
	// Define the set of hash functions to benchmark against.
	hashers := []struct {
		name    string
		factory func() hash.Hash
	}{
		{"SHA1", sha1.New},
		{"SHA256", sha256.New},
		{"SHA512", sha512.New},
	}

	var digest []byte
	var err error

	for _, hasher := range hashers {
		// Run a sub-benchmark for each hash function.
		b.Run(hasher.name, func(b *testing.B) {
			h := hasher.factory
			b.ReportAllocs()
			b.ResetTimer()

			for i := 0; i < b.N; i++ {
				_, err = event.RawFingerprintDigestFor(
					h,
					func(h hash.Hash) []byte { return h.Sum(nil) },
					benchmarkJSON,
				)
				if err != nil {
					b.Fatalf("FingerprintDigestFor failed: %v", err)
				}
			}
		})
	}
	resultDigest = digest
}
