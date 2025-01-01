package units

import "tractor.dev/toolkit-go/duplex/rpc"

type RegisterV1 interface {
	RegisterV1(r rpc.Responder, call *rpc.Call)
}

type RegistrationV1Request struct {
	ID            string           `json:"id"`
	ReflectMethod *PartialPeerCall `json:"reflect"` // name to call with reflect
	RunMethod     *PartialPeerCall `json:"run"`     // name to call with run
}

type RegistrationV1Response struct {
	ID  string `json:"id"`
	URL string `json:"url"`
}
