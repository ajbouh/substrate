package juicefs

import (
	"os"
	"os/exec"
)

func Sync(src string, dst string) error {
	cmd := exec.Command("/bin/juicefs-ce", "sync", src, dst)
	cmd.Stderr = os.Stderr
	cmd.Stdout = os.Stdout
	return cmd.Run()
}
