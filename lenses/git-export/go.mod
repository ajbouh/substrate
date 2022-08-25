module github.com/ajbouh/substrate/lenses/git-export

go 1.18

require (
	github.com/julienschmidt/httprouter v1.3.0
	github.com/ajbouh/substrate/pkg v0.0.0-00010101000000-000000000000
)

require (
	github.com/fsnotify/fsnotify v1.5.4 // indirect
	github.com/nxadm/tail v1.4.8 // indirect
	github.com/oklog/ulid/v2 v2.1.0 // indirect
	golang.org/x/sys v0.5.0 // indirect
	gopkg.in/tomb.v1 v1.0.0-20141024135613-dd632973f1e7 // indirect
)

replace github.com/ajbouh/substrate/pkg => ../../pkg
