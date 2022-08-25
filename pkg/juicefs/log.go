package juicefs

import (
	"fmt"

	"github.com/sirupsen/logrus"
)

func logError(format string, args ...interface{}) error {
	logrus.Errorf(format, args...)
	return fmt.Errorf(format, args...)
}

func logDebug(value ...interface{}) {
	logrus.Debug(value)
}

func logDebugf(format string, args ...interface{}) {
	logrus.Debugf(format, args...)
}

func logWithField(name string, value interface{}) *logrus.Entry {
	return logrus.WithField(name, value)
}
