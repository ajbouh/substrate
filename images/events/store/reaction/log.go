package reaction

// Leave out Time until we figure out how to test it
type LogEntry = struct {
	// Time int64    `json:"time"`
	Args []string `json:"args"`
}

type Log struct {
	entries []LogEntry
}

type Stringer interface{ String() string }

func (l *Log) Append(args ...any) {
	entry := LogEntry{
		// Time: time.Now().UnixMicro(),
		Args: make([]string, 0, len(args)),
	}
	for _, arg := range args {
		if stringer, ok := arg.(Stringer); ok {
			entry.Args = append(entry.Args, stringer.String())
		}
	}
	l.entries = append(l.entries, entry)
}
