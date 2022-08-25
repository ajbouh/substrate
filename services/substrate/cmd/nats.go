package main

import (
	"context"
	"strconv"

	"github.com/nats-io/nats-server/v2/server"
)

type NatsConfig struct {
	StoreDir string

	Username string
	Password string

	Trace bool
	Debug bool

	Host string
	Port int
}

type NatsCoordinates struct {
	Username  string
	Password  string
	ClientURL string

	Host string
}

func startNatsServer(ctx context.Context, config *NatsConfig) (*server.Server, *NatsCoordinates, error) {
	// user := &server.User{
	// 	Username: config.Username,
	// 	Password: config.Password,
	// }

	s, err := server.NewServer(&server.Options{
		JetStream: true,
		StoreDir:  config.StoreDir,

		Username: config.Username,
		Password: config.Password,

		// NoAuthUser: true,
		Host: config.Host,
		Port: config.Port,

		Debug: config.Debug,
		Trace: config.Trace,
	})
	if err != nil {
		return nil, nil, err
	}

	// Configure the logger based on the flags
	s.ConfigureLogger()

	s.Start()

	// // Start things up. Block here until done.
	// if err := server.Run(s); err != nil {
	// 	return err
	// }

	// // // Adjust MAXPROCS if running under linux/cgroups quotas.
	// // undo, err := maxprocs.Set(maxprocs.Logger(s.Debugf))
	// // if err != nil {
	// // 	s.Warnf("Failed to set GOMAXPROCS: %v", err)
	// // } else {
	// // 	defer undo()
	// // }

	// s.WaitForShutdown()
	// return nil

	return s, &NatsCoordinates{
		Username:  config.Username,
		Password:  config.Password,
		Host:      "nats://127.0.0.1:" + strconv.Itoa(config.Port),
		ClientURL: s.ClientURL(),
	}, nil
}
