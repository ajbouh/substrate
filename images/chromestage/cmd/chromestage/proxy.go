package main

import (
	"fmt"
	"io"
	"net"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Adjust the origin checking to suit your needs
	},
}

func novncHandler(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error upgrading to websocket:", err)
		return
	}
	defer ws.Close()

	conn := NewWebSocketConnWrapper(ws)

	backend, err := net.Dial("tcp", "localhost:5900")
	if err != nil {
		fmt.Println(err)
		return
	}
	defer backend.Close()

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		if _, err := io.Copy(backend, conn); err != nil {
			backend.Close()
			fmt.Println(err)
		}
		wg.Done()
	}()
	wg.Add(1)
	go func() {
		if _, err := io.Copy(conn, backend); err != nil {
			backend.Close()
			fmt.Println(err)
		}
		wg.Done()
	}()
	wg.Wait()
}

type WebSocketConnWrapper struct {
	Conn        *websocket.Conn
	readMessage []byte
	readErr     error
	readIndex   int
}

func NewWebSocketConnWrapper(conn *websocket.Conn) *WebSocketConnWrapper {
	return &WebSocketConnWrapper{Conn: conn}
}

func (w *WebSocketConnWrapper) Read(p []byte) (n int, err error) {
	if w.readIndex >= len(w.readMessage) {
		_, w.readMessage, w.readErr = w.Conn.ReadMessage()
		w.readIndex = 0
	}

	if w.readErr != nil {
		return 0, w.readErr
	}

	n = copy(p, w.readMessage[w.readIndex:])
	w.readIndex += n
	return n, nil
}

func (w *WebSocketConnWrapper) Write(p []byte) (n int, err error) {
	err = w.Conn.WriteMessage(websocket.BinaryMessage, p)
	if err != nil {
		return 0, err
	}
	return len(p), nil
}

func (w *WebSocketConnWrapper) Close() error {
	return w.Conn.Close()
}
