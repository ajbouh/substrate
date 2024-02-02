package substratefs

// Based on https://github.com/gofrs/flock commit 6f010d1acea74a32f2f2066bfe324c08bbee30e3

// Copyright 2015 Tim Heckman. All rights reserved.
// Use of this source code is governed by the BSD 3-Clause
// license that can be found in the LICENSE file.

// Package flock implements a thread-safe interface for file locking.
// It also includes a non-blocking TryLock() function to allow locking
// without blocking execution.
//
// Package flock is released under the BSD 3-Clause License. See the LICENSE file
// for more details.

import (
	"errors"
	"os"
	"path"
	"sync"
	"syscall"
)

type LockClaim func() error

func (c LockClaim) Release() error {
	return c()
}

func tryLock(pth string, exclusive bool) (LockClaim, bool, error) {
	lock := Flock(pth)
	var unlock func() error
	var ok bool
	var err error

	if exclusive {
		unlock, ok, err = lock.TryLock()
	} else {
		unlock, ok, err = lock.TryRLock()
	}

	// If the root directory doesn't exist for some reason, mkdirAll it and retry.
	if err != nil && errors.Is(err, os.ErrNotExist) {
		err = mkdirAll(path.Dir(pth))
		if err != nil {
			return nil, false, err
		}

		if exclusive {
			unlock, ok, err = lock.TryLock()
		} else {
			unlock, ok, err = lock.TryRLock()
		}
	}

	if err != nil {
		return nil, false, err
	}
	if !ok {
		return nil, false, err
	}

	return LockClaim(unlock), true, nil
}

// Flock is the struct type to handle file locking. All fields are unexported,
// with access to some of the fields provided by getter methods (Path() and Locked()).
type Flock string

func (f Flock) open() (*os.File, error) {
	// open a new os.File instance
	// create it if it doesn't exist, and open the file read-only.
	flags := os.O_CREATE | os.O_RDONLY
	fh, err := os.OpenFile(string(f), flags, os.FileMode(0600))
	if err != nil {
		return fh, err
	}

	// set the filehandle on the struct
	return fh, nil
}

// TryLock is the preferred function for taking an exclusive file lock. This
// function takes an RW-mutex lock before it tries to lock the file, so there is
// the possibility that this function may block for a short time if another
// goroutine is trying to take any action.
//
// The actual file lock is non-blocking. If we are unable to get the exclusive
// file lock, the function will return false instead of waiting for the lock. If
// we get the lock, we also set the *Flock instance as being exclusive-locked.
func (f Flock) TryLock() (func() error, bool, error) {
	return f.try(syscall.LOCK_EX)
}

// TryRLock is the preferred function for taking a shared file lock. This
// function takes an RW-mutex lock before it tries to lock the file, so there is
// the possibility that this function may block for a short time if another
// goroutine is trying to take any action.
//
// The actual file lock is non-blocking. If we are unable to get the shared file
// lock, the function will return false instead of waiting for the lock. If we
// get the lock, we also set the *Flock instance as being share-locked.
func (f Flock) TryRLock() (func() error, bool, error) {
	return f.try(syscall.LOCK_SH)
}

func (f Flock) try(flag int) (func() error, bool, error) {
	fh, err := f.open()
	if err != nil {
		return nil, false, err
	}

	var retried bool
retry:
	err = syscall.Flock(int(fh.Fd()), flag|syscall.LOCK_NB)

	switch err {
	case syscall.EWOULDBLOCK:
		defer fh.Close()
		return nil, false, nil
	case nil:
		mu := &sync.Mutex{}
		return func() error {
			mu.Lock()
			defer mu.Unlock()

			if fh == nil {
				return nil
			}

			if err := syscall.Flock(int(fh.Fd()), syscall.LOCK_UN); err != nil {
				return err
			}

			fh.Close()
			fh = nil

			return nil
		}, true, nil
	}
	if !retried {
		var shouldRetry bool
		var reopenErr error
		fh, shouldRetry, reopenErr = f.reopenFDOnError(fh, err)
		if reopenErr != nil {
			return nil, false, reopenErr
		} else if shouldRetry {
			retried = true
			goto retry
		}
	}
	defer fh.Close()

	return nil, false, err
}

// reopenFDOnError determines whether we should reopen the file handle
// in readwrite mode and try again. This comes from util-linux/sys-utils/flock.c:
//
//	Since Linux 3.4 (commit 55725513)
//	Probably NFSv4 where flock() is emulated by fcntl().
func (f Flock) reopenFDOnError(fh *os.File, err error) (*os.File, bool, error) {
	if err != syscall.EIO && err != syscall.EBADF {
		return nil, false, nil
	}
	if st, err := fh.Stat(); err == nil {
		// if the file is able to be read and written
		if st.Mode()&0600 == 0600 {
			fh.Close()
			fh = nil

			// reopen in read-write mode and set the filehandle
			fh, err := os.OpenFile(string(f), os.O_CREATE|os.O_RDWR, os.FileMode(0600))
			if err != nil {
				return nil, false, err
			}
			return fh, true, nil
		}
	}

	return nil, false, nil
}
