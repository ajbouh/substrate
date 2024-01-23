package main

import (
	"context"
	"fmt"
	"net"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/ajbouh/bridge/cmd/internal/ws"
	"github.com/ajbouh/bridge/pkg/assistant"
	"github.com/ajbouh/bridge/pkg/router"
	"github.com/ajbouh/bridge/pkg/transcriber"
	"github.com/ajbouh/bridge/pkg/translator"
	"github.com/ajbouh/bridge/pkg/vad"
	"github.com/ajbouh/bridge/pkg/webrtcpeer"

	log "github.com/pion/ion-sfu/pkg/logger"

	"github.com/gorilla/websocket"
	"github.com/pion/ion-sfu/pkg/sfu"
	"github.com/sourcegraph/jsonrpc2"
	websocketjsonrpc2 "github.com/sourcegraph/jsonrpc2/websocket"
	"github.com/spf13/viper"
)

var (
	conf   = sfu.Config{}
	logger = log.New()
)

func getenvPrefixMap(prefix string) map[string]string {
	m := map[string]string{}
	for _, entry := range os.Environ() {
		if strings.HasPrefix(entry, prefix) {
			k, v, _ := strings.Cut(entry, "=")
			m[strings.TrimPrefix(k, prefix)] = v
		}
	}

	return m
}

func runPeer(webrtcpeerURL string) {
	r := router.New(context.Background())
	r.Start()

	transcriptionService := os.Getenv("BRIDGE_TRANSCRIPTION")
	if transcriptionService != "" {
		fn, err := transcriber.New(transcriptionService)
		if err != nil {
			logger.Error(err, "error creating transcriber")
			panic(err)
		}
		logger.Info("adding transcriber", "url", transcriptionService)
		r.InstallMiddleware(fn)
	}

	translators := getenvPrefixMap("BRIDGE_TRANSLATOR_")
	for translatorConfig, translatorService := range translators {
		modality, targetLanguagesStr, _ := strings.Cut(translatorConfig, "_")
		targetLanguages := strings.Split(targetLanguagesStr, "_")
		var useAudio bool
		if modality == "audio" {
			useAudio = true
		}
		fn, err := translator.New(translatorService, useAudio, targetLanguages[0], targetLanguages[1:]...)
		if err != nil {
			logger.Error(err, "error creating translator")
			panic(err)
		}

		logger.Info("adding translator", "url", translatorService, "modality", modality, "languages", targetLanguages)
		r.InstallMiddleware(fn)
	}

	assistants := getenvPrefixMap("BRIDGE_ASSISTANT_")
	for assistantName, assistantService := range assistants {
		logger.Info("adding assistant", "url", assistantService, "name", assistantName)
		r.InstallMiddleware(assistant.New(assistantName, assistantService))
	}

	logger.Info("adding voice activity detection")
	r.InstallMiddleware(vad.New(vad.Config{
		SampleRate:   16000,
		SampleWindow: 24 * time.Second,
	}))

	// webrtcpeerURL := os.Getenv("BRIDGE_WEBRTC_URL")
	if webrtcpeerURL != "" {
		room := os.Getenv("BRIDGE_WEBRTC_ROOM")
		if room == "" {
			room = "test"
		}

		url := url.URL{Scheme: "ws", Host: webrtcpeerURL, Path: "/ws"}
		logger.Info("adding webrtc peer")
		r.InstallMiddleware(webrtcpeer.New(url, room))
	}

	r.WaitForDone()
}

func main() {

	logger.Info("Starting bridge RTC server...")

	// build + start sfu

	viper.SetConfigFile("./config.toml")
	viper.SetConfigType("toml")
	err := viper.ReadInConfig()
	if err != nil {
		logger.Error(err, "error reading config")
		panic(err)
	}

	err = viper.Unmarshal(&conf)
	if err != nil {
		logger.Error(err, "error unmarshalling config")
		panic(err)
	}

	// start websocket server

	sfu.Logger = logger
	s := sfu.NewSFU(conf)

	upgrader := websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}

	// http.Handle("/", http.FileServer(http.Dir("./web")))
	http.Handle("/", http.FileServer(http.Dir("./ui")))

	// Set up a handler function for the `/ws` path
	http.HandleFunc("/ws", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		logger.Info("Upgrading conn...")
		c, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			panic(err)
		}
		defer c.Close()

		p := ws.NewConnection(sfu.NewPeer(s), logger)
		defer p.Close()

		jc := jsonrpc2.NewConn(r.Context(), websocketjsonrpc2.NewObjectStream(c), p)
		<-jc.DisconnectNotify()

	}))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8088"
	}

	addr := fmt.Sprintf("0.0.0.0:%s", port)
	server := &http.Server{
		Addr: addr,
		Handler: nil,
	}

	ln, err := net.Listen("tcp", addr)
	if err != nil {
		panic(err)
	}

	go runPeer(fmt.Sprintf("127.0.0.1:%s", port))

	err = server.Serve(ln)
	if err != nil {
		panic(err)
	}
}
