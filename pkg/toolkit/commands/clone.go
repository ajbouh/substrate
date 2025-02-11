package commands

import "log/slog"

func (r Fields) MustClone() Fields {
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
			Required:    v.Required,
		}
		new[k] = md
	}

	return new, nil
}

func (r Fields) Merge(f Fields) error {
	_, err := MergeFields(r, f)
	return err
}

func (r Fields) CloneAndBind(data Fields) (Fields, error) {
	var d Fields
	defer func() { slog.Info("CloneAndBind", "data", data, "r", r, "d", d) }()

	d, err := r.Clone()
	if err != nil {
		return nil, err
	}

	err = d.Merge(data)
	if err != nil {
		return nil, err
	}

	return d, nil
}
