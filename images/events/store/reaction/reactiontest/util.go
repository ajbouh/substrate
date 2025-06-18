package reactiontest

import (
	"encoding/json"
	"fmt"

	"github.com/tidwall/gjson"
	"github.com/tidwall/sjson"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

var Undefined = struct{}{}

type Map = map[string]any
type List = []any
type ID = event.ID
type JSON = json.RawMessage

// like Object.assign, but in JSON space..
func Assign(b JSON, fs ...Map) JSON {
	for _, f := range fs {
		for k, v := range f {
			var err error
			if v == Undefined {
				if !gjson.GetBytes(b, k).Exists() {
					panic(fmt.Errorf("tried to delete '%s', but it wasn't already defined. bug in tests? json=%s", k, string(b)))
				}
				b, err = sjson.DeleteBytes(b, k)
			} else {
				b, err = sjson.SetBytes(b, k, v)
			}
			if err != nil {
				panic(err)
			}
		}
	}
	return b
}

func Reaction() JSON {
	return JSON(`{"type":"reaction","self":["type"]}`)
}

func Receipt(now, id ID) JSON {
	return Assign(
		JSON(`{"links":{"reaction":{"rel":"reaction"}},"log":null,"timings":null,"type":"reaction-receipt"}`),
		Map{
			"now": now.String(),

			"links.reaction.eventref:event": id.String(),
		})
}
