package http

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type JSONResponseWriter func(v interface{}, status int, err error)

func NewJSONResponseWriter(rw http.ResponseWriter) JSONResponseWriter {
	return func(v interface{}, status int, err error) {
		if err == nil {
			header := rw.Header()
			header.Set("Content-Type", "application/json")

			var out []byte
			out, err = json.Marshal(v)

			if err == nil {
				rw.WriteHeader(status)
				rw.Write(out)
			}
		}

		if err != nil {
			http.Error(rw, fmt.Sprintf(`{"message": %q}`, err.Error()), status)
		}
	}
}
