package main

import (
	"log"
	"os"
	"os/signal"
	"strconv"
	"syscall"

	"github.com/sirupsen/logrus"

	"github.com/ajbouh/substrate/pkg/juicefs"
)

func main() {
	debug := os.Getenv("DEBUG")
	if ok, _ := strconv.ParseBool(debug); ok {
		logrus.SetLevel(logrus.DebugLevel)
	}

	juicefsVolume, err := juicefs.NewVolumeFromEnv("SUBSTRATEFS_JUICEFS_")
	if err != nil {
		log.Fatal(err)
	}

	errCh := make(chan error, 1)
	err = juicefsVolume.Mount(errCh)
	if err != nil {
		log.Fatal(err)
	}
	defer juicefsVolume.Umount()

	logrus.Infof("mounted at %s", juicefsVolume.Mountpoint)

	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, os.Interrupt, syscall.SIGTERM)

	select {
	case err := <-errCh:
		logrus.Infof("shutting down due to caught err %s", err)
		return
	case sig := <-sigCh:
		logrus.Infof("shutting down due to caught signal %s", sig)
		return
	}
}
