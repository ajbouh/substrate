package units

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"strings"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
	"github.com/chromedp/cdproto/runtime"
	"github.com/chromedp/chromedp"
)

type MessageErrorEvent struct {
	ExecutionContextID runtime.ExecutionContextID
	Payload            string
	Err                error
}
type MessageEvent struct {
	Message      any    `json:"message"`
	Nonce        int    `json:"nonce"`
	TargetOrigin string `json:"targetOrigin"`
}

type MessageConduit struct {
	CDP *RemoteCDP

	MessageEventNotifiers      []notify.Notifier[*MessageEvent]
	MessageErrorEventNotifiers []notify.Notifier[*MessageErrorEvent]
}

var _ commands.Source = (*MessageConduit)(nil)

func init() {
	// TODO add to top-level
	notify.On(
		func(ctx context.Context,
			t *struct{},
			ev *MessageErrorEvent) {
			logMessage := "error decoding payload sent to __substrate_r1_sendmessage"
			ute := &json.UnmarshalTypeError{}
			if errors.As(ev.Err, &ute) {
				slog.Error(logMessage, "payload", ev.Payload, "error", ev.Err,
					"value", ute.Value,
					"type", ute.Type,
					"offset", ute.Offset,
					"struct", ute.Struct,
					"field", ute.Field,
				)
			} else {
				slog.Info(logMessage, "err", ev.Err)
			}

		})
}

func ExposeFunc(name string, f func(runtime.ExecutionContextID, string)) chromedp.Action {
	return chromedp.Tasks{
		chromedp.ActionFunc(func(ctx context.Context) error {
			chromedp.ListenTarget(ctx, func(ev interface{}) {
				if ev, ok := ev.(*runtime.EventBindingCalled); ok && ev.Name == name {
					f(ev.ExecutionContextID, ev.Payload)
				}
			})
			return nil
		}),
		runtime.AddBinding(name),
	}
}

func (c *MessageConduit) install() error {
	return c.CDP.Run(
		ExposeFunc("__substrate_r1_sendmessage", func(id runtime.ExecutionContextID, payload string) {
			var msgEvt MessageEvent
			if err := json.NewDecoder(strings.NewReader(payload)).Decode(&msgEvt); err != nil {
				notify.Notify(context.Background(), c.MessageErrorEventNotifiers, &MessageErrorEvent{
					ExecutionContextID: id,
					Payload:            payload,
					Err:                err,
				})
			} else {
				notify.Notify(context.Background(), c.MessageEventNotifiers, &msgEvt)
			}
		}),
	)
}

// https://developer.mozilla.org/en-US/docs/Web/API/Window/message_event
type Message struct {
	Data any `json:"data"`
	// Origin      string `json:"origin"`
	// LastEventID string `json:"lastEventId"`
	// Source      any `json:"source"`
	// Ports       []MessagePort `json:"ports"`
}

func (c *MessageConduit) Send(ctx context.Context, target string, message Message) error {
	var sb strings.Builder
	// https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/MessageEvent
	sb.WriteString(`window.dispatchEvent(new MessageEvent('message',"`)
	err := json.NewEncoder(&sb).Encode(message)
	if err != nil {
		return err
	}
	sb.WriteString(`))`)

	var success bool
	return c.CDP.Run(chromedp.Evaluate(sb.String(), &success,
		func(ep *runtime.EvaluateParams) *runtime.EvaluateParams {
			// TODO
			return ep
		},
	))
}

func (c *MessageConduit) Reflect(ctx context.Context) (commands.DefIndex, error) {
	page := commands.DefIndex{}
	err := c.CDP.Run(
		chromedp.Evaluate(
			`window?.substrate?.r0?.commands?.index`,
			&page,
			func(ep *runtime.EvaluateParams) *runtime.EvaluateParams {
				return ep.WithAwaitPromise(true)
			},
		),
	)

	return page, err
}

func (c *MessageConduit) Run(ctx context.Context, name string, p commands.Fields) (commands.Fields, error) {
	b, err := json.Marshal(p)
	if err != nil {
		return nil, err
	}

	var result commands.Fields
	err = c.CDP.Run(
		chromedp.Evaluate(fmt.Sprintf(`window.substrate.r0.commands.run(%q,%s)`, name, string(b)),
			&result,
			func(ep *runtime.EvaluateParams) *runtime.EvaluateParams {
				return ep.WithAwaitPromise(true)
			},
		),
	)
	return result, err
}
