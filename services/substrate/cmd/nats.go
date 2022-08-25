package main

import (
	"context"

	"github.com/nats-io/nats-server/v2/server"
)

type NatsConfig struct {
	StoreDir string

	Username string
	Password string

	Host string
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

		Debug: true,
		Trace: true,

		// StoreDir:  mustGetenv("PLANE_DATA_DIR") + "/nats",
		// Username: "someuser",
		// Password: "somepassword",
		// Host: "127.0.0.1",

		// Users: []*server.User{
		// 	user,
		// },
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
		Username: config.Username,
		Password: config.Password,
		// Host:     s.Addr().String(),
		Host:      "127.0.0.1:4222",
		ClientURL: s.ClientURL(),
	}, nil
}
