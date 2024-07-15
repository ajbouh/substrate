package workingset

import "github.com/ajbouh/substrate/images/bridge2/tracks"

func AddURL(span tracks.Span, url string) tracks.Event {
	return recordURLAdded(span, &URLAdded{
		URL: url,
	})
}

func ActiveURLs(sess *tracks.Session) []string {
	seen := make(map[string]struct{})
	var urls []string
	for _, track := range sess.Tracks() {
		events := track.Events("working-set-add-url")
		for _, evt := range events {
			url := evt.Data.(*URLAdded).URL
			if _, ok := seen[url]; ok {
				continue
			}
			seen[url] = struct{}{}
			urls = append(urls, url)
		}
	}
	return urls
}
