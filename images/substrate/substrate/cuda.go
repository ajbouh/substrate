package substrate

import (
	"fmt"

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

func MeasureCUDAMemoryTotalMB() (int, error) {
	ret := nvml.Init()
	if ret != nvml.SUCCESS {
		return 0, fmt.Errorf("unable to initialize NVML: %v", nvmlDefaultErrorString(ret))
	}
	defer func() {
		ret := nvml.Shutdown()
		if ret != nvml.SUCCESS {
			fmt.Printf("Unable to shutdown NVML: %v\n", nvml.ErrorString(ret))
		}
	}()

	count, ret := nvml.DeviceGetCount()
	if ret != nvml.SUCCESS {
		return 0, fmt.Errorf("unable to get device count: %v", nvml.ErrorString(ret))
	}

	total := uint64(0)

	for i := 0; i < count; i++ {
		device, ret := nvml.DeviceGetHandleByIndex(i)
		if ret != nvml.SUCCESS {
			return 0, fmt.Errorf("unable to get device at index %d: %v", i, nvml.ErrorString(ret))
		}

		uuid, ret := device.GetUUID()
		if ret != nvml.SUCCESS {
			return 0, fmt.Errorf("unable to get uuid of device at index %d: %v", i, nvml.ErrorString(ret))
		}

		memory, ret := nvml.DeviceGetMemoryInfo_v2(device)
		if ret != nvml.SUCCESS {
			return 0, fmt.Errorf("unable to get memory of device at index %d with uuid %s: %v", i, uuid, nvml.ErrorString(ret))
		}

		total += memory.Total
	}

	return int(total / (1 << 20)), nil
}
