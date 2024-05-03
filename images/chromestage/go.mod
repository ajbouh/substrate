module chromestage

go 1.22.2

require (
	github.com/ajbouh/substrate/pkg/toolkit v0.0.0-00010101000000-000000000000
	github.com/chromedp/cdproto v0.0.0-20231011050154-1d073bb38998
	github.com/chromedp/chromedp v0.9.3
	github.com/gorilla/websocket v1.5.1
	tractor.dev/toolkit-go v0.0.0-20240810203015-1b3d95b70efe
)

require (
	github.com/chromedp/sysutil v1.0.0 // indirect
	github.com/elnormous/contenttype v1.0.4 // indirect
	github.com/gobwas/httphead v0.1.0 // indirect
	github.com/gobwas/pool v0.2.1 // indirect
	github.com/gobwas/ws v1.3.0 // indirect
	github.com/josharian/intern v1.0.0 // indirect
	github.com/mailru/easyjson v0.7.7 // indirect
	golang.org/x/net v0.17.0 // indirect
	golang.org/x/sys v0.13.0 // indirect
)

replace github.com/ajbouh/substrate/pkg/toolkit => ../../pkg/toolkit
