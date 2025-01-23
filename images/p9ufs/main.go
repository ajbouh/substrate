// Copyright 2018 The gVisor Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Binary p9ufs provides a local 9P2000.L server for the p9 package.
//
// To use, first start the server:
//
//	p9ufs 127.0.0.1:3333
//
// Then, connect using the Linux 9P filesystem:
//
//	mount -t 9p -o trans=tcp,port=3333 127.0.0.1 /mnt
package main

import (
	"flag"
	"log"
	"log/slog"
	"net"
	"os"
	"os/exec"

	"github.com/hugelgupf/p9/fsimpl/localfs"
	"github.com/hugelgupf/p9/p9"
	"github.com/u-root/uio/ulog"
)

var (
	verbose = flag.Bool("v", false, "verbose logging")
	root    = flag.String("root", "/", "root dir of file system to expose")
	unix    = flag.Bool("unix", false, "use unix domain socket instead of TCP")
	stdio   = flag.Bool("stdio", false, "use stdio instead of TCP or unix domain socket")
)

func main() {
	flag.Parse()
	var transport string
	switch {
	case *unix:
		transport = "unix"
	default:
		transport = "tcp"
	}

	var opts []p9.ServerOpt
	if *verbose {
		opts = append(opts, p9.WithServerLogger(ulog.Log))
	}
	// Run the server.
	s := p9.NewServer(localfs.Attacher(*root), opts...)

	switch transport {
	case "unix", "tcp":
		args := flag.Args()
		if len(args) < 1 {
			log.Fatalf("usage: %s <bind-addr>", os.Args[0])
		}
		addr := args[0]

		// Bind and listen on the socket.
		serverSocket, err := net.Listen(transport, addr)
		if err != nil {
			log.Fatalf("err binding: %v", err)
		}
		defer serverSocket.Close()
		if transport == "unix" {
			defer os.Remove(addr)
		}

		if len(args) > 1 {
			go func() {
				command := args[1]
				commandArgs := args[2:]

				slog.Info("starting command", "cmd", command, "args", commandArgs)
				cmd := exec.Command(command, commandArgs...)
				cmd.Stderr = os.Stderr
				cmd.Stdout = os.Stdout
				cmd.Stdin = os.Stdin
				err = cmd.Run()
				if err != nil {
					log.Fatalf("err running: %v", err)
				}
			}()
		}

		err = s.Serve(serverSocket)
		if err != nil {
			log.Fatalf("err serving: %v", err)
		}
	default:
		log.Fatalf("err unknown transport: %v", transport)
	}
}
