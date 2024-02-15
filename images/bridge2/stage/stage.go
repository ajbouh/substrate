package stage

import (
	"context"
	"fmt"
	"log"
	"strings"

	"github.com/ajbouh/substrate/images/bridge2/tracks"
	"github.com/ajbouh/substrate/images/bridge2/transcribe"
	"github.com/chromedp/chromedp"
	"github.com/chromedp/chromedp/kb"
)

type Agent struct {
	Endpoint string

	ctx    context.Context
	finish context.CancelFunc
}

func (a *Agent) InitializeDaemon() error {
	ctx, _ := chromedp.NewRemoteAllocator(context.Background(), a.Endpoint)
	a.ctx, a.finish = chromedp.NewContext(ctx)
	return nil
}

func (a *Agent) TerminateDaemon(ctx context.Context) error {
	a.finish()
	return nil
}

func (a *Agent) HandleEvent(annot tracks.Event) {
	if annot.Type != "transcription" {
		return
	}
	// just short term command processing until assistants
	cmd := strings.TrimSpace(strings.ToLower(annot.Data.(*transcribe.Transcription).Text()))
	if strings.HasPrefix(cmd, "show example") {
		err := chromedp.Run(a.ctx, chromedp.Navigate("http://example.com"))
		if err != nil {
			log.Println("stage:", err)
		}
		return
	}
	if strings.HasPrefix(cmd, "go to") {
		url := fmt.Sprintf("https://%s", strings.Trim(strings.TrimPrefix(cmd, "go to"), " ."))
		log.Println("stage: going to:", url)
		err := chromedp.Run(a.ctx, chromedp.Navigate(url))
		if err != nil {
			log.Println("stage:", err)
		}
		return
	}
	if strings.HasPrefix(cmd, "reload") {
		log.Println("stage: reloading")
		err := chromedp.Run(a.ctx, chromedp.Reload())
		if err != nil {
			log.Println("stage:", err)
		}
		return
	}
	if strings.HasPrefix(cmd, "go back") {
		log.Println("stage: go back")
		err := chromedp.Run(a.ctx, chromedp.NavigateBack())
		if err != nil {
			log.Println("stage:", err)
		}
		return
	}
	if strings.HasPrefix(cmd, "scroll up") {
		log.Println("stage: scroll up")
		err := chromedp.Run(a.ctx, chromedp.KeyEvent(kb.Shift+" "))
		if err != nil {
			log.Println("stage:", err)
		}
		return
	}
	if strings.HasPrefix(cmd, "scroll") {
		log.Println("stage: scroll")
		err := chromedp.Run(a.ctx, chromedp.KeyEvent(" "))
		if err != nil {
			log.Println("stage:", err)
		}
		return
	}
	if strings.HasPrefix(cmd, "click") {
		text := strings.Trim(strings.TrimPrefix(cmd, "click"), " .")
		log.Println("stage: click:", text)
		xpath := fmt.Sprintf(`//a[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '%s')]`, text)
		err := chromedp.Run(a.ctx, chromedp.Click(xpath, chromedp.NodeVisible))
		if err != nil {
			log.Println("stage:", err)
		}
		return
	}
}
