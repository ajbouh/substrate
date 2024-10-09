package units

import (
	"errors"
	"fmt"

	"cuelang.org/go/cue"
	"github.com/ajbouh/substrate/images/substrate/defset"
)

type ParameterType struct {
	Type string `json:"type"`
}

type InstanceParameterTypes struct {
	Parameters map[string]ParameterType `json:"parameters`
}

func EachInstanceTemplate(defSet *defset.DefSet, f func(serviceName string, instanceTemplate *InstanceParameterTypes)) error {
	var errs []error
	defSet.CueMu.Lock()
	defer defSet.CueMu.Unlock()

	for serviceName, serviceCueValue := range defSet.ServicesCueValues {
		instanceTemplate := &InstanceParameterTypes{
			Parameters: map[string]ParameterType{},
		}
		parameters := serviceCueValue.LookupPath(cue.MakePath(cue.Str("instances"), cue.AnyString, cue.Str("parameters")))

		iter, err := parameters.Fields()
		if err != nil {
			errs = append(errs, err)
			instanceTemplate = nil
		}

		for iter.Next() {
			sel := iter.Selector()
			if !sel.IsString() {
				continue
			}
			parameterName := sel.Unquoted()
			var t string
			err := iter.Value().Lookup("type").Decode(&t)
			if err != nil {
				errs = append(errs, err)
				instanceTemplate = nil
				break
			}

			instanceTemplate.Parameters[parameterName] = ParameterType{
				Type: t,
			}
		}

		if instanceTemplate != nil {
			defSet.CueMu.Unlock()
			f(serviceName, instanceTemplate)
			defSet.CueMu.Lock()
		}
	}

	return errors.Join(errs...)
}

func EachInstance[T any](defSet *defset.DefSet, f func(serviceName string, instanceName string, instanceValue *T)) error {
	var errs []error

	defSet.CueMu.Lock()
	defer defSet.CueMu.Unlock()

	for serviceName, serviceCueValue := range defSet.ServicesCueValues {
		instances, err := serviceCueValue.LookupPath(cue.MakePath(cue.Str("instances"))).Fields()
		if err != nil {
			errs = append(errs, fmt.Errorf("error looking up instances: %w", err))
			continue
		}

		for instances.Next() {
			var instanceName string
			var t *T

			sel := instances.Selector()
			if !sel.IsString() {
				continue
			}
			instanceName = sel.Unquoted()

			t = new(T)
			err := instances.Value().Decode(&t)
			if err != nil {
				errs = append(errs, err)
				t = nil
			}

			if t != nil {
				defSet.CueMu.Unlock()
				f(serviceName, instanceName, t)
				defSet.CueMu.Lock()
			}
		}
	}

	return errors.Join(errs...)
}
