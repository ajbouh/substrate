package httpevents

import (
	"bufio"
	"bytes"
	"errors"
	"fmt"
	"io"
	"net/http"
)

func eachLine(r io.Reader, cb func(line []byte) error) error {
	rd := bufio.NewReader(r)
	for {
		line, err := rd.ReadBytes('\n')
		if err != nil {
			if errors.Is(err, io.EOF) {
				return cb(nil)
			}
			return err
		}
		err = cb(line[:len(line)-1])
		if err != nil {
			return err
		}
	}
}

func eachLineGroup(r io.Reader, cb func(lines [][]byte) error) error {
	var lines [][]byte
	return eachLine(r, func(line []byte) error {
		if len(line) == 0 {
			if len(lines) > 0 {
				err := cb(lines)
				if err != nil {
					return err
				}
			}
			lines = nil
			return nil
		}
		lines = append(lines, line)
		return nil
	})
}

type Event struct {
	Event string
	Data  []byte
}

func eachEvent(r io.Reader, cb func(event *Event) error) error {
	return eachLineGroup(r, func(lines [][]byte) error {
		var ev *Event
		for _, line := range lines {
			kind, rest, ok := bytes.Cut(line, []byte(": "))
			if ok {
				kindStr := string(kind)
				if ev == nil {
					ev = &Event{}
				}
				switch kindStr {
				case "event":
					ev.Event = string(rest)
				case "data":
					ev.Data = append(ev.Data, rest...)
				}
			}
		}

		return cb(ev)
	})
}

func ReadStreamEvents(client *http.Client, req *http.Request, cb func(event *Event) error) error {
	req.Header.Set("Accept", "text/event-stream")

	res, err := client.Do(req)
	if err != nil {
		return err
	}

	defer res.Body.Close()

	if res.StatusCode != 200 {
		body, _ := io.ReadAll(res.Body)
		return fmt.Errorf(
			"received a %d error in http response for: %s; body=%s", res.StatusCode, req.URL, body)
	}

	return eachEvent(res.Body, cb)
}
