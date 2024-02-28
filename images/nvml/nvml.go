package nvml

import (
	"fmt"
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
		return fmt.Sprintf("Unknown return value: %d", r)
	}
}

func GetSample() (*Sample, error) {
	ret := nvml.Init()
	if ret != nvml.SUCCESS {
		return nil, fmt.Errorf("unable to initialize NVML: %v", nvmlDefaultErrorString(ret))
	}
	defer func() {
		ret := nvml.Shutdown()
		if ret != nvml.SUCCESS {
			fmt.Printf("Unable to shutdown NVML: %v\n", nvml.ErrorString(ret))
		}
	}()

	count, ret := nvml.DeviceGetCount()
	if ret != nvml.SUCCESS {
		return nil, fmt.Errorf("unable to get device count: %v", nvml.ErrorString(ret))
	}

	devices := map[string]*Device{}
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

		if memory, ret := nvml.DeviceGetMemoryInfo_v2(device); ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get memory of device at index %d with uuid %s: %v", i, uuid, nvml.ErrorString(ret))
		} else {
			d.Memory = &Memory{
				TotalMB:    uint32(memory.Total / (1 << 20)),
				ReservedMB: uint32(memory.Reserved / (1 << 20)),
				FreeMB:     uint32(memory.Free / (1 << 20)),
				UsedMB:     uint32(memory.Used / (1 << 20)),
			}
		}

		if name, ret := nvml.DeviceGetName(device); ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get: device name: %s", nvml.ErrorString(ret))
		} else {
			d.Name = name
		}

		if util, ret := nvml.DeviceGetUtilizationRates(device); ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get: device name: %s", nvml.ErrorString(ret))
		} else {
			d.Utilization = &Utilization{
				GPU:    util.Gpu,
				Memory: util.Memory,
			}
		}

		if pcieSpeed, ret := nvml.DeviceGetPcieSpeed(device); ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get: device name: %s", nvml.ErrorString(ret))
		} else {
			d.PCIeSpeed = pcieSpeed
		}

		// if PcieThroughput, ret := nvml.DeviceGetPcieThroughput(deviceCounter PcieUtilCounter); ret != nvml.SUCCESS {

		// }

		if pcieLinkMaxSpeed, ret := nvml.DeviceGetPcieLinkMaxSpeed(device); ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get: device name: %s", nvml.ErrorString(ret))
		} else {
			d.PCIeLinkMaxSpeed = pcieLinkMaxSpeed
		}

		if pcieReplayCounter, ret := nvml.DeviceGetPcieReplayCounter(device); ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get: device name: %s", nvml.ErrorString(ret))
		} else {
			d.PCIeReplayCounter = pcieReplayCounter
		}

		if nFans, ret := nvml.DeviceGetNumFans(device); ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get: device name: %s", nvml.ErrorString(ret))
		} else {
			fans := map[string]*Fan{}
			d.Fans = fans
			for fan := 0; fan < nFans; fan++ {
				if fanSpeed, ret := nvml.DeviceGetFanSpeed_v2(device, fan); ret != nvml.SUCCESS {
					return nil, fmt.Errorf("unable to get: device name: %s", nvml.ErrorString(ret))
				} else {
					fans[strconv.Itoa(fan)] = &Fan{Speed: fanSpeed}
				}
			}
		}

		if enforcedPowerLimit, ret := nvml.DeviceGetEnforcedPowerLimit(device); ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get: device name: %s", nvml.ErrorString(ret))
		} else {
			d.EnforcedPowerLimit = enforcedPowerLimit
		}

		if major, minor, ret := nvml.DeviceGetCudaComputeCapability(device); ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get: device name: %s", nvml.ErrorString(ret))
		} else {
			d.CUDAComputeCapability = []int{major, minor}
		}

		if currPcieLinkGeneration, ret := nvml.DeviceGetCurrPcieLinkGeneration(device); ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get: device name: %s", nvml.ErrorString(ret))
		} else {
			d.CurrPCIeLinkGeneration = currPcieLinkGeneration
		}

		if currPcieLinkWidth, ret := nvml.DeviceGetCurrPcieLinkWidth(device); ret != nvml.SUCCESS {
			return nil, fmt.Errorf("unable to get: device name: %s", nvml.ErrorString(ret))
		} else {
			d.CurrPCIeLinkWidth = currPcieLinkWidth
		}
	}

	return &Sample{Devices: devices}, nil
}

type Sample struct {
	Devices map[string]*Device `json:"devices"`
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
