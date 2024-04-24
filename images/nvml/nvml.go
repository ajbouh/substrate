package nvml

import (
	"context"
	"fmt"
	"log"
	"strconv"

	"github.com/NVIDIA/go-nvml/pkg/nvml"
)

// From https://github.com/NVIDIA/go-nvlib/blob/main/pkg/nvml/return.go#L38
func nvmlDefaultErrorString(r nvml.Return) string {
	switch nvml.Return(r) {
	case nvml.SUCCESS:
		return "SUCCESS"
	case nvml.ERROR_UNINITIALIZED:
		return "ERROR_UNINITIALIZED"
	case nvml.ERROR_INVALID_ARGUMENT:
		return "ERROR_INVALID_ARGUMENT"
	case nvml.ERROR_NOT_SUPPORTED:
		return "ERROR_NOT_SUPPORTED"
	case nvml.ERROR_NO_PERMISSION:
		return "ERROR_NO_PERMISSION"
	case nvml.ERROR_ALREADY_INITIALIZED:
		return "ERROR_ALREADY_INITIALIZED"
	case nvml.ERROR_NOT_FOUND:
		return "ERROR_NOT_FOUND"
	case nvml.ERROR_INSUFFICIENT_SIZE:
		return "ERROR_INSUFFICIENT_SIZE"
	case nvml.ERROR_INSUFFICIENT_POWER:
		return "ERROR_INSUFFICIENT_POWER"
	case nvml.ERROR_DRIVER_NOT_LOADED:
		return "ERROR_DRIVER_NOT_LOADED"
	case nvml.ERROR_TIMEOUT:
		return "ERROR_TIMEOUT"
	case nvml.ERROR_IRQ_ISSUE:
		return "ERROR_IRQ_ISSUE"
	case nvml.ERROR_LIBRARY_NOT_FOUND:
		return "ERROR_LIBRARY_NOT_FOUND"
	case nvml.ERROR_FUNCTION_NOT_FOUND:
		return "ERROR_FUNCTION_NOT_FOUND"
	case nvml.ERROR_CORRUPTED_INFOROM:
		return "ERROR_CORRUPTED_INFOROM"
	case nvml.ERROR_GPU_IS_LOST:
		return "ERROR_GPU_IS_LOST"
	case nvml.ERROR_RESET_REQUIRED:
		return "ERROR_RESET_REQUIRED"
	case nvml.ERROR_OPERATING_SYSTEM:
		return "ERROR_OPERATING_SYSTEM"
	case nvml.ERROR_LIB_RM_VERSION_MISMATCH:
		return "ERROR_LIB_RM_VERSION_MISMATCH"
	case nvml.ERROR_IN_USE:
		return "ERROR_IN_USE"
	case nvml.ERROR_MEMORY:
		return "ERROR_MEMORY"
	case nvml.ERROR_NO_DATA:
		return "ERROR_NO_DATA"
	case nvml.ERROR_VGPU_ECC_NOT_SUPPORTED:
		return "ERROR_VGPU_ECC_NOT_SUPPORTED"
	case nvml.ERROR_INSUFFICIENT_RESOURCES:
		return "ERROR_INSUFFICIENT_RESOURCES"
	case nvml.ERROR_UNKNOWN:
		return "ERROR_UNKNOWN"
	default:
		return fmt.Sprintf("unknown return value: %d", r)
	}
}

type Sampler struct {
}

func (m *Sampler) Serve(ctx context.Context) {
	ret := nvml.Init()
	if ret != nvml.SUCCESS {
		log.Fatalf("unable to initialize NVML: %v", nvmlDefaultErrorString(ret))
	}
}

func (m *Sampler) Terminate() {
	ret := nvml.Shutdown()
	if ret != nvml.SUCCESS {
		fmt.Printf("unable to shutdown NVML: %v\n", nvml.ErrorString(ret))
	}
}

func (m *Sampler) Get() (*Sample, error) {
	count, ret := nvml.DeviceGetCount()
	if ret != nvml.SUCCESS {
		return nil, fmt.Errorf("unable to get device count: %v", nvml.ErrorString(ret))
	}

	devices := map[string]*Device{}
	processes := map[string]*ProcessInfo{}
	for i := 0; i < count; i++ {
		device, ret := nvml.DeviceGetHandleByIndex(i)
		if ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get device at index %d: %v", i, nvml.ErrorString(ret))
		}

		uuid, ret := device.GetUUID()
		if ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get uuid of device at index %d: %v", i, nvml.ErrorString(ret))
		}

		d := &Device{}
		devices[uuid] = d

		if memory, ret := device.GetMemoryInfo_v2(); ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get memory of device at index %d with uuid %s: %v", i, uuid, nvml.ErrorString(ret))
		} else {
			d.Memory = &Memory{
				TotalMB:    uint32(memory.Total / (1 << 20)),
				ReservedMB: uint32(memory.Reserved / (1 << 20)),
				FreeMB:     uint32(memory.Free / (1 << 20)),
				UsedMB:     uint32(memory.Used / (1 << 20)),
			}
		}

		if name, ret := device.GetName(); ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get: device name: %s", nvml.ErrorString(ret))
		} else {
			d.Name = name
		}

		if util, ret := device.GetUtilizationRates(); ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get: device name: %s", nvml.ErrorString(ret))
		} else {
			d.Utilization = &Utilization{
				GPU:    util.Gpu,
				Memory: util.Memory,
			}
		}

		if running, ret := device.GetComputeRunningProcesses(); ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get: running processes: %s", nvml.ErrorString(ret))
		} else {
			d.Processes = map[string]*DeviceProcessInfo{}
			for _, p := range running {
				pidKey := strconv.Itoa(int(p.Pid))
				existing := processes[pidKey]
				if existing == nil {
					existing = &ProcessInfo{}
					processes[pidKey] = existing
				}
				existing.Devices = append(existing.Devices, uuid)

				d.Processes[pidKey] = &DeviceProcessInfo{
					PID:               p.Pid,
					UsedGPUMemoryMB:   uint32(p.UsedGpuMemory / (1 << 20)),
					GPUInstanceID:     p.GpuInstanceId,
					ComputeInstanceID: p.ComputeInstanceId,
				}
			}
		}

		if pcieSpeed, ret := device.GetPcieSpeed(); ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get: PCIe speed: %s", nvml.ErrorString(ret))
		} else {
			d.PCIeSpeed = pcieSpeed
		}

		// if PcieThroughput, ret := device.GetPcieThroughput( PcieUtilCounter); ret != nvml.SUCCESS {

		// }

		if pcieLinkMaxSpeed, ret := device.GetPcieLinkMaxSpeed(); ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get: PCIe link max speed: %s", nvml.ErrorString(ret))
		} else {
			d.PCIeLinkMaxSpeed = pcieLinkMaxSpeed
		}

		if pcieReplayCounter, ret := device.GetPcieReplayCounter(); ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get: PCIe replay counter: %s", nvml.ErrorString(ret))
		} else {
			d.PCIeReplayCounter = pcieReplayCounter
		}

		if nFans, ret := device.GetNumFans(); ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get: num fans: %s", nvml.ErrorString(ret))
		} else {
			fans := map[string]*Fan{}
			d.Fans = fans
			for fan := 0; fan < nFans; fan++ {
				if fanSpeed, ret := device.GetFanSpeed_v2(fan); ret != nvml.SUCCESS {
					return nil, fmt.Errorf("unable to get: device name: %s", nvml.ErrorString(ret))
				} else {
					fans[strconv.Itoa(fan)] = &Fan{Speed: fanSpeed}
				}
			}
		}

		if enforcedPowerLimit, ret := device.GetEnforcedPowerLimit(); ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get: enforced power limit: %s", nvml.ErrorString(ret))
		} else {
			d.EnforcedPowerLimit = enforcedPowerLimit
		}

		if major, minor, ret := device.GetCudaComputeCapability(); ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get: cuda compute capability: %s", nvml.ErrorString(ret))
		} else {
			d.CUDAComputeCapability = []int{major, minor}
		}

		if currPcieLinkGeneration, ret := device.GetCurrPcieLinkGeneration(); ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get: current PCIe link generation: %s", nvml.ErrorString(ret))
		} else {
			d.CurrPCIeLinkGeneration = currPcieLinkGeneration
		}

		if currPcieLinkWidth, ret := device.GetCurrPcieLinkWidth(); ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get: current PCIe link width: %s", nvml.ErrorString(ret))
		} else {
			d.CurrPCIeLinkWidth = currPcieLinkWidth
		}
	}

	return &Sample{Devices: devices, Processes: processes}, nil
}

type Sample struct {
	Devices   map[string]*Device      `json:"devices"`
	Processes map[string]*ProcessInfo `json:"processes"`
}

type Device struct {
	Name        string       `json:"name"`
	Memory      *Memory      `json:"memory"`
	Utilization *Utilization `json:"utilization"`

	CUDAComputeCapability []int `json:"cuda_compute_capability"`

	Fans map[string]*Fan `json:"fans"`

	PCIeSpeed              int    `json:"pcie_speed"`
	PCIeLinkMaxSpeed       uint32 `json:"pcie_link_max_speed"`
	PCIeReplayCounter      int    `json:"pcie_replay_counter"`
	EnforcedPowerLimit     uint32 `json:"enforced_power_limit"`
	CurrPCIeLinkGeneration int    `json:"curr_pcie_link_generation"`
	CurrPCIeLinkWidth      int    `json:"curr_pcie_link_width"`

	Processes map[string]*DeviceProcessInfo `json:"processes"`
}

type Fan struct {
	Speed uint32 `json:"speed"`
}

type Utilization struct {
	GPU    uint32 `json:"gpu"`
	Memory uint32 `json:"memory"`
}

type Memory struct {
	TotalMB    uint32 `json:"total_mb"`
	ReservedMB uint32 `json:"reserved_mb"`
	FreeMB     uint32 `json:"free_mb"`
	UsedMB     uint32 `json:"used_mb"`
}

type DeviceProcessInfo struct {
	PID               uint32 `json:"pid"`
	UsedGPUMemoryMB   uint32 `json:"use_gpu_memory_mb"`
	GPUInstanceID     uint32 `json:"gpu_instance_id"`
	ComputeInstanceID uint32 `json:"compute_instance_id"`
}

type ProcessInfo struct {
	Devices []string `json:"devices"`
}
