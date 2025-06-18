package timing

import "time"

type Timing struct {
	Name  string
	Start time.Time
	End   time.Time
}

type Timings struct {
	Timings []Timing
}

func (ts *Timings) Append(other ...Timing) {
	ts.Timings = append(ts.Timings, other...)
}

func (ts *Timings) Start(name string) *Timing {
	if ts == nil {
		return nil
	}
	ts.Timings = append(ts.Timings, *Start(name))
	return &ts.Timings[len(ts.Timings)-1]
}

func Start(name string) *Timing {
	return &Timing{Name: name, Start: time.Now().UTC()}
}

func (i *Timing) EndNow() {
	if i == nil {
		return
	}
	i.End = time.Now().UTC()
}

func (i Timing) Named(s string) Timing {
	return Timing{
		Name:  s,
		Start: i.Start,
		End:   i.End,
	}
}
