package substratefs

import (
	"fmt"

	"github.com/sirupsen/logrus"
)

func logError(format string, args ...interface{}) error {
	err := fmt.Errorf(format, args...)
	logrus.Error(err)
	return err
}

func logDebug(value ...interface{}) {
	logrus.Debug(value...)
}

func logDebugf(format string, args ...interface{}) {
	logrus.Debugf(format, args...)
}

func logWithField(name string, value interface{}) *logrus.Entry {
	return logrus.WithField(name, value)
}
