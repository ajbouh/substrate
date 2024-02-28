package sigar

import (
	sigar "github.com/cloudfoundry/gosigar"
)

type Memory struct {
	TotalMB      uint32 `json:"total_mb"`
	UsedMB       uint32 `json:"used_mb"`
	FreeMB       uint32 `json:"free_mb"`
	ActualFreeMB uint32 `json:"actual_free_mb"`
	ActualUsedMB uint32 `json:"actual_used_mb"`
}

func GetMemory() *Memory {
	mem := sigar.Mem{}
	mem.GetIgnoringCGroups()

	return &Memory{
		TotalMB:      uint32(mem.Total / (1 << 20)),
		UsedMB:       uint32(mem.Used / (1 << 20)),
		FreeMB:       uint32(mem.Free / (1 << 20)),
		ActualFreeMB: uint32(mem.ActualFree / (1 << 20)),
		ActualUsedMB: uint32(mem.ActualUsed / (1 << 20)),
	}
}

type Sample struct {
	Memory *Memory `json:"memory,omitempty"`
}

func GetSample() *Sample {
	return &Sample{
		Memory: GetMemory(),
	}
}
