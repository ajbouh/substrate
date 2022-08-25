package juicefs

import (
	"fmt"
	"os"
	"os/exec"
	"strings"
	"syscall"
	"time"
)

const (
	eeCliPath = "/bin/juicefs-ee"
	ceCliPath = "/bin/juicefs-ce"
)

type Volume struct {
	Name        string
	Options     map[string]string
	Source      string
	Mountpoint  string
	connections int
}

func (v *Volume) ceMount(errCh chan<- error) error {
	// copy option map
	options := map[string]string{}
	for k, v := range v.Options {
		options[k] = v
	}

	// possible options for `juicefs format`
	format := exec.Command(ceCliPath, "format", "--no-update")
	formatOptions := []string{
		"block-size",
		"compress",
		"shards",
		"storage",
		"bucket",
		"access-key",
		"secret-key",
		"encrypt-rsa-key",
	}
	for _, formatOption := range formatOptions {
		val, ok := options[formatOption]
		if !ok {
			continue
		}
		format.Args = append(format.Args, fmt.Sprintf("--%s=%s", formatOption, val))
		delete(options, formatOption)
	}
	format.Args = append(format.Args, v.Source, v.Name)
	logDebug(format)
	if out, err := format.CombinedOutput(); err != nil {
		errCh <- err
		return logError("juicefs format error: %q: %w", out, err.Error())
	}

	// options left for `juicefs mount`
	mount := exec.Command(ceCliPath, "mount")
	mountFlags := []string{
		"cache-partial-only",
		"enable-xattr",
		"no-syslog",
		"no-usage-report",
		"writeback",
	}
	for _, mountFlag := range mountFlags {
		_, ok := options[mountFlag]
		if !ok {
			continue
		}
		mount.Args = append(mount.Args, fmt.Sprintf("--%s", mountFlag))
		delete(options, mountFlag)
	}
	for mountOption, val := range options {
		mount.Args = append(mount.Args, fmt.Sprintf("--%s=%s", mountOption, val))
	}
	mount.Args = append(mount.Args, v.Source, v.Mountpoint)
	mount.Stderr = os.Stderr
	mount.Stdout = os.Stdout
	logDebug(mount)
	go func() {
		err := mount.Run()
		if err != nil {
			logError("juicefs mount error: %s", err)
		} else {
			logDebugf("juicefs mount succeeded")
		}
		errCh <- err
	}()

	touch := func() error {
		file, err := os.Create(v.Mountpoint + "/.juicefs")
		if err == nil {
			defer file.Close()
		}
		return err
	}
	var fileinfo os.FileInfo
	var err error
	for attempt := 0; attempt < 10; attempt++ {
		if fileinfo, err = os.Lstat(v.Mountpoint); err == nil {
			stat, ok := fileinfo.Sys().(*syscall.Stat_t)
			if !ok {
				return logError("Not a syscall.Stat_t")
			}
			if stat.Ino == 1 {
				if err = touch(); err == nil {
					return nil
				}
			} else {
				err = fmt.Errorf("unexpected stat.Ino value: %d", stat.Ino)
			}
		}
		logDebugf("Error in attempt %d: %#v", attempt+1, err)
		time.Sleep(time.Second)
	}
	return logError(err.Error())
}

func (v *Volume) eeMount() error {
	// copy option map
	options := map[string]string{}
	for k, v := range v.Options {
		options[k] = v
	}

	// possible options for `juicefs auth`
	auth := exec.Command(eeCliPath, "auth", v.Name)
	authOptions := []string{
		"token",
		"accesskey",
		"accesskey2",
		"bucket",
		"bucket2",
		"secretkey",
		"secretkey2",
		"passphrase",
	}
	for _, authOption := range authOptions {
		val, ok := options[authOption]
		if !ok {
			continue
		}
		// auth 的参数确实可以是空, 没有flag
		auth.Args = append(auth.Args, fmt.Sprintf("--%s=%s", authOption, val))
		delete(options, authOption)
	}
	logDebug(auth)
	if out, err := auth.CombinedOutput(); err != nil {
		return logError("juicefs auth error: %q: %w", string(out), err.Error())
	}

	// options left for `juicefs mount`
	mount := exec.Command(eeCliPath, "mount", v.Name, v.Mountpoint)
	mountFlags := []string{
		"external",
		"internal",
		"gc",
		"dry",
		"flip",
		"no-sync",
		"allow-other",
		"allow-root",
		"enable-xattr",
	}
	for _, mountFlag := range mountFlags {
		_, ok := options[mountFlag]
		if !ok {
			continue
		}
		mount.Args = append(mount.Args, fmt.Sprintf("--%s", mountFlag))
		delete(options, mountFlag)
	}
	for mountOption, val := range options {
		mount.Args = append(mount.Args, fmt.Sprintf("--%s=%s", mountOption, val))
	}
	logDebug(mount)
	if out, err := mount.CombinedOutput(); err != nil {
		return logError("juicefs mount error: %q: %w", string(out), err.Error())
	}

	touch := func() error {
		file, err := os.Create(v.Mountpoint + "/.juicefs")
		if err == nil {
			defer file.Close()
		}
		return err
	}
	var fileinfo os.FileInfo
	var err error
	for attempt := 0; attempt < 3; attempt++ {
		if fileinfo, err = os.Lstat(v.Mountpoint); err == nil {
			stat, ok := fileinfo.Sys().(*syscall.Stat_t)
			if !ok {
				return logError("Not a syscall.Stat_t")
			}
			if stat.Ino == 1 {
				if err = touch(); err == nil {
					return nil
				}
			}
		}
		logDebugf("Error in attempt %d: %#v", attempt+1, err)
		time.Sleep(time.Second)
	}
	return logError(err.Error())
}

func (v *Volume) Mount(errCh chan<- error) error {
	fi, err := os.Lstat(v.Mountpoint)
	if os.IsNotExist(err) {
		if err := os.MkdirAll(v.Mountpoint, 0755); err != nil {
			return logError(err.Error())
		}
	} else if err != nil {
		return logError(err.Error())
	}

	if fi != nil && !fi.IsDir() {
		return logError("%v already exist and it's not a directory", v.Mountpoint)
	}

	if !strings.Contains(v.Source, "://") {
		return v.eeMount()
	}
	return v.ceMount(errCh)
}

func (v *Volume) Umount() error {
	cmd := exec.Command("umount", v.Mountpoint)
	logDebug(cmd)
	if out, err := cmd.CombinedOutput(); err != nil {
		return logError("juicefs umount error: %q: %w", string(out), err.Error())
	}
	return nil
}
