module github.com/ajbouh/substrate/services/screenshot

go 1.21

toolchain go1.21.1

require (
	github.com/ajbouh/substrate/pkg v0.0.0-00010101000000-000000000000
	github.com/chromedp/cdproto v0.0.0-20220924210414-0e3390be1777
	github.com/chromedp/chromedp v0.8.6
)

require (
	github.com/chromedp/sysutil v1.0.0 // indirect
	github.com/gobwas/httphead v0.1.0 // indirect
	github.com/gobwas/pool v0.2.1 // indirect
	github.com/gobwas/ws v1.1.0 // indirect
	github.com/josharian/intern v1.0.0 // indirect
	github.com/mailru/easyjson v0.7.7 // indirect
	golang.org/x/net v0.18.0 // indirect
	golang.org/x/sys v0.14.0 // indirect
	golang.org/x/text v0.14.0 // indirect
)

replace github.com/ajbouh/substrate/pkg => ../../pkg
