package sigar

import (
	"errors"
	"slices"
	"syscall"

	sigar "github.com/cloudfoundry/gosigar"
)

func SetProcd(d string) {
	sigar.Procd = d
}

func uint64Ptr(i uint64) *uint64 {
	return &i
}

type Memory struct {
	TotalMB      uint32 `json:"total_mb"`
	UsedMB       uint32 `json:"used_mb"`
	FreeMB       uint32 `json:"free_mb"`
	ActualFreeMB uint32 `json:"actual_free_mb"`
	ActualUsedMB uint32 `json:"actual_used_mb"`
}

func GetMemory() (*Memory, error) {
	mem := sigar.Mem{}
	err := mem.GetIgnoringCGroups()
	if err != nil {
		return nil, err
	}

	return &Memory{
		TotalMB:      uint32(mem.Total / (1 << 20)),
		UsedMB:       uint32(mem.Used / (1 << 20)),
		FreeMB:       uint32(mem.Free / (1 << 20)),
		ActualFreeMB: uint32(mem.ActualFree / (1 << 20)),
		ActualUsedMB: uint32(mem.ActualUsed / (1 << 20)),
	}, nil
}

type System struct {
	Memory *Memory `json:"memory,omitempty"`
}

type Sample struct {
	System    *System               `json:"system,omitempty"`
	Processes map[int]*ProcessStats `json:"processes,omitempty"`
	Errors    []string              `json:"errors,omitempty"`
}

func GetSample() (*Sample, error) {
	sample := &Sample{
		System:    &System{},
		Processes: map[int]*ProcessStats{},
	}

	var errs []error

	var err error
	sample.System.Memory, err = GetMemory()
	if err != nil {
		errs = append(errs, err)
	}

	sample.Processes, err = GetProcesses()
	if err != nil {
		errs = append(errs, err)
	}

	if len(errs) != 0 {
		sample.Errors = make([]string, 0, len(errs))
		for _, err := range errs {
			sample.Errors = append(sample.Errors, err.Error())
		}
	}

	return sample, nil
}

type ProcessStats struct {
	PPID      int `json:"ppid"`
	Processor int `json:"processor"`

	SizeMB     *uint64 `json:"size_mb,omitempty"`
	ResidentMB *uint64 `json:"resident_mb,omitempty"`
	ShareMB    *uint64 `json:"share_mb,omitempty"`

	StartTime *uint64 `json:"start,omitempty"`
	User      *uint64 `json:"user,omitempty"`
	Sys       *uint64 `json:"sys,omitempty"`
	Total     *uint64 `json:"total,omitempty"`

	Children []int `json:"children"`
}

func GetProcesses() (map[int]*ProcessStats, error) {
	statsByPID := map[int]*ProcessStats{}

	var errs []error

	var include func(pid int) *ProcessStats
	include = func(pid int) *ProcessStats {
		// if we've already got it, we're done
		if stats, ok := statsByPID[pid]; ok {
			return stats
		}

		procState := &sigar.ProcState{}

		// if we don't already have it, get its parent first
		if err := procState.Get(pid); err != nil {
			errs = append(errs, err)
			return nil
		}

		// append as a child to parent if we have one
		parent := include(procState.Ppid)
		if parent != nil {
			parent.Children = append(parent.Children, pid)
		}

		stats := &ProcessStats{
			PPID:      procState.Ppid,
			Processor: procState.Processor,
		}
		statsByPID[pid] = stats

		m := &sigar.ProcMem{}
		if err := m.Get(pid); err == nil {
			stats.SizeMB = uint64Ptr(m.Size / (1 << 20))
			stats.ResidentMB = uint64Ptr(m.Resident / (1 << 20))
			stats.ShareMB = uint64Ptr(m.Share / (1 << 20))
		} else {
			errs = append(errs, err)
		}

		t := &sigar.ProcTime{}
		if err := t.Get(pid); err == nil {
			stats.StartTime = &t.StartTime
			stats.User = &t.User
			stats.Sys = &t.Sys
			stats.Total = &t.Total
		} else {
			errs = append(errs, err)
		}

		return stats
	}

	all := &sigar.ProcList{}
	if err := all.Get(); err != nil {
		return statsByPID, err
	}

	for _, pid := range all.List {
		include(pid)
	}

	// ignore "no such process errors"
	errs = slices.DeleteFunc(errs, func(err error) bool { return errors.Is(err, syscall.ESRCH) })

	if len(errs) != 0 {
		return statsByPID, errors.Join(errs...)
	}

	return statsByPID, nil
}
