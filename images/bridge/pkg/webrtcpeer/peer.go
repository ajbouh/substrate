package webrtcpeer

import (
	"context"
	"fmt"
	"net/url"

	logr "github.com/ajbouh/bridge/pkg/log"
	"github.com/ajbouh/bridge/pkg/router"

	"github.com/pion/webrtc/v3"
)

var Logger = logr.New()

type Config struct {
	// ION room name to connect to
	Room string
	// URL for websocket server
	Url url.URL

	CapturedSample chan<- *router.CapturedSample

	StatusStream   <-chan *router.Status
	DocumentStream <-chan router.Document
}

type Peer struct {
	ws     *SocketConnection
	rtc    *RTCConnection
	config Config
	ae     *AudioEngine
}

func New(u url.URL, room string) router.MiddlewareFunc {
	return func(ctx context.Context, emit router.Emitters) (router.Listeners, error) {
		peerDocumentStream := make(chan router.Document, 100)
		statusStream := make(chan *router.Status, 100)
		sc, err := NewPeer(Config{
			Url:            u,
			Room:           room,
			CapturedSample: emit.CapturedSample,
			DocumentStream: peerDocumentStream,
			StatusStream:   statusStream,
		})
		if err != nil {
			return router.Listeners{}, fmt.Errorf("creating peer client: %w", err)
		}

		go func() {
			fmt.Printf("calling peer.Start()\n")
			if err := sc.Start(); err != nil {
				fmt.Printf("error starting peer client: %s\n", err)
			}
		}()

		return router.Listeners{
			DraftDocument: peerDocumentStream,
			Status:        statusStream,
		}, nil
	}
}

func NewPeer(config Config) (*Peer, error) {
	ae, err := NewAudioEngine(config.CapturedSample)
	if err != nil {
		return nil, err
	}

	ws := NewSocketConnection(config.Url)

	rtc, err := NewRTCConnection(RTCConnectionParams{
		trickleFn: func(candidate *webrtc.ICECandidate, target int) error {
			return ws.SendTrickle(candidate, target)
		},
		rtpChan:        ae.RtpIn(),
		documentStream: config.DocumentStream,
		statusStream:   config.StatusStream,
		mediaIn:        ae.MediaOut(),
	})
	if err != nil {
		return nil, err
	}

	s := &Peer{
		ws:     ws,
		rtc:    rtc,
		config: config,
		ae:     ae,
	}

	s.ws.SetOnOffer(s.OnOffer)
	s.ws.SetOnAnswer(s.OnAnswer)
	s.ws.SetOnTrickle(s.rtc.OnTrickle)

	return s, nil
}

func (s *Peer) OnAnswer(answer webrtc.SessionDescription) error {
	return s.rtc.SetAnswer(answer)
}

func (s *Peer) OnOffer(offer webrtc.SessionDescription) error {
	ans, err := s.rtc.OnOffer(offer)
	if err != nil {
		Logger.Error(err, "error getting answer")
		return err
	}

	return s.ws.SendAnswer(ans)
}

func (s *Peer) Start() error {
	Logger.Info("calling peer.ws.Connect()")
	if err := s.ws.Connect(); err != nil {
		Logger.Error(err, "error connecting to websocket")
		return err
	}
	Logger.Info("calling peer.rtc.GetOffer()")
	offer, err := s.rtc.GetOffer()
	if err != nil {
		Logger.Error(err, "error getting intial offer")
	}
	Logger.Info("calling peer.ws.Join()")
	if err := s.ws.Join(s.config.Room, offer); err != nil {
		Logger.Error(err, "error joining room")
		return err
	}

	Logger.Info("calling peer.ae.Start()")
	s.ae.Start()

	Logger.Info("calling peer.ws.WaitForDone()")
	s.ws.WaitForDone()
	Logger.Info("Socket done goodbye")
	return nil
}
