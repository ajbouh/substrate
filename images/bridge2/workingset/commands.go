package workingset

import (
	"context"
	"errors"
	"fmt"
	"hash/fnv"
	"net"

	"github.com/ajbouh/substrate/images/bridge2/tracks"
	"github.com/ajbouh/substrate/pkg/commands"
)

type CommandProvider struct{}

func (c *CommandProvider) CommandsSource(sess *tracks.Session) commands.Source {
	src := &commands.DynamicSource{
		Sources: []commands.Source{
			commands.NewStaticSource([]commands.Entry{
				{Name: "add_url",
					Def: commands.Def{
						Description: `add_url(url: str) -> bool`,
						Parameters: commands.FieldDefs{
							"url": {
								Name:        "url",
								Type:        "string",
								Description: "URL to add to working set",
							},
						},
						Returns: nil,
					},
					Run: func(ctx context.Context, args commands.Fields) (commands.Fields, error) {
						url := args.String("url")
						AddURL(sess.SpanNow(), url)
						return commands.Fields{
							"success": true,
						}, nil
					},
				},

				{Name: "list",
					Def: commands.Def{
						Description: `list() -> []string`,
						Parameters:  commands.FieldDefs{},
						Returns:     nil,
					},
					Run: func(ctx context.Context, args commands.Fields) (commands.Fields, error) {
						urls := ActiveURLs(sess)
						return commands.Fields{
							"urls": urls,
						}, nil
					},
				},
			}),
		},
	}
	for _, url := range ActiveURLs(sess) {
		src.Sources = append(src.Sources, &commands.PrefixedSource{
			// XXX should the URLs have a human-readable prefix instead? e.g. if we
			// have multiple URLs that have overlapping commands, how would the user
			// know which site it would be going to?
			Prefix: hash(url) + ":",
			Source: unreliableHTTPSource{
				commands.HTTPSource{Endpoint: url},
			},
		})
	}
	return &commands.PrefixedSource{
		Prefix: "workingset:",
		Source: src,
	}
}

func hash(s string) string {
	// we don't need these hashes to be cryptographic, just something so that the
	// same url gets the same prefix if we add/remove other urls in the working
	// set
	h := fnv.New32a()
	h.Write([]byte(s))
	return fmt.Sprintf("%x", h.Sum(nil))
}

type unreliableHTTPSource struct {
	commands.Source
}

func (s unreliableHTTPSource) Reflect(ctx context.Context) (commands.DefIndex, error) {
	def, err := s.Source.Reflect(ctx)
	var netErr *net.OpError
	if errors.As(err, &netErr) {
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
