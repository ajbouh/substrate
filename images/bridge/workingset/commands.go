package workingset

import (
	"context"
	"errors"
	"net"
	"net/url"

	"github.com/ajbouh/substrate/images/bridge/tracks"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
)

type CommandProvider struct {
	Session *tracks.Session
}

func (c *CommandProvider) Commands(ctx context.Context) commands.Source {
	sess := c.Session
	src := &commands.DynamicSource{
		Sources: []commands.Source{
			commands.NewStaticSource[CommandProvider]([]commands.Entry{
				{Name: "add_url",
					Def: commands.Def{
						Description: "Add a URL to the working set",
						Parameters: commands.FieldDefs{
							"url": {
								Name:        "url",
								Type:        "string",
								Description: "URL to add to working set. Should be fully qualified with the URL scheme.",
							},
							"key": {
								Name:        "key",
								Type:        "string",
								Description: "Unique key for the URL. Lower case letters, numbers, and underscores allowed.",
							},
						},
						Returns: commands.FieldDefs{
							"success": {
								Name:        "success",
								Type:        "boolean",
								Description: "True if the URL was added successfully",
							},
							"error": {
								Name:        "error",
								Type:        "string",
								Description: "Description of the error when success is false",
							},
						},
					},
					Run: func(ctx context.Context, args commands.Fields) (commands.Fields, error) {
						key := args.String("key")
						url := args.String("url")
						if _, err := AddURL(sess.SpanNow(), key, url); err != nil {
							if errors.Is(err, ErrInvalidKey) {
								return commands.Fields{
									"success": false,
									"error":   "Invalid key: should be lowercase alphanumeric",
								}, nil
							}
							return nil, err
						}
						return commands.Fields{
							"success": true,
						}, nil
					},
				},

				{Name: "list",
					Def: commands.Def{
						Description: "List the URLs in the working set",
						Parameters:  nil,
						Returns: commands.FieldDefs{
							"urls": {
								Name:        "urls",
								Type:        "map[string]string", // TODO how should we specify other types?
								Description: "List of URLs in the working set",
							},
						},
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
	for key, url := range ActiveURLs(sess) {
		src.Sources = append(src.Sources, &commands.PrefixedSource[unreliableHTTPSource]{
			Prefix: key + ":",
			Source: unreliableHTTPSource{
				commands.HTTPSource{Endpoint: url},
			},
		})
	}

	return &commands.PrefixedSource[*commands.DynamicSource]{
		Prefix: "workingset:",
		Source: src,
	}
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
