package sysfs

type HWMonVoltage struct {
	// in[0-*]_min	Voltage min value.
	// Unit: millivolt
	// RW
	Min *int64 `json,omitempty:"min" sysfs:"read,^in\\d+_min$"`

	// in[0-*]_lcrit	Voltage critical min value.
	// Unit: millivolt
	// RW
	// If voltage drops to or below this limit, the system may
	// take drastic action such as power down or reset. At the very
	// least, it should report a fault.

	// in[0-*]_max	Voltage max value.
	// Unit: millivolt
	// RW
	Max *int64 `json:"max,omitempty" sysfs:"read,^in\\d+_max$"`

	// in[0-*]_crit	Voltage critical max value.
	// Unit: millivolt
	// RW
	// If voltage reaches or exceeds this limit, the system may
	// take drastic action such as power down or reset. At the very
	// least, it should report a fault.

	// in[0-*]_input	Voltage input value.
	// Unit: millivolt
	// RO
	// Voltage measured on the chip pin.
	// Actual voltage depends on the scaling resistors on the
	// motherboard, as recommended in the chip datasheet.
	// This varies by chip and by motherboard.
	// Because of this variation, values are generally NOT scaled
	// by the chip driver, and must be done by the application.
	// However, some drivers (notably lm87 and via686a)
	// do scale, because of internal resistors built into a chip.
	// These drivers will output the actual voltage. Rule of
	// thumb: drivers should report the voltage values at the
	// "pins" of the chip.
	Input *int64 `json:"input,omitempty" sysfs:"read,^in\\d+_input$"`

	// in[0-*]_average
	// Average voltage
	// Unit: millivolt
	// RO

	// in[0-*]_lowest
	// Historical minimum voltage
	// Unit: millivolt
	// RO

	// in[0-*]_highest
	// Historical maximum voltage
	// Unit: millivolt
	// RO

	// in[0-*]_reset_history
	// Reset inX_lowest and inX_highest
	// WO

	// in_reset_history
	// Reset inX_lowest and inX_highest for all sensors
	// WO

	// in[0-*]_label	Suggested voltage channel label.
	// Text string
	// Should only be created if the driver has hints about what
	// this voltage channel is being used for, and user-space
	// doesn't. In all other cases, the label is provided by
	// user-space.
	// RO

	// in[0-*]_enable
	// Enable or disable the sensors.
	// When disabled the sensor read will return -ENODATA.
	// 1: Enable
	// 0: Disable
	// RW

	// cpu[0-*]_vid	CPU core reference voltage.
	// Unit: millivolt
	// RO
	// Not always correct.

	// vrm		Voltage Regulator Module version number.
	// RW (but changing it should no more be necessary)
	// Originally the VRM standard version multiplied by 10, but now
	// an arbitrary number, as not all standards have a version
	// number.
	// Affects the way the driver calculates the CPU core reference
	// voltage from the vid pins.

	Fault      *bool `json:"fault,omitempty" sysfs:"read,^in\\d+_fault$"`
	Alarm      *bool `json:"alarm,omitempty" sysfs:"read,^in\\d+_alarm$"`
	MinAlarm   *bool `json:"min_alarm,omitempty" sysfs:"read,^in\\d+_min_alarm$"`
	MaxAlarm   *bool `json:"max_alarm,omitempty" sysfs:"read,^in\\d+_max_alarm$"`
	LcritAlarm *bool `json:"lcrit_alarm,omitempty" sysfs:"read,^in\\d+_lcrit_alarm$"`
	CritAlarm  *bool `json:"crit_alarm,omitempty" sysfs:"read,^in\\d+_crit_alarm$"`
	Beep       *bool `json:"beep,omitempty" sysfs:"read,^in\\d+_beep$"`
}

type HWMonFan struct {
	// fan[1-*]_min	Fan minimum value
	// Unit: revolution/min (RPM)
	// RW

	// fan[1-*]_max	Fan maximum value
	// Unit: revolution/min (RPM)
	// Only rarely supported by the hardware.
	// RW

	// fan[1-*]_input	Fan input value.
	// Unit: revolution/min (RPM)
	// RO

	// fan[1-*]_div	Fan divisor.
	// Integer value in powers of two (1, 2, 4, 8, 16, 32, 64, 128).
	// RW
	// Some chips only support values 1, 2, 4 and 8.
	// Note that this is actually an internal clock divisor, which
	// affects the measurable speed range, not the read value.

	// fan[1-*]_pulses	Number of tachometer pulses per fan revolution.
	// Integer value, typically between 1 and 4.
	// RW
	// This value is a characteristic of the fan connected to the
	// device's input, so it has to be set in accordance with the fan
	// model.
	// Should only be created if the chip has a register to configure
	// the number of pulses. In the absence of such a register (and
	// thus attribute) the value assumed by all devices is 2 pulses
	// per fan revolution.

	// fan[1-*]_target
	// Desired fan speed
	// Unit: revolution/min (RPM)
	// RW
	// Only makes sense if the chip supports closed-loop fan speed
	// control based on the measured fan speed.

	// fan[1-*]_label	Suggested fan channel label.
	// Text string
	// Should only be created if the driver has hints about what
	// this fan channel is being used for, and user-space doesn't.
	// In all other cases, the label is provided by user-space.
	// RO

	// fan[1-*]_enable
	// Enable or disable the sensors.
	// When disabled the sensor read will return -ENODATA.
	// 1: Enable
	// 0: Disable
	// RW

	// Alarm    *bool `json:"alarm,omitempty" sysfs:"read,^fan\\d+-*]_alarm$"`
	// Beep     *bool `json:"beep,omitempty" sysfs:"read,^fan\\d+-*]_beep$"`
	// Fault    *bool `json:"fault,omitempty" sysfs:"read,^fan\\d+-*]_fault$"`
	// MinAlarm *bool `json:"min_alarm,omitempty" sysfs:"read,^fan\\d+-*]_min_alarm$"`
	// MaxAlarm *bool `json:"max_alarm,omitempty" sysfs:"read,^fan\\d+-*]_max_alarm$"`
}

type HWMonPWM struct {
	// pwm[1-*]	Pulse width modulation fan control.
	// Integer value in the range 0 to 255
	// RW
	// 255 is max or 100%.

	// pwm[1-*]_enable
	// Fan speed control method:
	// 0: no fan speed control (i.e. fan at full speed)
	// 1: manual fan speed control enabled (using pwm[1-*])
	// 2+: automatic fan speed control enabled
	// Check individual chip documentation files for automatic mode
	// details.
	// RW

	// pwm[1-*]_mode	0: DC mode (direct current)
	// 1: PWM mode (pulse-width modulation)
	// RW

	// pwm[1-*]_freq	Base PWM frequency in Hz.
	// Only possibly available when pwmN_mode is PWM, but not always
	// present even then.
	// RW

	// pwm[1-*]_auto_channels_temp
	// Select which temperature channels affect this PWM output in
	// auto mode. Bitfield, 1 is temp1, 2 is temp2, 4 is temp3 etc...
	// Which values are possible depend on the chip used.
	// RW

	// pwm[1-*]_auto_point[1-*]_pwm
	// pwm[1-*]_auto_point[1-*]_temp
	// pwm[1-*]_auto_point[1-*]_temp_hyst
	// Define the PWM vs temperature curve. Number of trip points is
	// chip-dependent. Use this for chips which associate trip points
	// to PWM output channels.
	// RW
}

type HWMonTemperature struct {
	// temp[1-*]_auto_point[1-*]_pwm
	// temp[1-*]_auto_point[1-*]_temp
	// temp[1-*]_auto_point[1-*]_temp_hyst
	// Define the PWM vs temperature curve. Number of trip points is
	// chip-dependent. Use this for chips which associate trip points
	// to temperature channels.
	// RW

	// There is a third case where trip points are associated to both PWM output
	// channels and temperature channels: the PWM values are associated to PWM
	// output channels while the temperature values are associated to temperature
	// channels. In that case, the result is determined by the mapping between
	// temperature inputs and PWM outputs. When several temperature inputs are
	// mapped to a given PWM output, this leads to several candidate PWM values.
	// The actual result is up to the chip, but in general the highest candidate
	// value (fastest fan speed) wins.

	// temp[1-*]_type	Sensor type selection.
	// Integers 1 to 6
	// RW
	// 1: CPU embedded diode
	// 2: 3904 transistor
	// 3: thermal diode
	// 4: thermistor
	// 5: AMD AMDSI
	// 6: Intel PECI
	// Not all types are supported by all chips

	// temp[1-*]_max	Temperature max value.
	// Unit: millidegree Celsius (or millivolt, see below)
	// RW
	Max *int64 `json:"max,omitempty" sysfs:"read,^temp\\d+_max$"`

	// temp[1-*]_min	Temperature min value.
	// Unit: millidegree Celsius
	// RW
	Min *int64 `json:"min,omitempty" sysfs:"read,^temp\\d+_min$"`

	// temp[1-*]_max_hyst
	// Temperature hysteresis value for max limit.
	// Unit: millidegree Celsius
	// Must be reported as an absolute temperature, NOT a delta
	// from the max value.
	// RW

	// temp[1-*]_min_hyst
	// Temperature hysteresis value for min limit.
	// Unit: millidegree Celsius
	// Must be reported as an absolute temperature, NOT a delta
	// from the min value.
	// RW

	// temp[1-*]_input Temperature input value.
	// Unit: millidegree Celsius
	// RO
	Input *int64 `json:"input,omitempty" sysfs:"read,^temp\\d+_input$"`

	// temp[1-*]_crit	Temperature critical max value, typically greater than
	// corresponding temp_max values.
	// Unit: millidegree Celsius
	// RW
	Crit *int64 `json:"crit,omitempty" sysfs:"read,^temp\\d+_crit$"`

	// temp[1-*]_crit_hyst
	// Temperature hysteresis value for critical limit.
	// Unit: millidegree Celsius
	// Must be reported as an absolute temperature, NOT a delta
	// from the critical value.
	// RW

	// temp[1-*]_emergency
	// Temperature emergency max value, for chips supporting more than
	// two upper temperature limits. Must be equal or greater than
	// corresponding temp_crit values.
	// Unit: millidegree Celsius
	// RW

	// temp[1-*]_emergency_hyst
	// Temperature hysteresis value for emergency limit.
	// Unit: millidegree Celsius
	// Must be reported as an absolute temperature, NOT a delta
	// from the emergency value.
	// RW

	// temp[1-*]_lcrit	Temperature critical min value, typically lower than
	// corresponding temp_min values.
	// Unit: millidegree Celsius
	// RW

	// temp[1-*]_lcrit_hyst
	// Temperature hysteresis value for critical min limit.
	// Unit: millidegree Celsius
	// Must be reported as an absolute temperature, NOT a delta
	// from the critical min value.
	// RW

	// temp[1-*]_offset
	// Temperature offset which is added to the temperature reading
	// by the chip.
	// Unit: millidegree Celsius
	// Read/Write value.

	// temp[1-*]_label	Suggested temperature channel label.
	// Text string
	// Should only be created if the driver has hints about what
	// this temperature channel is being used for, and user-space
	// doesn't. In all other cases, the label is provided by
	// user-space.
	// RO
	Label *string `json:"label,omitempty" sysfs:"read,^temp\\d+_label$"`

	// temp[1-*]_lowest
	// Historical minimum temperature
	// Unit: millidegree Celsius
	// RO

	// temp[1-*]_highest
	// Historical maximum temperature
	// Unit: millidegree Celsius
	// RO

	// temp[1-*]_reset_history
	// Reset temp_lowest and temp_highest
	// WO

	// temp_reset_history
	// Reset temp_lowest and temp_highest for all sensors
	// WO

	// temp[1-*]_enable
	// Enable or disable the sensors.
	// When disabled the sensor read will return -ENODATA.
	// 1: Enable
	// 0: Disable
	// RW

	// Some chips measure temperature using external thermistors and an ADC, and
	// report the temperature measurement as a voltage. Converting this voltage
	// back to a temperature (or the other way around for limits) requires
	// mathematical functions not available in the kernel, so the conversion
	// must occur in user space. For these chips, all temp* files described
	// above should contain values expressed in millivolt instead of millidegree
	// Celsius. In other words, such temperature channels are handled as voltage
	// channels by the driver.

	Alarm          *bool `json:"alarm,omitempty" sysfs:"read,^temp\\d+_alarm$"`
	MinAlarm       *bool `json:"min_alarm,omitempty" sysfs:"read,^temp\\d+_min_alarm$"`
	MaxAlarm       *bool `json:"max_alarm,omitempty" sysfs:"read,^temp\\d+_max_alarm$"`
	LcritAlarm     *bool `json:"lcrit_alarm,omitempty" sysfs:"read,^temp\\d+_lcrit_alarm$"`
	CritAlarm      *bool `json:"crit_alarm,omitempty" sysfs:"read,^temp\\d+_crit_alarm$"`
	EmergencyAlarm *bool `json:"emergency_alarm,omitempty" sysfs:"read,^temp\\d+_emergency_alarm$"`
	Fault          *bool `json:"fault,omitempty" sysfs:"read,^temp\\d+_fault$"`
}

type HWMonCurrent struct {
	// curr[1-*]_max	Current max value
	// Unit: milliampere
	// RW
	Max *int64 `json:"max,omitempty" sysfs:"read,^curr\\d+_max$"`

	// curr[1-*]_min	Current min value.
	// Unit: milliampere
	// RW

	// curr[1-*]_lcrit	Current critical low value
	// Unit: milliampere
	// RW

	// curr[1-*]_crit	Current critical high value.
	// Unit: milliampere
	// RW

	// curr[1-*]_input	Current input value
	// Unit: milliampere
	// RO
	Input *int64 `json:"input,omitempty" sysfs:"read,^curr\\d+_input$"`

	// curr[1-*]_average
	// Average current use
	// Unit: milliampere
	// RO

	// curr[1-*]_lowest
	// Historical minimum current
	// Unit: milliampere
	// RO

	// curr[1-*]_highest
	// Historical maximum current
	// Unit: milliampere
	// RO

	// curr[1-*]_reset_history
	// Reset currX_lowest and currX_highest
	// WO

	// curr_reset_history
	// Reset currX_lowest and currX_highest for all sensors
	// WO

	// curr[1-*]_enable
	// Enable or disable the sensors.
	// When disabled the sensor read will return -ENODATA.
	// 1: Enable
	// 0: Disable
	// RW

	MinAlarm   *bool `json:"min_alarm,omitempty" sysfs:"read,^curr\\d+_min_alarm$"`
	MaxAlarm   *bool `json:"max_alarm,omitempty" sysfs:"read,^curr\\d+_max_alarm$"`
	LcritAlarm *bool `json:"lcrit_alarm,omitempty" sysfs:"read,^curr\\d+_lcrit_alarm$"`
	CritAlarm  *bool `json:"crit_alarm,omitempty" sysfs:"read,^curr\\d+_crit_alarm$"`
	Alarm      *bool `json:"alarm,omitempty" sysfs:"read,^curr\\d+_alarm$"`
	Beep       *bool `json:"beep,omitempty" sysfs:"read,^curr\\d+_beep$"`
}

type HWMonPower struct {
	// power[1-*]_average		Average power use
	// 		Unit: microWatt
	// 		RO

	// power[1-*]_average_interval	Power use averaging interval.  A poll
	// 		notification is sent to this file if the
	// 		hardware changes the averaging interval.
	// 		Unit: milliseconds
	// 		RW

	// power[1-*]_average_interval_max	Maximum power use averaging interval
	// 		Unit: milliseconds
	// 		RO

	// power[1-*]_average_interval_min	Minimum power use averaging interval
	// 		Unit: milliseconds
	// 		RO

	// power[1-*]_average_highest	Historical average maximum power use
	// 		Unit: microWatt
	// 		RO

	// power[1-*]_average_lowest	Historical average minimum power use
	// 		Unit: microWatt
	// 		RO

	// power[1-*]_average_max		A poll notification is sent to
	// 		power[1-*]_average when power use
	// 		rises above this value.
	// 		Unit: microWatt
	// 		RW

	// power[1-*]_average_min		A poll notification is sent to
	// 		power[1-*]_average when power use
	// 		sinks below this value.
	// 		Unit: microWatt
	// 		RW

	// power[1-*]_input		Instantaneous power use
	// 		Unit: microWatt
	// 		RO

	// power[1-*]_input_highest	Historical maximum power use
	// 		Unit: microWatt
	// 		RO

	// power[1-*]_input_lowest		Historical minimum power use
	// 		Unit: microWatt
	// 		RO

	// power[1-*]_reset_history	Reset input_highest, input_lowest,
	// 		average_highest and average_lowest.
	// 		WO

	// power[1-*]_accuracy		Accuracy of the power meter.
	// 		Unit: Percent
	// 		RO

	// power[1-*]_cap			If power use rises above this limit, the
	// 		system should take action to reduce power use.
	// 		A poll notification is sent to this file if the
	// 		cap is changed by the hardware.  The *_cap
	// 		files only appear if the cap is known to be
	// 		enforced by hardware.
	// 		Unit: microWatt
	// 		RW

	// power[1-*]_cap_hyst		Margin of hysteresis built around capping and
	// 		notification.
	// 		Unit: microWatt
	// 		RW

	// power[1-*]_cap_max		Maximum cap that can be set.
	// 		Unit: microWatt
	// 		RO

	// power[1-*]_cap_min		Minimum cap that can be set.
	// 		Unit: microWatt
	// 		RO

	// power[1-*]_max			Maximum power.
	// 		Unit: microWatt
	// 		RW

	// power[1-*]_crit			Critical maximum power.
	// 		If power rises to or above this limit, the
	// 		system is expected take drastic action to reduce
	// 		power consumption, such as a system shutdown or
	// 		a forced powerdown of some devices.
	// 		Unit: microWatt
	// 		RW

	// power[1-*]_enable		Enable or disable the sensors.
	// 		When disabled the sensor read will return
	// 		-ENODATA.
	// 		1: Enable
	// 		0: Disable
	// 		RW

	// power[1-*]_alarm
	// power[1-*]_cap_alarm
	// power[1-*]_max_alarm
	// power[1-*]_crit_alarm
}

type HWMonEnergy struct {
	// energy[1-*]_input		Cumulative energy use
	// 		Unit: microJoule
	// 		RO

	// energy[1-*]_enable		Enable or disable the sensors.
	// 		When disabled the sensor read will return
	// 		-ENODATA.
	// 		1: Enable
	// 		0: Disable
	// 		RW
}

type HWMonHumidity struct {
	// humidity[1-*]_input		Humidity
	// 		Unit: milli-percent (per cent mille, pcm)
	// 		RO

	// humidity[1-*]_enable		Enable or disable the sensors
	// 		When disabled the sensor read will return
	// 		-ENODATA.
	// 		1: Enable
	// 		0: Disable
	// 		RW
}

// Each channel or limit may have an associated alarm file, containing a
// boolean value. 1 means than an alarm condition exists, 0 means no alarm.

// Usually a given chip will either use channel-related alarms, or
// limit-related alarms, not both. The driver should just reflect the hardware
// implementation.

// Each input channel may have an associated fault file. This can be used
// to notify open diodes, unconnected fans etc. where the hardware
// supports it. When this boolean has value 1, the measurement for that
// channel should not be trusted.

// 		Input fault condition
// 		0: no fault occurred
// 		1: fault condition
// 		RO

// See also https://www.kernel.org/doc/Documentation/hwmon/sysfs-interface
type HWMonSensorChip struct {
	Name string `json:"name" sysfs:"read,name"`

	// UpdateInterval is the interval at which the chip will update readings
	// Unit: millisecond
	// RW
	// Some devices have a variable update rate or interval.This attribute can be used to change it to the desired value.
	UpdateInterval *string `json:"update_interval,omitempty" sysfs:"read,update_interval"`

	Voltages map[string]HWMonVoltage `json:"voltages,omitempty" sysfs:"group,^in\\d+"`

	Temperatures map[string]HWMonTemperature `json:"temperatures,omitempty" sysfs:"group,^temp\\d+"`

	Currents map[string]HWMonCurrent `json:"currents,omitempty" sysfs:"group,^curr\\d+"`

	// beep_enable	Master beep enable
	// 		0: no beeps
	// 		1: beeps
	// 		RW
	BeepEnable *bool `json:"beep_enable,omitempty" sysfs:"read,beep_enable"`
}

type HWMon struct {
	SensorChips map[string]HWMonSensorChip `json:"sensor_chips,omitempty" sysfs:"readdir,^hwmon\\d+$"`
}
