package reaction

import (
	"errors"
	"fmt"
	"log/slog"
	"slices"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type Resume struct {
	Now                      event.ID `json:"-"`
	DefaultChecksumAlgorithm string   `json:"-"`
	Offset                   int      `json:"-"`
	CurrentReactionID        event.ID `json:"-"`

	Journal     Journal `json:"journal"`
	isReplaying bool
}

type Sample struct {
	ReactionID event.ID
	Timestamp  event.ID
	IsReplay   bool
	commit     func()
}

func (r *Sample) Commit() error {
	if r.IsReplay {
		return nil
	}

	if r.commit == nil {
		return fmt.Errorf("cannot commit sample, perhaps this is an internal error")
	}

	r.commit()
	return nil
}

func (r *Resume) IsReplaying() bool {
	return r.isReplaying
}

func (r *Resume) Sample(ocs OpChecksum) (sample Sample, err error) {
	operation := ocs.Operation
	checksumAlgorithm := ocs.ChecksumAlgorithm
	checksum := ocs.Checksum

	defer func() {
		slog.Info("resume.sample", "op", operation, "csa", checksumAlgorithm, "cs", checksum, "offset", r.Offset, "len(journal)", r.Journal.Len(), "sample", sample, "err", err, "isReplaying", r.isReplaying, "resume", r, "journal", r.Journal)
	}()

	if r.Offset == r.Journal.Len() {
		sample = Sample{
			ReactionID: r.CurrentReactionID,
			Timestamp:  r.Now,
			IsReplay:   false,
			commit: func() {
				entry := JournalEntry{
					ChecksumAlgorithm: checksumAlgorithm,
					Operation:         operation,
					Checksum:          checksum,
					ReactionID:        r.CurrentReactionID,
					Timestamp:         r.Now,
				}
				r.Journal.Append(entry)
				r.Offset++
			},
		}
		r.isReplaying = false
		return
	}
	if r.Offset > r.Journal.Len() {
		err = errors.New("internal journal error: offset does not align with recorded samples")
		return
	}

	entry, ok := r.Journal.Get(r.Offset)
	if !ok {
		err = fmt.Errorf("replay error: no journal entry at offset %d", r.Offset)
		return
	}
	if operation != entry.Operation ||
		checksumAlgorithm != entry.ChecksumAlgorithm ||
		checksum != entry.Checksum {
		err = fmt.Errorf("replay error: unexpected journal sequence during replay; expected %s:%s:%s got %s:%s:%s",
			entry.Operation,
			entry.ChecksumAlgorithm,
			entry.Checksum,
			operation,
			checksumAlgorithm,
			checksum)
		return
	}
	r.Offset++
	sample = Sample{
		ReactionID: entry.ReactionID,
		Timestamp:  entry.Timestamp,
		IsReplay:   true,
	}
	return
}

func (r *Resume) PeekChecksumAlgorithm() string {
	if sample, ok := r.Journal.Get(r.Offset); ok {
		return sample.ChecksumAlgorithm
	}
	return r.DefaultChecksumAlgorithm
}

type JournalEntry struct {
	Operation string `json:"op"`
	Checksum  string `json:"cs"`

	ChecksumAlgorithm string `json:"alg"`

	ReactionID event.ID `json:"this"`
	Timestamp  event.ID `json:"now"`
}

type Journal struct {
	Entries []JournalEntry `json:"entries"`
}

func (t *Journal) Clone() *Journal {
	return &Journal{
		Entries: slices.Clone(t.Entries),
	}
}

func (t *Journal) Len() int {
	return len(t.Entries)
}

func (t *Journal) Append(sample JournalEntry) {
	t.Entries = append(t.Entries, sample)
}

func (t *Journal) Get(offset int) (JournalEntry, bool) {
	if offset >= len(t.Entries) {
		return JournalEntry{}, false
	}
	return t.Entries[offset], true
}
