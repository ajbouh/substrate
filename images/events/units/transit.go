package units

import (
	"archive/zip"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/elnormous/contenttype"

	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

func WriteZip(ctx context.Context, w io.Writer, dq event.DataQuerier, events []event.Event) error {
	zw := zip.NewWriter(w)
	defer zw.Close()

	for _, ev := range events {
		fieldsName := "records/json/" + ev.ID.String()
		fw, err := zw.CreateHeader(&zip.FileHeader{
			Name:     fieldsName,
			Modified: time.UnixMilli(int64(ev.ID.Time())),
		})
		if err != nil {
			return fmt.Errorf("error creating header for %s: %w", fieldsName, err)
		}

		err = json.NewEncoder(fw).Encode(ev)
		if err != nil {
			return fmt.Errorf("error writing data for %s: %w", fieldsName, err)
		}

		if ev.DataSHA256 != nil {
			dataName := "records/data/" + ev.ID.String()
			fw, err := zw.CreateHeader(&zip.FileHeader{
				Name:     dataName,
				Modified: time.UnixMilli(int64(ev.ID.Time())),
			})
			if err != nil {
				return fmt.Errorf("error creating header for %s: %w", dataName, err)
			}

			dr, err := dq.QueryEventData(ctx, ev.ID)
			if err != nil {
				return fmt.Errorf("error finding data for %s: %w", dataName, err)
			}

			_, err = io.Copy(fw, dr)
			if err != nil {
				return fmt.Errorf("error writing data for %s: %w", dataName, err)
			}
		}
	}

	return nil
}

type recordZipEntry struct {
	JSON *zip.File
	Data *zip.File
}

func recordEntriesFromZip(files []*zip.File) map[event.ID]*recordZipEntry {
	recordJSONPrefix := "records/json/"
	recordDataPrefix := "records/data/"

	recordEntries := map[event.ID]*recordZipEntry{}
	ensureEntry := func(id event.ID) *recordZipEntry {
		e, ok := recordEntries[id]
		if !ok {
			e = &recordZipEntry{}
			recordEntries[id] = e
		}
		return e
	}

	for _, f := range files {
		switch {
		case strings.HasPrefix(f.Name, recordJSONPrefix):
			idStr := strings.TrimPrefix(f.Name, recordJSONPrefix)
			id, err := event.ParseID(idStr)
			if err != nil {
				slog.Info("recordEntriesFromZip", "name", f.Name, "file", f)
				break
			}
			ensureEntry(id).JSON = f
		case strings.HasPrefix(f.Name, recordDataPrefix):
			idStr := strings.TrimPrefix(f.Name, recordDataPrefix)
			id, err := event.ParseID(idStr)
			if err != nil {
				slog.Info("recordEntriesFromZip", "name", f.Name, "file", f)
				break
			}
			ensureEntry(id).Data = f
		}
	}

	return recordEntries
}

func PendingFromZip(r io.ReaderAt, size int64) (*event.PendingEventSet, error) {
	zr, err := zip.NewReader(r, size)
	if err != nil {
		return nil, err
	}

	recordEntries := recordEntriesFromZip(zr.File)
	b := event.NewPendingEventSetBuilder(len(recordEntries))
	for _, entry := range recordEntries {
		zfe, err := zr.Open(entry.JSON.Name)
		if err != nil {
			return nil, err
		}
		defer zfe.Close()

		zfeb, err := io.ReadAll(zfe)
		if err != nil {
			return nil, err
		}

		var pending event.Event
		// err = json.NewDecoder(zfe).Decode(&pending)
		err = json.NewDecoder(bytes.NewBuffer(zfeb)).Decode(&pending)
		if err != nil {
			return nil, fmt.Errorf("could not parse records %s: %w", string(zfeb), err)
		}

		var data func() (io.ReadCloser, error)
		if entry.Data != nil {
			data = entry.Data.Open
		}

		var vector *event.VectorInput[float32]
		if pending.Vector != nil {
			vector = &event.VectorInput[float32]{
				ManifoldID: pending.Vector.Manifold.ID,
				Data:       pending.Vector.Data,
			}
		}

		b.Append(
			pending.Payload,
			data,
			vector,
			nil,
		)
	}

	return b.Finish(), nil
}

func WriteFromZip(ctx context.Context, ew event.Writer, since event.ID, r io.ReaderAt, size int64) (event.ID, error) {
	var wroteID event.ID

	set, err := PendingFromZip(r, size)
	if err != nil {
		return wroteID, err
	}

	err = ew.WriteEvents(
		ctx,
		since,
		set,
		func(i int, id event.ID, dataSize int64, dataSha256 []byte) {
			wroteID = id
		},
	)

	return wroteID, err
}

type ImportEventsReturns struct {
	MaxID event.ID `json:"max_id"`
}

// Ideally this would be the same interface as events:write
var ImportEventsCommand = handle.HTTPCommand(
	"events:import", "Import events to store",
	"POST /events/import", "/",
	func(ctx context.Context,
		t *struct {
			Writer event.Writer
		},
		args struct {
			Since  event.ID `query:"since"`
			Import []byte   `json:"import"`
			// Reader io.ReadCloser `json:"-"`
		},
	) (ImportEventsReturns, error) {
		slog.Info("ImportEventsCommand", "t", t, "args", args)
		returns := ImportEventsReturns{}

		f, err := os.CreateTemp("", "")
		if err != nil {
			return returns, err
		}
		defer os.Remove(f.Name())

		n, err := f.Write(args.Import)

		// defer args.Reader.Close()
		// n, err := io.Copy(f, args.Reader)
		if err != nil {
			return returns, err
		}

		returns.MaxID, err = WriteFromZip(ctx, t.Writer, args.Since, f, int64(n))
		return returns, err
	})

type ExportEventsReturns struct {
	Export []byte `json:"export,omitempty"`
}

var ExportEventsCommand = handle.HTTPCommand(
	"events:export", "Export events from store",
	"POST /events/export", "/",
	func(ctx context.Context,
		t *struct {
			Querier     event.Querier
			DataQuerier event.DataQuerier
		},
		args struct {
			Query *event.Query `json:"query"`
			// TODO figure out how to use header
			Accept string              `json:"accept"`
			Writer http.ResponseWriter `json:"-"`
		},
	) (ExportEventsReturns, error) {
		returns := ExportEventsReturns{}

		sq := args.Query
		if sq == nil {
			return returns, &handle.HTTPStatusError{
				Status: http.StatusBadRequest,
			}
		}

		var err error
		slog.Info("ExportEventsCommand", "t", t, "args", args, "sq", sq)
		events, _, _, err := t.Querier.QueryEvents(ctx, sq)
		if err != nil {
			return returns, &handle.HTTPStatusError{
				Err:    err,
				Status: http.StatusInternalServerError,
			}
		}

		// req := httpframework.ContextOriginalRequest(ctx)

		availableMediaTypes := []contenttype.MediaType{
			contenttype.NewMediaType("application/json"),
			contenttype.NewMediaType("application/json; charset=utf-8"),
			contenttype.NewMediaType("application/zip"),
			contenttype.NewMediaType("application/x-zip"),
			contenttype.NewMediaType("application/x-zip-compressed"),
		}

		accepted, _, err := contenttype.GetAcceptableMediaTypeFromHeader(args.Accept, availableMediaTypes)
		if err != nil {
			return returns, &handle.HTTPStatusError{
				Err:    err,
				Status: http.StatusUnsupportedMediaType,
			}
		}

		switch accepted.Type + "/" + accepted.Subtype {
		case "application/json", "":
			// header := args.Writer.Header()
			// header.Set("Content-Type", "application/json")
			// err = json.NewEncoder(args.Writer).Encode(returns)
			var b bytes.Buffer
			err = WriteZip(ctx, &b, t.DataQuerier, events)
			returns.Export = b.Bytes()
			return returns, err
		case "application/zip", "application/x-zip", "application/x-zip-compressed":
			header := args.Writer.Header()
			header.Set("Content-Type", accepted.Type+"/"+accepted.Subtype)
			err = WriteZip(ctx, args.Writer, t.DataQuerier, events)
			return returns, err
		}

		return returns, &handle.HTTPStatusError{
			Status: http.StatusUnsupportedMediaType,
		}
	})
