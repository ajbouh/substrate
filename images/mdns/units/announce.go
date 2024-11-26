package units

import (
	"fmt"
	"log/slog"
	"net"
	"reflect"
	"slices"
	"sync"

	"github.com/grandcat/zeroconf"
)

type Registration[T any] struct {
	record *Record
	server *zeroconf.Server

	mu sync.Mutex
}

type Record struct {
	Instance string
	Service  string
	Domain   string
	Port     int
	Host     string

	Text []string `json:"-"`

	ServiceIPs          []string
	AnnouncerInterfaces []net.Interface
}

type Step int

const Shutdown Step = 1
const Register Step = 2
const SetText Step = 3

func (r *Registration[T]) plan(new *Record) []Step {
	if r.server == nil {
		return []Step{Register}
	}

	plan := new.Plan(r.record)
	if len(plan) > 0 && plan[0] == Register {
		plan = append([]Step{Shutdown}, plan...)
	}
	return plan
}

func (rec *Record) Clone() *Record {
	return &Record{
		Instance:            rec.Instance,
		Service:             rec.Service,
		Domain:              rec.Domain,
		Port:                rec.Port,
		Host:                rec.Host,
		Text:                slices.Clone(rec.Text),
		ServiceIPs:          slices.Clone(rec.ServiceIPs),
		AnnouncerInterfaces: slices.Clone(rec.AnnouncerInterfaces),
	}
}

func (rec *Record) Plan(other *Record) []Step {
	if rec == other {
		return nil
	}

	if ((other == nil || rec == nil) && rec != other) ||
		rec.Instance != other.Instance ||
		rec.Service != other.Service ||
		rec.Domain != other.Domain ||
		rec.Port != other.Port ||
		!slices.Equal(rec.ServiceIPs, other.ServiceIPs) ||
		!reflect.DeepEqual(rec.AnnouncerInterfaces, other.AnnouncerInterfaces) {
		return []Step{Register}
	}
	if !slices.Equal(rec.Text, other.Text) {
		return []Step{SetText}
	}

	return nil
}

func (r *Registration[T]) Update(rec Record) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	plan := r.plan(&rec)
	if len(plan) == 0 {
		return nil
	}

	for _, step := range plan {
		switch step {
		case Shutdown:
			prev := r.server
			r.server = nil
			go func() {
				prev.Shutdown()
			}()
		case Register:
			var err error
			r.server, err = zeroconf.RegisterProxy(
				rec.Instance,
				rec.Service,
				rec.Domain,
				rec.Port,
				rec.Host,
				rec.ServiceIPs,
				rec.Text,
				rec.AnnouncerInterfaces,
			)
			if err != nil {
				return err
			}
		case SetText:
			r.server.SetText(rec.Text)
		}
	}

	slog.Info(fmt.Sprintf("%T.Update()", r), "record", rec)

	return nil
}

func (r *Registration[T]) Terminate() {
	r.mu.Lock()
	defer r.mu.Unlock()

	if r.server != nil {
		prev := r.server
		r.server = nil
		prev.Shutdown()
	}
}
