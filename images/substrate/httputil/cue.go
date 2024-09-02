package httputil

import (
	"fmt"
	"net/http"

	"cuelang.org/go/cue"
	"cuelang.org/go/cue/format"
	"github.com/elnormous/contenttype"
)

func WriteCueValueForRequest(req *http.Request, v cue.Value) (int, []byte) {
	availableMediaTypes := []contenttype.MediaType{
		contenttype.NewMediaType("application/json"),
		contenttype.NewMediaType("application/json; charset=utf-8"),
		contenttype.NewMediaType("application/cue"),
		contenttype.NewMediaType("application/cue; charset=utf-8"),
	}

	accepted, _, err := contenttype.GetAcceptableMediaType(req, availableMediaTypes)
	if err != nil {
		return http.StatusUnsupportedMediaType, []byte(fmt.Sprintf(`{"message": %q}`, err.Error()))
	}

	return WriteCueValue(accepted.Type+"/"+accepted.Subtype, v)
}

func WriteCueValue(acceptedType string, v cue.Value) (int, []byte) {
	switch acceptedType {
	case "application/json":
		b, err := v.MarshalJSON()
		if err != nil {
			return http.StatusInternalServerError, []byte(fmt.Sprintf(`{"message": %q}`, err.Error()))
		}
		return http.StatusOK, b
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
			return http.StatusInternalServerError, []byte(fmt.Sprintf(`{"message": %q}`, err.Error()))
		}

		return http.StatusOK, b
	default:
		return http.StatusInternalServerError, []byte(`{"message": "unhandled media type"}`)
	}
}
