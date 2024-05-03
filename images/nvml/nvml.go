package nvml

import (
	"context"
	"fmt"
	"log"
	"strconv"
	"time"

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
	MachineID string
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

func (m *Sampler) GetDevicePCIE(device *nvml.Device) (*DevicePCIE, error) {
	d := &DevicePCIE{}

	var ret nvml.Return

	d.PCIeSpeed, ret = device.GetPcieSpeed()
	if ret != nvml.SUCCESS {
		return nil, fmt.Errorf("unable to get: PCIe speed: %s", nvml.ErrorString(ret))
	}

	// PcieThroughput, ret = device.GetPcieThroughput( PcieUtilCounter)

	d.PCIeLinkMaxSpeed, ret = device.GetPcieLinkMaxSpeed()
	if ret != nvml.SUCCESS {
		return nil, fmt.Errorf("unable to get: PCIe link max speed: %s", nvml.ErrorString(ret))
	}

	d.PCIeReplayCounter, ret = device.GetPcieReplayCounter()
	if ret != nvml.SUCCESS {
		return nil, fmt.Errorf("unable to get: PCIe replay counter: %s", nvml.ErrorString(ret))
	}

	d.CurrPCIeLinkGeneration, ret = device.GetCurrPcieLinkGeneration()
	if ret != nvml.SUCCESS {
		return nil, fmt.Errorf("unable to get: current PCIe link generation: %s", nvml.ErrorString(ret))
	}

	d.CurrPCIeLinkWidth, ret = device.GetCurrPcieLinkWidth()
	if ret != nvml.SUCCESS {
		return nil, fmt.Errorf("unable to get: current PCIe link width: %s", nvml.ErrorString(ret))
	}

	return d, nil
}

func (m *Sampler) GetDeviceThermalThresholds(device *nvml.Device) (*DeviceThermalThresholds, error) {
	d := &DeviceThermalThresholds{}

	var ret nvml.Return

	var t uint32

	t, ret = device.GetTemperatureThreshold(nvml.TEMPERATURE_THRESHOLD_SHUTDOWN)
	if ret == nvml.SUCCESS {
		d.Shutdown = &t
	}

	t, ret = device.GetTemperatureThreshold(nvml.TEMPERATURE_THRESHOLD_SLOWDOWN)
	if ret == nvml.SUCCESS {
		d.Slowdown = &t
	}

	t, ret = device.GetTemperatureThreshold(nvml.TEMPERATURE_THRESHOLD_MEM_MAX)
	if ret == nvml.SUCCESS {
		d.MemMax = &t
	}

	t, ret = device.GetTemperatureThreshold(nvml.TEMPERATURE_THRESHOLD_GPU_MAX)
	if ret == nvml.SUCCESS {
		d.GPUMax = &t
	}

	t, ret = device.GetTemperatureThreshold(nvml.TEMPERATURE_THRESHOLD_ACOUSTIC_MIN)
	if ret == nvml.SUCCESS {
		d.AcousticMin = &t
	}

	t, ret = device.GetTemperatureThreshold(nvml.TEMPERATURE_THRESHOLD_ACOUSTIC_CURR)
	if ret == nvml.SUCCESS {
		d.AcousticCurr = &t
	}

	t, ret = device.GetTemperatureThreshold(nvml.TEMPERATURE_THRESHOLD_ACOUSTIC_MAX)
	if ret == nvml.SUCCESS {
		d.AcousticMax = &t
	}

	return d, nil
}

func (m *Sampler) GetDeviceThermals(device *nvml.Device) (*DeviceThermals, error) {
	d := &DeviceThermals{}

	if nFans, ret := device.GetNumFans(); ret != nvml.SUCCESS {
		return nil, fmt.Errorf("unable to get: num fans: %s", nvml.ErrorString(ret))
	} else {
		fans := map[string]*Fan{}
		d.Fans = fans
		for fan := 0; fan < nFans; fan++ {
			fanSpeed, ret := device.GetFanSpeed_v2(fan)
			if ret != nvml.SUCCESS {
				return nil, fmt.Errorf("unable to get: fan speed: %s", nvml.ErrorString(ret))
			}

			// The fan speed is expressed as a percentage of the product's maximum noise tolerance fan speed. This value may exceed 100% in certain cases.
			targetFanSpeed, ret := device.GetTargetFanSpeed(fan)
			if ret != nvml.SUCCESS {
				return nil, fmt.Errorf("unable to get: target fan speed: %s", nvml.ErrorString(ret))
			}

			fans[strconv.Itoa(fan)] = &Fan{Speed: fanSpeed, TargetSpeed: targetFanSpeed}
		}
	}

	var ret nvml.Return

	// TODO
	// GetThermalSettings(uint32) (GpuThermalSettings, Return)

	// Retrieves the current temperature readings for the device, in degrees C.
	d.Temperature, ret = device.GetTemperature(nvml.TEMPERATURE_GPU)
	if ret != nvml.SUCCESS {
		return nil, fmt.Errorf("unable to get: get temperature: %s", nvml.ErrorString(ret))
	}

	var err error
	d.Thresholds, err = m.GetDeviceThermalThresholds(device)
	if err != nil {
		return nil, err
	}

	return d, nil
}

func (m *Sampler) GetDevicePower(device *nvml.Device) (*DevicePower, error) {
	d := &DevicePower{}

	var ret nvml.Return

	// Retrieves power usage for this GPU in milliwatts and its associated circuitry (e.g. memory)
	d.PowerUsageMilliW, ret = device.GetPowerUsage()
	if ret != nvml.SUCCESS {
		// return nil, fmt.Errorf("unable to get: get power usage: %s", nvml.ErrorString(ret))
	}
	// The power limit defines the upper boundary for the card's power draw. If the card's total power draw reaches this limit the power management algorithm kicks in.
	d.PowerManagementLimitMilliW, ret = device.GetPowerManagementLimit()
	if ret != nvml.SUCCESS {
		return nil, fmt.Errorf("unable to get: get power management limit: %s", nvml.ErrorString(ret))
	}

	d.PowerManagementDefaultLimitMilliW, ret = device.GetPowerManagementDefaultLimit()
	if ret != nvml.SUCCESS {
		return nil, fmt.Errorf("unable to get: get power management default limit: %s", nvml.ErrorString(ret))
	}

	// This flag indicates whether any power management algorithm is currently active on the device. An enabled state does not necessarily mean the device is being actively throttled -- only that that the driver will do so if the appropriate conditions are met.
	powerManagementMode, ret := device.GetPowerManagementMode()
	if ret != nvml.SUCCESS {
		return nil, fmt.Errorf("unable to get: get power management mode enabled: %s", nvml.ErrorString(ret))
	}
	d.PowerManagementModeEnabled = powerManagementMode == nvml.FEATURE_ENABLED

	// Retrieves information about possible values of power management limits on this device.
	d.PowerManagementLimitConstraintsMinMilliW, d.PowerManagementLimitConstraintsMaxMilliW, ret = device.GetPowerManagementLimitConstraints()
	if ret != nvml.SUCCESS {
		return nil, fmt.Errorf("unable to get: get power management limit constraints: %s", nvml.ErrorString(ret))
	}

	d.EnforcedPowerLimitMilliW, ret = device.GetEnforcedPowerLimit()
	if ret != nvml.SUCCESS {
		return nil, fmt.Errorf("unable to get: enforced power limit: %s", nvml.ErrorString(ret))
	}

	return d, nil
}

func (m *Sampler) Exports(ctx context.Context) (any, error) {
	return map[string]any{"data": m.Get()}, nil
}

func (m *Sampler) Get() *Sample {
	start := time.Now().UTC()
	var ret nvml.Return

	sample := &Sample{
		MachineID:            m.MachineID,
		StartMicros:          start.UnixMicro(),
		SampleDurationMicros: time.Now().UTC().Sub(start).Microseconds(),
	}

	systemDriverVersion, ret := nvml.SystemGetDriverVersion()
	if ret != nvml.SUCCESS {
		sample.Errors = append(sample.Errors, fmt.Sprintf("unable to get: system driver version: %s", nvml.ErrorString(ret)))
	} else {
		sample.SystemDriverVersion = &systemDriverVersion
	}

	systemNVMLVersion, ret := nvml.SystemGetNVMLVersion()
	if ret != nvml.SUCCESS {
		sample.Errors = append(sample.Errors, fmt.Sprintf("unable to get: system nvml version: %s", nvml.ErrorString(ret)))
	} else {
		sample.SystemNVMLVersion = &systemNVMLVersion
	}

	cudaDriverVersion, ret := nvml.SystemGetCudaDriverVersion_v2()
	if ret != nvml.SUCCESS {
		sample.Errors = append(sample.Errors, fmt.Sprintf("unable to get: cuda driver version: %s", nvml.ErrorString(ret)))
	} else {
		sample.CUDADriverVersion = &cudaDriverVersion
	}

	devices := map[string]*Device{}
	processes := map[string]*ProcessInfo{}

	count, ret := nvml.DeviceGetCount()
	if ret != nvml.SUCCESS {
		sample.Errors = append(sample.Errors, fmt.Sprintf("unable to get device count: %v", nvml.ErrorString(ret)))
	}

	if count > 0 {
		sample.Devices = devices
		sample.Processes = processes
	}

	for i := 0; i < count; i++ {
		device, ret := nvml.DeviceGetHandleByIndex(i)
		if ret != nvml.SUCCESS {
			sample.Errors = append(sample.Errors, fmt.Sprintf("unable to get device at index %d: %v", i, nvml.ErrorString(ret)))
		}

		uuid, ret := device.GetUUID()
		if ret != nvml.SUCCESS {
			sample.Errors = append(sample.Errors, fmt.Sprintf("unable to get uuid of device at index %d: %v", i, nvml.ErrorString(ret)))
		}

		d := &Device{}
		devices[uuid] = d

		if memory, ret := device.GetMemoryInfo_v2(); ret != nvml.SUCCESS {
			sample.Errors = append(sample.Errors, fmt.Sprintf("unable to get memory of device at index %d with uuid %s: %v", i, uuid, nvml.ErrorString(ret)))
		} else {
			d.Memory = &Memory{
				TotalMB:    uint32(memory.Total / (1 << 20)),
				ReservedMB: uint32(memory.Reserved / (1 << 20)),
				FreeMB:     uint32(memory.Free / (1 << 20)),
				UsedMB:     uint32(memory.Used / (1 << 20)),
			}
		}

		d.Name, ret = device.GetName()
		if ret != nvml.SUCCESS {
			sample.Errors = append(sample.Errors, fmt.Sprintf("unable to get: device name: %s", nvml.ErrorString(ret)))
		}

		if util, ret := device.GetUtilizationRates(); ret != nvml.SUCCESS {
			sample.Errors = append(sample.Errors, fmt.Sprintf("unable to get: utilization rates: %s", nvml.ErrorString(ret)))
		} else {
			d.Utilization = &Utilization{
				GPU:    util.Gpu,
				Memory: util.Memory,
			}
		}

		if running, ret := device.GetComputeRunningProcesses(); ret != nvml.SUCCESS {
			sample.Errors = append(sample.Errors, fmt.Sprintf("unable to get: running processes: %s", nvml.ErrorString(ret)))
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

		if major, minor, ret := device.GetCudaComputeCapability(); ret != nvml.SUCCESS {
			sample.Errors = append(sample.Errors, fmt.Sprintf("unable to get: cuda compute capability: %s", nvml.ErrorString(ret)))
		} else {
			d.CUDAComputeCapability = []int{major, minor}
		}

		d.VBIOSVersion, ret = device.GetVbiosVersion()
		if ret != nvml.SUCCESS {
			sample.Errors = append(sample.Errors, fmt.Sprintf("unable to get: vbios version: %s", nvml.ErrorString(ret)))
		}

		d.BoardPartNumber, ret = device.GetBoardPartNumber()
		if ret != nvml.SUCCESS {
			sample.Errors = append(sample.Errors, fmt.Sprintf("unable to get: board part number: %s", nvml.ErrorString(ret)))
		}

		// Retrieves total energy consumption for this GPU in millijoules (mJ) since the driver was last reloaded
		d.TotalEnergyConsumptionMilliJ, ret = device.GetTotalEnergyConsumption()
		if ret != nvml.SUCCESS {
			sample.Errors = append(sample.Errors, fmt.Sprintf("unable to get: total energy consumption: %s", nvml.ErrorString(ret)))
		}

		d.NumGPUCores, ret = device.GetNumGpuCores()
		if ret != nvml.SUCCESS {
			sample.Errors = append(sample.Errors, fmt.Sprintf("unable to get: number of GPU cores: %s", nvml.ErrorString(ret)))
		}

		var err error

		d.PCIE, err = m.GetDevicePCIE(&device)
		if err != nil {
			sample.Errors = append(sample.Errors, err.Error())
		}

		d.Thermals, err = m.GetDeviceThermals(&device)
		if err != nil {
			sample.Errors = append(sample.Errors, err.Error())
		}

		d.Power, err = m.GetDevicePower(&device)
		if err != nil {
			sample.Errors = append(sample.Errors, err.Error())
		}

		// TODO
		// SetFanSpeed_v2(int, int) Return
		// SetPowerManagementLimit_v2(*PowerValue_v2) Return
		// SetDefaultFanSpeed_v2(int) Return
		// SetTemperatureThreshold(TemperatureThresholds, int) Return
	}

	sample.SampleDurationMicros = time.Now().UTC().Sub(start).Microseconds()

	return sample
}

type Sample struct {
	MachineID            string `json:"machine_id"`
	StartMicros          int64  `json:"start_us"`
	SampleDurationMicros int64  `json:"sample_duration_us"`

	SystemDriverVersion *string `json:"system_driver_version"`
	SystemNVMLVersion   *string `json:"system_nvml_version"`
	CUDADriverVersion   *int    `json:"cuda_driver_version"`

	Devices   map[string]*Device      `json:"devices"`
	Processes map[string]*ProcessInfo `json:"processes"`

	Errors []string `json:"errors,omitempty"`
}

type DevicePower struct {
	EnforcedPowerLimitMilliW                 uint32 `json:"enforced_power_limit_milliw"`
	PowerUsageMilliW                         uint32 `json:"power_usage_milliw"`
	PowerManagementLimitMilliW               uint32 `json:"power_management_limit_milliw"`
	PowerManagementDefaultLimitMilliW        uint32 `json:"power_management_default_limit_milliw"`
	PowerManagementModeEnabled               bool   `json:"power_management_mode_enabled"`
	PowerManagementLimitConstraintsMinMilliW uint32 `json:"power_management_limit_constraints_min_milliw"`
	PowerManagementLimitConstraintsMaxMilliW uint32 `json:"power_management_limit_constraints_max_milliw"`
}

type DevicePCIE struct {
	PCIeSpeed              int    `json:"pcie_speed"`
	PCIeLinkMaxSpeed       uint32 `json:"pcie_link_max_speed"`
	PCIeReplayCounter      int    `json:"pcie_replay_counter"`
	CurrPCIeLinkGeneration int    `json:"curr_pcie_link_generation"`
	CurrPCIeLinkWidth      int    `json:"curr_pcie_link_width"`
}

type DeviceThermalThresholds struct {
	Shutdown     *uint32 `json:"shutdown,omitempty"`
	Slowdown     *uint32 `json:"slowdown,omitempty"`
	MemMax       *uint32 `json:"mem_max,omitempty"`
	GPUMax       *uint32 `json:"gpu_max,omitempty"`
	AcousticMin  *uint32 `json:"acoustic_min,omitempty"`
	AcousticCurr *uint32 `json:"acoustic_curr,omitempty"`
	AcousticMax  *uint32 `json:"acoustic_max,omitempty"`
}

type DeviceThermals struct {
	Temperature uint32                   `json:"temperature"`
	Fans        map[string]*Fan          `json:"fans"`
	Thresholds  *DeviceThermalThresholds `json:"thresholds"`
}

type Device struct {
	Name string `json:"name"`

	VBIOSVersion    string `json:"vbios_version"`
	BoardPartNumber string `json:"board_part_number"`

	Memory      *Memory         `json:"memory"`
	Utilization *Utilization    `json:"utilization"`
	PCIE        *DevicePCIE     `json:"pcie"`
	Thermals    *DeviceThermals `json:"thermals"`
	Power       *DevicePower    `json:"power"`

	CUDAComputeCapability []int `json:"cuda_compute_capability"`

	NumGPUCores int `json:"num_gpu_cores"`

	TotalEnergyConsumptionMilliJ uint64 `json:"total_energy_consumption_millij"`

	Processes map[string]*DeviceProcessInfo `json:"processes"`
}

type Fan struct {
	Speed       uint32 `json:"speed"`
	TargetSpeed int    `json:"target_speed"`
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
