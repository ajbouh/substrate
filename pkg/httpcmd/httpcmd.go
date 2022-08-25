package httpcmd

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"time"

	"github.com/julienschmidt/httprouter"
	"github.com/nxadm/tail"
	ulid "github.com/oklog/ulid/v2"
)

// A handler that runs a specific cmd, writing stdout/err to a log dir
// Also streams that stdout/err to http client, but *does not* fail the run if client goes away

// unique ID for run -> log
// unique ID for run -> pid status

// A directory for logs
// Generate an ID for the run, use that as subdirectory
// Can tail from subdirectory/output
// Can read status from subdirectory/status

func tailRunOutput(baseDir, runID string, rw http.ResponseWriter, req *http.Request) {
	runDir := filepath.Join(baseDir, runID)
	outputPath := filepath.Join(runDir, "output")
	statusPath := filepath.Join(runDir, "status")

	t, err := tail.TailFile(outputPath, tail.Config{Follow: true, ReOpen: true})
	if err != nil {
		http.Error(rw, fmt.Sprintf(`{"message": %q}`, err.Error()), http.StatusInternalServerError)
		return
	}

	// Stop streaming once request context ends
	go func() {
		defer t.Stop()
		<-req.Context().Done()
	}()

	// Stop finish stream once process finishes
	go func() {
		defer t.Stop()
		for {
			_, err := os.Stat(statusPath)
			if err == nil {
				return
			}

			select {
			case <-req.Context().Done():
				return
			default:
				time.Sleep(5 * time.Second)
			}
		}
	}()

	defer t.Cleanup()

	flusher, ok := rw.(http.Flusher)
	if !ok {
		fmt.Println("warning: can't stream output without response writer supporting http.Flusher")
	}

	for line := range t.Lines {
		rw.Write([]byte(line.Text))
		rw.Write([]byte("\n"))

		if ok {
			flusher.Flush()
		}
	}
}

func Mount(router *httprouter.Router, urlPrefix string, newCmd func() *exec.Cmd, baseDir string) {
	router.Handle("POST", urlPrefix+"/", func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
		runID := ulid.Make().String()
		runDir := filepath.Join(baseDir, runID)
		err := os.MkdirAll(runDir, 0o755)
		if err != nil {
			http.Error(rw, fmt.Sprintf(`{"message": %q}`, err.Error()), http.StatusInternalServerError)
			return
		}

		outputPath := filepath.Join(runDir, "output")
		statusPath := filepath.Join(runDir, "status")
		f, err := os.Create(outputPath)
		if err != nil {
			http.Error(rw, fmt.Sprintf(`{"message": %q}`, err.Error()), http.StatusInternalServerError)
			return
		}
		defer f.Close()

		cmd := newCmd()
		cmd.Stdin = nil
		cmd.Stdout = f
		cmd.Stderr = f

		err = cmd.Start()
		if err != nil {
			http.Error(rw, fmt.Sprintf(`{"message": %q}`, err.Error()), http.StatusInternalServerError)
			return
		}

		go func() {
			err := cmd.Wait()
			state := cmd.ProcessState
			var errorMessage *string
			if err != nil {
				s := err.Error()
				errorMessage = &s
			}

			status := map[string]any{
				"Error": errorMessage,
			}
			if state != nil {
				status["ExitCode"] = state.ExitCode()
				status["Pid"] = state.Pid()
				status["UserTime"] = state.UserTime()
				status["SystemTime"] = state.SystemTime()
			}

			statusF, err := os.Create(statusPath)
			if err != nil {
				fmt.Printf("runID=%s err=%s\n", runID, err)
				return
			}
			defer statusF.Close()
			err = json.NewEncoder(statusF).Encode(status)
			if err != nil {
				fmt.Printf("runID=%s err=%s\n", runID, err)
				return
			}
		}()

		rw.Header().Set("Location", urlPrefix+"/"+runID+"/output")
		rw.WriteHeader(http.StatusCreated)

		tailRunOutput(baseDir, runID, rw, req)
	})

	router.Handle("GET", urlPrefix+"/:run/output", func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
		runID := p.ByName("run")
		tailRunOutput(baseDir, runID, rw, req)
	})

	router.Handle("GET", urlPrefix+"/:run/status", func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
		runID := p.ByName("run")
		runDir := filepath.Join(baseDir, runID)
		statusPath := filepath.Join(runDir, "status")

		f, err := os.Open(statusPath)
		if err != nil {
			http.Error(rw, fmt.Sprintf(`{"message": %q}`, err.Error()), http.StatusInternalServerError)
			return
		}
		defer f.Close()

		io.Copy(rw, f)
	})
}
