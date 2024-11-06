package substratehttp

import (
	"strings"
)

func urlPathEscape(s string) string {
	return strings.ReplaceAll(s, "/", "%2F")
}
