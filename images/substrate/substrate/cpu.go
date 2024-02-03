package substrate

import (
	sigar "github.com/cloudfoundry/gosigar"
)

func MeasureCPUMemoryTotalMB() (int, error) {
	mem := sigar.Mem{}

	mem.Get()

	return int(mem.Total / (1 << 20)), nil
}
