package workingset

import (
	"context"
	"errors"
	"net"
	"net/url"

	"github.com/ajbouh/substrate/images/bridge/tracks"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
)

type CommandProvider struct {
	Session *tracks.Session
}

type ListReturns struct {
	URLs map[string]string `json:"urls" desc:"List of URLs in the working set"`
}

type Void struct{}

func (c *CommandProvider) Commands(ctx context.Context) commands.Source {
	sess := c.Session
	sources := []commands.Source{
		commands.List[commands.Source](
			handle.Command("add_url",
				"Add a URL to the working set",
				func(ctx context.Context, t *struct{}, args struct {
					URL string `json:"url" desc:"URL to add to working set. Should be fully qualified with the URL scheme."`
					Key string `json:"key" desc:"Unique key for the URL. Lower case letters, numbers, and underscores allowed."`
				}) (Void, error) {
					key := args.Key
					url := args.URL
					if _, err := AddURL(sess.SpanNow(), key, url); err != nil {
						if errors.Is(err, ErrInvalidKey) {
							return Void{}, errors.New("Invalid key: should be lowercase alphanumeric")
						}
						return Void{}, err
					}
					return Void{}, nil
				}),
			handle.Command("list",
				"List the URLs in the working set",
				func(ctx context.Context, t *struct{}, args struct{}) (ListReturns, error) {
					urls := ActiveURLs(sess)
					return ListReturns{
						URLs: urls,
					}, nil
				}),
		),
	}
	for key, url := range ActiveURLs(sess) {
		sources = append(sources, commands.Prefixed(key+":",
			unreliableHTTPSource{
				commands.HTTPSource{Endpoint: url},
			},
		))
	}

	return commands.Prefixed("workingset:",
		commands.Dynamic(nil, nil, func() []commands.Source { return sources }),
	)
}

type unreliableHTTPSource struct {
	commands.Source
}

func errorHasType[T error](err error) bool {
	var target T
	return errors.As(err, &target)
}

func (s unreliableHTTPSource) Reflect(ctx context.Context) (commands.DefIndex, error) {
	def, err := s.Source.Reflect(ctx)
	if errorHasType[*net.OpError](err) || errorHasType[*url.Error](err) {
		return nil, commands.ErrReflectNotSupported
	}
	return def, err
}

func (s unreliableHTTPSource) Run(ctx context.Context, name string, params commands.Fields) (commands.Fields, error) {
	index, err := s.Reflect(ctx)
	if err != nil {
		return nil, err
	}
	if _, ok := index[name]; !ok {
		return nil, commands.ErrNoSuchCommand
	}
	return s.Source.Run(ctx, name, params)
}
