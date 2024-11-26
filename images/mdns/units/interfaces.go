package units

import (
	"errors"
	"net"
)

func IsMulticast(iface net.Interface) bool {
	if (iface.Flags & net.FlagUp) == 0 {
		return false
	}
	if (iface.Flags & net.FlagMulticast) > 0 {
		return true
	}
	return false
}

func IsNonLoopbackUnicast(iface net.Interface) bool {
	if (iface.Flags & net.FlagUp) == 0 {
		return false
	}
	if (iface.Flags & net.FlagLoopback) > 0 {
		return false
	}
	if (iface.Flags & net.FlagPointToPoint) > 0 {
		return false
	}
	if (iface.Flags & net.FlagMulticast) == 0 {
		return false
	}
	if (iface.Flags & net.FlagBroadcast) == 0 {
		return false
	}

	return true
}

func IsIPv4(addr net.Addr) bool {
	if ipnet, ok := addr.(*net.IPNet); ok {
		return ipnet.IP.To4() != nil
	}
	return false
}

func Addrs(interfaces []net.Interface) ([]net.Addr, error) {
	var addrs []net.Addr
	var errs []error
	for _, m := range interfaces {
		a, err := m.Addrs()
		if err != nil {
			errs = append(errs, err)
		} else {
			addrs = append(addrs, a...)
		}
	}

	return addrs, errors.Join(errs...)
}

func IPAddrStrings(ts []net.Addr) []string {
	return MapFilter(func(t net.Addr) (string, bool) {
		if ip, ok := t.(*net.IPNet); ok {
			return ip.IP.String(), true
		}
		return "", false
	}, ts)
}

func Map[T any, S any](f func(t T) S, ts []T) []S {
	new := make([]S, 0, len(ts))
	for _, t := range ts {
		new = append(new, f(t))
	}

	return new
}

func MapFilter[T any, S any](f func(t T) (S, bool), ts []T) []S {
	new := make([]S, 0, len(ts))
	for _, t := range ts {
		s, ok := f(t)
		if !ok {
			continue
		}
		new = append(new, s)
	}

	return new
}

func Filter[T any](f func(t T) bool, ts []T) []T {
	if f == nil {
		return ts
	}

	var new []T
	for _, t := range ts {
		if f(t) {
			new = append(new, t)
		}
	}

	return new
}
