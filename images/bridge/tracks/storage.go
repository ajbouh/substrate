package tracks

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
)

type SessionStoragePaths struct {
	SessionDir string
}

func (p *SessionStoragePaths) Dir(scope string) string {
	dir := filepath.Join(p.SessionDir, scope)
	err := os.MkdirAll(dir, 0744)
	fatal(err)
	return dir
}

func (p *SessionStoragePaths) File(scope ...string) string {
	dirfragments := append([]string{p.SessionDir}, scope[:len(scope)-1]...)
	dir := filepath.Join(dirfragments...)
	err := os.MkdirAll(dir, 0744)
	fatal(err)
	filefragment := scope[len(scope)-1]
	return filepath.Join(dir, filefragment)
}

func fatal(err error) {
	if err != nil {
		log.Fatalf("FATAL", err)
	}
}

type SessionSaver struct {
	Session             *Session
	SessionStoragePaths *SessionStoragePaths
}

func (m *SessionSaver) saveSession() error {
	b, err := cborenc.Marshal(m.Session)
	if err != nil {
		return err
	}
	filename := fmt.Sprintf("%s/session", m.SessionStoragePaths.SessionDir)
	if err := os.WriteFile(filename, b, 0644); err != nil {
		return err
	}
	// for debugging!
	// b, err = json.Marshal(sess)
	// if err != nil {
	// 	return err
	// }
	// filename = fmt.Sprintf("%s/%s/session.json", m.sessionDir, id)
	// if err := os.WriteFile(filename, b, 0644); err != nil {
	// 	return err
	// }
	return nil
}

func (m *SessionSaver) Serve(ctx context.Context) {
	fatal(os.MkdirAll(m.SessionStoragePaths.SessionDir, 0744))

	for range m.Session.UpdateHandler(ctx) {
		log.Printf("saving session")
		fatal(m.saveSession())
	}
}

func (m *SessionSaver) TerminateDaemon(ctx context.Context) error {
	if err := m.saveSession(); err != nil {
		return err
	}
	return nil
}
