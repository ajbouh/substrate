package commands

import (
	"errors"
	"fmt"
	"reflect"
)

const maxMergeDepth = 64

// assumes that src is a tree (no cycles)
func merge0(dst, src map[string]any, srcValsReplaceDstVals bool, keypath []string) (any, error) {
	if len(keypath) > maxMergeDepth {
		return nil, fmt.Errorf("merge went way too deep! %#v and %#v", dst, src)
	}
	if src == nil {
		return dst, nil
	}
	if dst == nil {
		return src, nil
	}

	for key, srcVal := range src {
		if dstVal, ok := dst[key]; ok {
			if reflect.DeepEqual(srcVal, dstVal) {
				continue
			}

			srcMap, srcMapErr := As[map[string]any](srcVal)
			dstMap, dstMapErr := As[map[string]any](dstVal)

			// if we can't descend into src, just replace whatever was in dst
			if srcMapErr != nil && srcValsReplaceDstVals {
				dst[key] = srcVal
				continue
			}

			var errs []error
			if srcMapErr != nil {
				errs = append(errs, srcMapErr)
			}
			if dstMapErr != nil {
				errs = append(errs, dstMapErr)
			}

			if len(errs) > 0 {
				return nil, fmt.Errorf("cannot merge keypath=%#v dsttype=%T; srctype=%T: %w", keypath, dstVal, srcVal, errors.Join(errs...))
			}

			var err error
			srcVal, err = merge0(dstMap, srcMap, srcValsReplaceDstVals, append(keypath, key))
			if err != nil {
				return nil, err
			}
		}
		dst[key] = srcVal
	}

	return dst, nil
}

func MergeFields(dst Fields, src Fields) (Fields, error) {
	out, err := merge0(dst, src, false, nil)
	if err != nil {
		return nil, fmt.Errorf("merge failed; dst=%#v; src=%#v: %w", dst, src, err)
	}
	return As[Fields](out)
}

func MergeFieldsFavoringSrc(dst Fields, src Fields) (Fields, error) {
	out, err := merge0(dst, src, true, nil)
	if err != nil {
		return nil, fmt.Errorf("merge failed; dst=%#v; src=%#v: %w", dst, src, err)
	}
	return As[Fields](out)
}
