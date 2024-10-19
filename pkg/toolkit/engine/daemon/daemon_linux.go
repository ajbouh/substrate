package daemon

import (
	"os"
	"os/signal"
	"syscall"
)

// TerminateOnSignal waits for SIGINT, SIGHUP, SIGTERM, SIGKILL(?) to terminate the daemon.
func TerminateOnSignal(d *Framework) {
	termSigs := make(chan os.Signal, 1)
	signal.Notify(termSigs, os.Interrupt, os.Kill, syscall.SIGHUP, syscall.SIGTERM)
	<-termSigs
	d.Terminate()
}
