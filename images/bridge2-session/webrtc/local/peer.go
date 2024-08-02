package local

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

func NewPeer(url string) (*Peer, error) {
	conn, _, err := websocket.DefaultDialer.Dial(url, nil)
	if err != nil {
		return nil, err
	}

	rtcpeer, err := webrtc.NewPeerConnection(webrtc.Configuration{})
	if err != nil {
		return nil, err
	}

	peer := &Peer{PeerConnection: rtcpeer, ws: conn}

	for _, typ := range []webrtc.RTPCodecType{webrtc.RTPCodecTypeVideo, webrtc.RTPCodecTypeAudio} {
		if _, err := rtcpeer.AddTransceiverFromKind(typ, webrtc.RTPTransceiverInit{
			Direction: webrtc.RTPTransceiverDirectionRecvonly,
		}); err != nil {
			peer.Close()
			return nil, err
		}
	}

	rtcpeer.OnICECandidate(func(i *webrtc.ICECandidate) {
		if i == nil {
			return
		}
		if writeErr := peer.Signal("candidate", i.ToJSON()); writeErr != nil {
			log.Println(writeErr)
		}
	})

	// If PeerConnection is closed remove it from global list
	rtcpeer.OnConnectionStateChange(func(p webrtc.PeerConnectionState) {
		switch p {
		case webrtc.PeerConnectionStateFailed:
			if err := peer.Close(); err != nil {
				log.Print(err)
			}
		case webrtc.PeerConnectionStateClosed:
			//s.Sync()
		}
	})

	rtcpeer.OnTrack(func(t *webrtc.TrackRemote, _ *webrtc.RTPReceiver) {
		log.Println("received track:", t.ID())
		// trackLocal := s.addTrack(t)
		// defer s.removeTrack(trackLocal)

		// buf := make([]byte, 1500)
		// for {
		// 	i, _, err := t.Read(buf)
		// 	if err != nil {
		// 		return
		// 	}

		// 	if _, err = trackLocal.Write(buf[:i]); err != nil {
		// 		return
		// 	}
		// }
	})

	return peer, nil
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
		case "offer":
			offer := webrtc.SessionDescription{}
			if err := json.Unmarshal([]byte(sig.Data), &offer); err != nil {
				log.Println(err)
				return
			}

			if err := p.SetRemoteDescription(offer); err != nil {
				log.Println(err)
				return
			}

			answer, err := p.CreateAnswer(nil)
			if err != nil {
				log.Println(err)
				return
			}

			if err := p.SetLocalDescription(answer); err != nil {
				log.Println(err)
				return
			}

			if err := p.Signal("answer", answer); err != nil {
				log.Println(err)
				return
			}
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
