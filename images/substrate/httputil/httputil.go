package httputil

import (
	"encoding/json"
	"fmt"
	"mime"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	form "github.com/go-playground/form/v4"
)

func HasContentType(req *http.Request, mimetype string) bool {
	for _, v := range strings.Split(req.Header.Get("Content-Type"), ",") {
		t, _, err := mime.ParseMediaType(v)
		if err == nil && t == mimetype {
			return true
		}
	}
	return false
}

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

func GetValueAsStringPtr(query url.Values, key string) *string {
	if query.Has(key) {
		s := query.Get(key)
		return &s
	}
	return nil
}

func GetValueAsBoolPtr(query url.Values, key string) *bool {
	if query.Has(key) {
		s := query.Get(key)
		b, err := strconv.ParseBool(s)
		if err != nil {
			return nil
		}
		return &b
	}
	return nil
}

func GetValueAsIntPtr(query url.Values, key string) *int {
	if query.Has(key) {
		s := query.Get(key)
		i, err := strconv.Atoi(s)
		if err != nil {
			return nil
		}
		return &i
	}
	return nil
}

func ReadRequestBody(req *http.Request, v interface{}) (int, error) {
	var err error
	switch {
	case req.ContentLength == 0:
	case HasContentType(req, "application/json"):
		err = json.NewDecoder(req.Body).Decode(v)
	case HasContentType(req, "application/x-www-form-urlencoded"):
		err = req.ParseForm()
		if err == nil {
			err = form.NewDecoder().Decode(v, req.Form)
		}
	case HasContentType(req, "multipart/form-data"):
		err = req.ParseMultipartForm(1 << 20)
		if err == nil {
			err = form.NewDecoder().Decode(v, req.MultipartForm.Value)
		}
	default:
		return http.StatusUnsupportedMediaType, fmt.Errorf("content-type must be application/json or form; got %q, content-length=%v", req.Header.Get("Content-Type"), req.ContentLength)
	}

	if err != nil {
		return http.StatusBadRequest, err
	}

	return http.StatusOK, nil
}
