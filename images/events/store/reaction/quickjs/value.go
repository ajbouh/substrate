package reactionquickjs

import "github.com/buke/quickjs-go"

func typeofValue(v *quickjs.Value) string {
	switch {
	case v.IsArray():
		return "Array"
	case v.IsBigInt():
		return "BigInt"
	// case v.IsBigInt64Array():
	// 	return "BigInt64Array"
	// case v.IsBigUint64Array():
	// 	return "BigUint64Array"
	case v.IsBool():
		return "Bool"
	// case v.IsByteArray():
	// 	return "ByteArray"
	case v.IsClassInstance():
		return "ClassInstance"
	case v.IsConstructor():
		return "Constructor"
	case v.IsError():
		return "Error"
	case v.IsException():
		return "Exception"
	// case v.IsFloat32Array():
	// 	return "Float32Array"
	// case v.IsFloat64Array():
	// 	return "Float64Array"
	case v.IsFunction():
		return "function"
	// case v.IsInt16Array():
	// 	return "Int16Array"
	// case v.IsInt32Array():
	// 	return "Int32Array"
	// case v.IsInt8Array():
	// 	return "Int8Array"
	case v.IsNull():
		return "null"
	case v.IsNumber():
		return "Number"
	case v.IsObject():
		return "Object"
	case v.IsPromise():
		return "Promise"
	case v.IsString():
		return "string"
	case v.IsSymbol():
		return "Symbol"
	case v.IsTypedArray():
		return "TypedArray"
	case v.IsUint16Array():
		return "Uint16Array"
	case v.IsUint32Array():
		return "Uint32Array"
	case v.IsUint8Array():
		return "Uint8Array"
	case v.IsUint8ClampedArray():
		return "Uint8ClampedArray"
	case v.IsUndefined():
		return "undefined"
	case v.IsUninitialized():
		return "<uninitialized>"
	}
	return "<unknown>"
}
