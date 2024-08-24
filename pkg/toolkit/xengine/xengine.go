package xengine

import (
	"reflect"

	"tractor.dev/toolkit-go/engine"
)

func AssemblyForPossiblyAnonymousTarget[Target any]() (*Target, []engine.Unit, bool) {
	targetType := reflect.TypeFor[Target]()
	pkgPath := targetType.PkgPath()
	isAnonymous := pkgPath == ""

	// Only recurse into Target if it is anonymous (e.g. struct { ... })
	if isAnonymous {
		target := new(Target)
		return target, []engine.Unit{target}, true
	}
	return nil, nil, false
}
