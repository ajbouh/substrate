package reaction

import (
	"encoding/json"
	"io"
	"log/slog"

	"github.com/ajbouh/substrate/images/events/store/reaction/timing"
)

type JSONString string

func (s JSONString) JSONStringify() string {
	return string(s)
}

var _ JSONStringify = (JSONString)("{}")

type JSONStringify interface {
	JSONStringify() string
}

func Unmarshal(qv JSONStringify, v any, timings *timing.Timings, checksummer io.Writer) error {
	stringify := timings.Start("stringify")
	vJSON := qv.JSONStringify()
	stringify.EndNow()

	// todo can we avoid the copy?
	b := []byte(vJSON)

	if checksummer != nil {
		checksum := timings.Start("checksum")
		_, err := checksummer.Write(b)
		if err != nil {
			slog.Info("quickjsUnmarshal error", "v", v, "json", vJSON, "err", err)
			return err
		}
		checksum.EndNow()
	}

	unmarshal := timings.Start("unmarshal")
	err := json.Unmarshal(b, v)
	if err != nil {
		slog.Info("quickjsUnmarshal error", "v", v, "json", vJSON, "err", err)
	}
	unmarshal.EndNow()
	return err
}
