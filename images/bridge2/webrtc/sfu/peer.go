package sfu

import (
	"encoding/json"
	"log"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/pion/webrtc/v3"
)

type Peer struct {
	*webrtc.PeerConnection
	ws   *websocket.Conn
	wsMu sync.Mutex
}

type signal struct {
	Event string `json:"event"`
	Data  string `json:"data"`
}

func (p *Peer) HandleSignals() {
	defer p.Close()
	sig := &signal{}
	for {
		_, raw, err := p.ws.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		} else if err := json.Unmarshal(raw, &sig); err != nil {
			log.Println(err)
			return
		}

		switch sig.Event {
		case "candidate":
			candidate := webrtc.ICECandidateInit{}
			if err := json.Unmarshal([]byte(sig.Data), &candidate); err != nil {
				log.Println(err)
				return
			}

			if err := p.AddICECandidate(candidate); err != nil {
				log.Println(err)
				return
			}
		case "answer":
			answer := webrtc.SessionDescription{}
			if err := json.Unmarshal([]byte(sig.Data), &answer); err != nil {
				log.Println(err)
				return
			}

			if err := p.SetRemoteDescription(answer); err != nil {
				log.Println(err)
				return
			}
		}
	}
}

func (p *Peer) Signal(name string, data any) error {
	p.wsMu.Lock()
	defer p.wsMu.Unlock()
	b, err := json.Marshal(data)
	if err != nil {
		return err
	}
	return p.ws.WriteJSON(map[string]any{
		"event": name,
		"data":  string(b),
	})
}

func (p *Peer) Close() (err error) {
	err = p.PeerConnection.Close()
	if err != nil {
		return
	}
	return p.ws.Close()
}
