//go:build !linux

package daemon

import (
	"os"
	"os/signal"
)

// TerminateOnSignal waits for SIGINT, SIGKILL(?) to terminate the daemon.
func TerminateOnSignal(d *Framework) {
	termSigs := make(chan os.Signal, 1)
	signal.Notify(termSigs, os.Interrupt, os.Kill)
	<-termSigs
	d.Terminate()
}
