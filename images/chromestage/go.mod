module chromestage

go 1.22.2

require (
	github.com/ajbouh/substrate/pkg/commands v0.0.0-00010101000000-000000000000
	github.com/chromedp/cdproto v0.0.0-20231011050154-1d073bb38998
	github.com/chromedp/chromedp v0.9.3
	github.com/gorilla/websocket v1.5.1
	tractor.dev/toolkit-go v0.0.0-20240111035846-6a7f40f8500e
)

require (
	github.com/chromedp/sysutil v1.0.0 // indirect
	github.com/gobwas/httphead v0.1.0 // indirect
	github.com/gobwas/pool v0.2.1 // indirect
	github.com/gobwas/ws v1.3.0 // indirect
	github.com/josharian/intern v1.0.0 // indirect
	github.com/mailru/easyjson v0.7.7 // indirect
	golang.org/x/net v0.17.0 // indirect
	golang.org/x/sys v0.13.0 // indirect
)

replace github.com/ajbouh/substrate/pkg/commands => ../../pkg/commands
