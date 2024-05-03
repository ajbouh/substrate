package httputil

import (
	"fmt"
	"log"
	"net/http"

	"cuelang.org/go/cue"
	"cuelang.org/go/cue/format"
	"github.com/elnormous/contenttype"
)

func WriteCueValue(rw http.ResponseWriter, req *http.Request, v cue.Value) {
	availableMediaTypes := []contenttype.MediaType{
		contenttype.NewMediaType("application/json"),
		contenttype.NewMediaType("application/json; charset=utf-8"),
		contenttype.NewMediaType("application/cue"),
		contenttype.NewMediaType("application/cue; charset=utf-8"),
	}

	accepted, _, err := contenttype.GetAcceptableMediaType(req, availableMediaTypes)
	if err != nil {
		log.Printf("err in GetAcceptableMediaType %s: %#v", err, req)
		jsonrw := NewJSONResponseWriter(rw)
		jsonrw(nil, http.StatusUnsupportedMediaType, err)
		return
	}

	switch accepted.Type + "/" + accepted.Subtype {
	case "application/json":
		b, err := v.MarshalJSON()
		if err != nil {
			http.Error(rw, fmt.Sprintf(`{"message": %q}`, err.Error()), http.StatusInternalServerError)
			return
		}
		rw.Write(b)
	case "application/cue":
		// Generate an AST
		//   try out different options
		syn := v.Syntax(
			cue.Final(),         // close structs and lists
			cue.Concrete(false), // allow incomplete values
			cue.Definitions(false),
			cue.Hidden(true),
			cue.Optional(true),
			cue.Attributes(true),
			cue.Docs(true),
		)

		// Pretty print the AST, returns ([]byte, error)
		b, err := format.Node(
			syn,
			// format.TabIndent(false),
			// format.UseSpaces(2),
		)
		if err != nil {
			http.Error(rw, fmt.Sprintf(`{"message": %q}`, err.Error()), http.StatusInternalServerError)
			return
		}

		rw.Write(b)
	}
}
