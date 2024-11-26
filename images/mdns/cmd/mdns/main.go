package main

import (
	"context"
	"log/slog"
	"net"
	"os"
	"strings"
	"time"

	"github.com/ajbouh/substrate/images/mdns/units"

	"github.com/ajbouh/substrate/pkg/toolkit/engine"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
)

type SubstrateService struct{}

// Sigh... given the below, we can't advertise https directly. Instead, we advertise http and expect it to forward.

// From https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xml
// Web browsers like Safari and Internet Explorer (with the Bonjour for Windows plugin) DO NOT
// browse for DNS-SD service type "_https._tcp" in addition to browsing for "_http._tcp". This
// is a conscious decision to reduce proliferation of service types, to help keep DNS-SD efficient
// on the network. Today, if a user types http://www.mybank.com/ into their web browser, the web
// server automatically redirects the user to https://www.mybank.com/. Rather than having an
// entirely different DNS-SD service type for https, we recommend using the same redirection
// mechanism: advertise a plain "http" service, which consists of nothing except an HTTP
// redirection to the desired "https" URL. Work is currently being done on adding mechanisms to
// HTTP and TLS to allow the server to tell the client that it needs to activate TLS on the
// current connection before proceeding. If this becomes widely adopted, it further justifies
// the decision to not create a separate DNS-SD service type "_https._tcp", because security
// becomes just another one of the things that is negotiated on a per-connection basis
// (like content-type negotiation today) rather than being an entirely separate thing.

func main() {
	engine.Run(
		&service.Service{
			ExportsRoute: "/",
		},
		&units.Registration[SubstrateService]{},
		&notify.Ticker[SubstrateService]{
			Interval: time.Second * 60,
		},
		notify.On(func(
			ctx context.Context,
			e notify.Tick[SubstrateService],
			t *struct {
				Registration units.Registration[SubstrateService]
			},
		) {
			hostname, err := os.Hostname()
			if err != nil {
				slog.Info("couldn't get hostname: %s", "err", err)
				return
			}

			host, domain, _ := strings.Cut(hostname, ".")
			if domain == "" {
				domain = "local."
			}
			if !strings.HasSuffix(domain, ".") {
				domain = domain + "."
			}

			rec := &units.Record{
				Instance: host,
				Service:  "._substrate._tcp",
				Domain:   domain,
				Port:     80,
				Host:     host,
				Text:     nil,
			}

			ifaces, err := net.Interfaces()
			if err != nil {
				slog.Info("error collecting available interfaces", "err", err)
				return
			}

			ipAddrs, err := units.Addrs(units.Filter(units.IsNonLoopbackUnicast, ifaces))
			if err != nil {
				// continue though!
				slog.Info("error gathering addresses from interfaces", "err", err)
			}

			rec.ServiceIPs = units.IPAddrStrings(units.Filter(units.IsIPv4, ipAddrs))
			rec.AnnouncerInterfaces = units.Filter(units.IsMulticast, ifaces)

			err = t.Registration.Update(*rec)
			if err != nil {
				slog.Info("error in zeroconf.RegisterProxy()", "record", rec, "err", err)
			}
		}),
	)
}
