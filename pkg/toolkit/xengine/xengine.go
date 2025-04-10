package xengine

import (
	"fmt"
	"log/slog"
	"reflect"

	"github.com/ajbouh/substrate/pkg/toolkit/engine"
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

func FieldsImplementing[T any](
	v interface{},
	callback func(name string, tag reflect.StructTag, value T),
) {
	ifaceType := reflect.TypeFor[T]()

	if ifaceType.Kind() != reflect.Interface {
		panic(fmt.Errorf("type parameter T must be an interface type, but got %s", ifaceType.Kind()))
	}

	val := reflect.ValueOf(v)
	if val.Kind() == reflect.Ptr {
		if val.IsNil() {
			return
		}
		val = val.Elem()
	}

	if val.Kind() != reflect.Struct {
		panic(fmt.Errorf("input value is not a struct or pointer to a struct: %T", v))
	}

	structType := val.Type()
	for i := 0; i < val.NumField(); i++ {
		fieldVal := val.Field(i)
		fieldTypeMeta := structType.Field(i)

		if !fieldTypeMeta.IsExported() {
			continue
		}

		fieldTypeActual := fieldVal.Type()
		implements := fieldTypeActual.Implements(ifaceType)

		if !implements && fieldVal.CanAddr() {
			fieldPtrType := reflect.PointerTo(fieldTypeActual)
			if fieldPtrType.Implements(ifaceType) {
				implements = true
			}
		}

		if !implements {
			continue
		}

		fieldName := fieldTypeMeta.Name
		fieldValueInterface := fieldVal.Interface()

		typedValue, ok := fieldValueInterface.(T)
		if !ok {
			slog.Info(fmt.Sprintf("Warning: field %s (%T) passed Implements check for %v but failed type assertion",
				fieldName, fieldValueInterface, ifaceType))
			continue
		}

		callback(fieldName, fieldTypeMeta.Tag, typedValue)
	}
}
