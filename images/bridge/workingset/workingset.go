package workingset

import (
	"cmp"
	"errors"
	"regexp"
	"slices"

	"github.com/ajbouh/substrate/images/bridge/tracks"
)

var (
	keyPattern    = regexp.MustCompile(`^[a-z0-9_]+$`)
	ErrInvalidKey = errors.New("invalid key")
)

func AddURL(span tracks.Span, key, url string) (*tracks.Event, error) {
	if !keyPattern.MatchString(key) {
		return nil, ErrInvalidKey
	}
	evt := recordURLAdded(span, &URLAdded{
		Key: key,
		URL: url,
	})
	return &evt, nil
}

func ActiveURLs(sess *tracks.Session) map[string]string {
	urls := make(map[string]string)
	var allEvents []tracks.Event
	for _, track := range sess.Tracks() {
		allEvents = append(allEvents, track.Events("working-set-add-url")...)
	}
	// sort by time and ID in order to take the latest value by key
	slices.SortFunc(allEvents, func(a, b tracks.Event) int {
		if c := cmp.Compare(a.Start, b.Start); c != 0 {
			return c
		}
		return cmp.Compare(a.ID, b.ID)
	})
	for _, evt := range allEvents {
		data := evt.Data.(*URLAdded)
		urls[data.Key] = data.URL
	}
	return urls
}
