package sfu

import (
	"log"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/pion/rtcp"
	"github.com/pion/webrtc/v3"
)

type Session struct {
	peers  []*Peer
	tracks map[string]*webrtc.TrackLocalStaticRTP
	mu     sync.RWMutex
}

func NewSession() *Session {
	sess := &Session{
		tracks: make(map[string]*webrtc.TrackLocalStaticRTP),
	}
	go func() {
		// TODO: make configurable or put somewhere else
		for range time.NewTicker(time.Second * 3).C {
			sess.broadcastKeyFrame()
		}
	}()
	return sess
}

func (s *Session) AddPeer(conn *websocket.Conn) (*Peer, error) {
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

	s.mu.Lock()
	s.peers = append(s.peers, peer)
	badPeerID := len(s.peers) - 1
	s.mu.Unlock()

	log.Println("new peer:", badPeerID)

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
		log.Println("peer state:", badPeerID, p)
		switch p {
		case webrtc.PeerConnectionStateFailed:
			if err := peer.Close(); err != nil {
				log.Print(err)
			}
		case webrtc.PeerConnectionStateClosed:
			s.Sync()
		}
	})

	rtcpeer.OnTrack(func(t *webrtc.TrackRemote, _ *webrtc.RTPReceiver) {
		log.Println("peer track:", badPeerID, t.ID())
		trackLocal := s.addTrack(t)
		defer s.removeTrack(trackLocal)

		buf := make([]byte, 1500)
		for {
			i, _, err := t.Read(buf)
			if err != nil {
				return
			}

			if _, err = trackLocal.Write(buf[:i]); err != nil {
				return
			}
		}
	})

	s.Sync()

	return peer, nil
}

func (s *Session) addTrack(t *webrtc.TrackRemote) *webrtc.TrackLocalStaticRTP {
	s.mu.Lock()
	defer func() {
		s.mu.Unlock()
		s.Sync()
	}()

	// Create a new TrackLocal with the same codec as our incoming
	trackLocal, err := webrtc.NewTrackLocalStaticRTP(t.Codec().RTPCodecCapability, t.ID(), t.StreamID())
	if err != nil {
		panic(err)
	}

	s.tracks[t.ID()] = trackLocal
	return trackLocal
}

func (s *Session) removeTrack(t *webrtc.TrackLocalStaticRTP) {
	s.mu.Lock()
	defer func() {
		s.mu.Unlock()
		s.Sync()
	}()

	delete(s.tracks, t.ID())
}

func (s *Session) broadcastKeyFrame() {
	s.mu.RLock()
	defer s.mu.RUnlock()

	for i := range s.peers {
		for _, receiver := range s.peers[i].GetReceivers() {
			if receiver.Track() == nil {
				continue
			}

			_ = s.peers[i].WriteRTCP([]rtcp.Packet{
				&rtcp.PictureLossIndication{
					MediaSSRC: uint32(receiver.Track().SSRC()),
				},
			})
		}
	}
}

func (s *Session) Sync() {
	s.mu.Lock()
	defer func() {
		s.mu.Unlock()
		s.broadcastKeyFrame()
	}()

	attemptSync := func() (tryAgain bool) {
		for i := range s.peers {
			if s.peers[i].ConnectionState() == webrtc.PeerConnectionStateClosed {
				s.peers = append(s.peers[:i], s.peers[i+1:]...)
				log.Println("sync: we removed a peer, try again")
				return true // We modified the slice, try again
			}

			// map of sender we already are seanding, so we don't double send
			existingSenders := map[string]bool{}

			for _, sender := range s.peers[i].GetSenders() {
				if sender.Track() == nil {
					continue
				}

				existingSenders[sender.Track().ID()] = true

				// If we have a RTPSender that doesn't map to a existing track remove and signal
				if _, ok := s.tracks[sender.Track().ID()]; !ok {
					if err := s.peers[i].RemoveTrack(sender); err != nil {
						log.Printf("sync: error removing a track, try again; %s", err)
						return true
					}
				}
			}

			// Don't receive videos we are sending, make sure we don't have loopback
			for _, receiver := range s.peers[i].GetReceivers() {
				if receiver.Track() == nil {
					continue
				}

				existingSenders[receiver.Track().ID()] = true
			}

			// Add all track we aren't sending yet to the PeerConnection
			for trackID := range s.tracks {
				if _, ok := existingSenders[trackID]; !ok {
					log.Println("sync: adding track to peer:", i, trackID)
					if _, err := s.peers[i].AddTrack(s.tracks[trackID]); err != nil {
						log.Printf("sync: error adding a track, try again; %s", err)
						return true
					}
				}
			}

			offer, err := s.peers[i].CreateOffer(nil)
			if err != nil {
				log.Printf("sync: error creating an offer, try again; %s", err)
				return true
			}

			if err = s.peers[i].SetLocalDescription(offer); err != nil {
				log.Printf("sync: error setting local description, try again; %s", err)
				return true
			}

			if err = s.peers[i].Signal("offer", offer); err != nil {
				log.Printf("sync: error trying to signal offer, try again; %s", err)
				return true
			}
		}

		return
	}

	log.Println("sync: start")
	for syncAttempt := 0; ; syncAttempt++ {
		if syncAttempt == 25 {
			// Release the lock and attempt a sync in 1s. We might be blocking a RemoveTrack or AddTrack
			go func() {
				time.Sleep(time.Second * 1)
				s.Sync()
			}()
			log.Printf("sync: yielding early")
			return
		}
		if !attemptSync() {
			break
		}
	}
	log.Println("sync: finished")
}
