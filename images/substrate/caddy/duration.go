// Copyright 2015 Matthew Holt and The Caddy Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package caddy

import (
	"encoding/json"
	"fmt"
	"io"
	"strconv"
	"strings"
	"time"
)

// Duration can be an integer or a string. An integer is
// interpreted as nanoseconds. If a string, it is a Go
// time.Duration value such as `300ms`, `1.5h`, or `2h45m`;
// valid units are `ns`, `us`/`µs`, `ms`, `s`, `m`, `h`, and `d`.
type Duration time.Duration

// UnmarshalJSON satisfies json.Unmarshaler.
func (d *Duration) UnmarshalJSON(b []byte) error {
	if len(b) == 0 {
		return io.EOF
	}
	var dur time.Duration
	var err error
	if b[0] == byte('"') && b[len(b)-1] == byte('"') {
		dur, err = ParseDuration(strings.Trim(string(b), `"`))
	} else {
		err = json.Unmarshal(b, &dur)
	}
	*d = Duration(dur)
	return err
}

// ParseDuration parses a duration string, adding
// support for the "d" unit meaning number of days,
// where a day is assumed to be 24h. The maximum
// input string length is 1024.
func ParseDuration(s string) (time.Duration, error) {
	if len(s) > 1024 {
		return 0, fmt.Errorf("parsing duration: input string too long")
	}
	var inNumber bool
	var numStart int
	for i := 0; i < len(s); i++ {
		ch := s[i]
		if ch == 'd' {
			daysStr := s[numStart:i]
			days, err := strconv.ParseFloat(daysStr, 64)
			if err != nil {
				return 0, err
			}
			hours := days * 24.0
			hoursStr := strconv.FormatFloat(hours, 'f', -1, 64)
			s = s[:numStart] + hoursStr + "h" + s[i+1:]
			i--
			continue
		}
		if !inNumber {
			numStart = i
		}
		inNumber = (ch >= '0' && ch <= '9') || ch == '.' || ch == '-' || ch == '+'
	}
	return time.ParseDuration(s)
}
