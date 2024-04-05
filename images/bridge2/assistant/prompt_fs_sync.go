package assistant

import (
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/ajbouh/substrate/images/bridge2/tracks"
)

type fsSync struct {
	sess     *tracks.Session
	path     string
	pollRate time.Duration
	prompts  chan tracks.Event
}

// Syncs assistant prompts with plain-text files in the given directory.
//
// On receiving an "assistant-set-prompt" event, the prompt contents are written
// to `{path}/{assistant-name}`. Or if the prompt is empty, the file is removed.
//
// The path contents are polled at the `pollRate` for changes. When a file
// change is detected, its contents will be recorded as the new prompt for that
// assistant.
//
// De-duping: this avoids duplicate syncing back-and-forth by:
//  1. When it generates an "assistant-set-prompt" event it stores the ID to skip
//     when the handler is called for that event.
//  2. When writing the prompt to a file, it fetches the new `Stat` result and
//     records that with the new modification time so that the next poll will
//     not trigger a duplicate event.
func newFSSync(sess *tracks.Session, path string, pollRate time.Duration) *fsSync {
	f := &fsSync{
		sess:     sess,
		path:     path,
		pollRate: pollRate,
		prompts:  make(chan tracks.Event),
	}
	go f.sync()
	return f
}

func (a *fsSync) HandleEvent(annot tracks.Event) {
	switch annot.Type {
	case "assistant-set-prompt":
		a.prompts <- annot
	}
}

func (a *fsSync) sync() {
	knownFiles := make(map[string]os.FileInfo)
	inFlight := make(map[tracks.ID]struct{})
	t := time.NewTicker(a.pollRate)
	for {
		select {
		case <-t.C:
			latest, err := a.contents()
			if err != nil {
				log.Printf("error reading contents of %s: %v", a.path, err)
				continue
			}
			changed, removed := a.diffContents(knownFiles, latest)
			for _, name := range removed {
				asstEvent := RemoveAssistant(a.sess.SpanNow(), name)
				inFlight[asstEvent.ID] = struct{}{}
			}
			for _, name := range changed {
				asstEvent, err := a.loadPrompt(name)
				if err != nil {
					log.Printf("error loading prompt from %s: %v", name, err)
					continue
				}
				inFlight[asstEvent.ID] = struct{}{}
			}
			knownFiles = latest
		case asstEvent := <-a.prompts:
			if _, ok := inFlight[asstEvent.ID]; ok {
				delete(inFlight, asstEvent.ID)
				continue
			}
			in := asstEvent.Data.(*AssistantPromptEvent)
			stat, err := a.savePrompt(in)
			if err != nil {
				log.Printf("error saving prompt %s: %v", asstEvent.Data.(*AssistantPromptEvent).Name, err)
				continue
			}
			// update the current entry for this file based on what we just wrote
			// to avoid triggering a duplicate change when polling the file
			if stat == nil {
				delete(knownFiles, in.Name)
			} else {
				knownFiles[in.Name] = stat
			}
		}
	}
}

func sameFile(a, b os.FileInfo) bool {
	return a.Name() == b.Name() && a.Size() == b.Size() && a.Mode() == b.Mode() && a.ModTime() == b.ModTime()
}

func (a *fsSync) diffContents(prev, curr map[string]os.FileInfo) (changed []string, removed []string) {
	for name := range prev {
		if _, ok := curr[name]; !ok {
			removed = append(removed, name)
		}
	}
	for name, entry := range curr {
		if p, ok := prev[name]; !ok || !sameFile(p, entry) {
			changed = append(changed, name)
		}
	}
	return changed, removed
}

func (a *fsSync) contents() (map[string]os.FileInfo, error) {
	contents := make(map[string]os.FileInfo)
	entries, err := os.ReadDir(a.path)
	if err != nil {
		return nil, err
	}
	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}
		info, err := entry.Info()
		if err != nil {
			return nil, err
		}
		contents[entry.Name()] = info
	}
	return contents, nil
}

func (a *fsSync) loadPrompt(name string) (*tracks.Event, error) {
	filename := filepath.Join(a.path, name)
	prompt, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	event := AddAssistant(a.sess.SpanNow(), name, string(prompt))
	return &event, nil
}

func (a *fsSync) savePrompt(in *AssistantPromptEvent) (os.FileInfo, error) {
	filename := filepath.Join(a.path, in.Name)
	if in.SystemMessage == "" {
		return nil, os.Remove(filename)
	}
	if err := os.WriteFile(filename, []byte(in.SystemMessage), 0644); err != nil {
		return nil, err
	}
	return os.Stat(filename)
}
