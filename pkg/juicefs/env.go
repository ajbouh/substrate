package juicefs

import (
	"os"
	"strings"
)

func getEnvMap(prefix string) map[string]string {
	m := map[string]string{}
	for _, env := range os.Environ() {
		if !strings.HasPrefix(env, prefix) {
			continue
		}

		rest := strings.TrimPrefix(env, prefix)
		split := strings.SplitN(rest, "=", 2)
		key := strings.ReplaceAll(split[0], "_", "-")
		if len(split) > 1 && split[1] != "" {
			m[key] = split[1]
		}
	}

	return m
}

func getEnvElse(key string, defaultValue string) string {
	v := os.Getenv(key)
	if v == "" {
		v = defaultValue
	}
	return v
}

func NewVolumeFromEnv(prefix string) (*Volume, error) {
	return &Volume{
		Options: getEnvMap(prefix + "OPTION_"),
		Name:    getEnvElse(prefix+"NAME", "substratefs"),
		Source:  getEnvElse(prefix+"SOURCE", "sqlite3://substratefs.db"),
		// Source:     "redis://" + v.Source,
		Mountpoint: getEnvElse(prefix+"MOUNTPOINT", "/mnt/substrate"),
	}, nil
}
