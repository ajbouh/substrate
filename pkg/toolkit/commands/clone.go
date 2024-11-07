package commands

import "log/slog"

func (r Msg) MustClone() *Msg {
	clone, err := r.Clone()
	if err != nil {
		panic(err)
	}

	return clone
}

func (m Bindings) Clone() Bindings {
	if m == nil {
		return nil
	}

	new := Bindings{}
	for dst, src := range m {
		new[dst] = src
	}
	return new
}

func (m Meta) Clone() (Meta, error) {
	if m == nil {
		return nil, nil
	}

	new := Meta{}
	for k, v := range m {
		md := Metadata{
			Description: v.Description,
			Type:        v.Type,
		}
		new[k] = md
	}

	return new, nil
}

func cloneStringPtr(s *string) *string {
	if s == nil {
		return nil
	}
	v := *s
	return &v
}

func (r *Msg) Clone() (*Msg, error) {
	if r == nil {
		return nil, nil
	}

	new := &Msg{
		Description: r.Description,
		Cap:         cloneStringPtr(r.Cap),
		MsgIn:       r.MsgIn.Clone(),
		MsgOut:      r.MsgOut.Clone(),
	}

	var err error
	new.Meta, err = r.Meta.Clone()
	if err != nil {
		return nil, err
	}

	new.Data, err = r.Data.Clone()
	if err != nil {
		return nil, err
	}

	new.Msg, err = r.Msg.Clone()
	if err != nil {
		return nil, err
	}

	return new, nil
}

func (r Msg) CloneAndBind(data Fields) (*Msg, error) {
	slog.Info("CloneAndBind", "data", data, "r.Data", r.Data)

	d, err := r.Clone()
	if err != nil {
		return nil, err
	}

	err = Merge(d.Data, data)
	if err != nil {
		return nil, err
	}

	return d, nil
}
