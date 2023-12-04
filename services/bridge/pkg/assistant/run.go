package assistant

import (
	"context"
	"errors"
	"fmt"
	"sort"
	"strings"

	"github.com/ajbouh/bridge/pkg/router"
	"github.com/ajbouh/substrate/pkg/chat"
	"github.com/ajbouh/substrate/pkg/chat/jsonschema"
	"github.com/lucsky/cuid"
)

type Assistant struct {
	Name            string
	Client          *chat.Client
	MaxPromptLength int
	MaxTokens       int

	systemMessage string
}

func New(name, url string) router.MiddlewareFunc {
	return func(ctx context.Context, emit router.Emitters) (router.Listeners, error) {
		assist := NewAssistant(
			name,
			chat.NewClientWithConfig(chat.DefaultConfig(url)),
		)
		listener := make(chan router.Document, 100)
		go assist.Run(emit.Transcription, listener)

		return router.Listeners{
			FinalDocument: listener,
		}, nil
	}
}

func NewAssistant(name string, client *chat.Client) *Assistant {
	return &Assistant{
		Name:            name,
		Client:          client,
		MaxPromptLength: 1024,
		MaxTokens:       4096,
		systemMessage: strings.ReplaceAll(`
A chat between ASSISTANT (named {}) and a USER.

{} is a conversational, vocal, artificial intelligence assistant.

{}'s job is to converse with humans to help them accomplish goals.

{} is able to help with a wide variety of tasks from answering questions to assisting the human with creative writing.

Overall {} is a powerful system that can help humans with a wide range of tasks and provide valuable insights as well as taking actions for the human.
`, "{}", name),
	}
}

func (o *Assistant) newRequest(includeFunctions bool) *chat.ChatCompletionRequest {
	var functions []chat.FunctionDefinition
	if includeFunctions {
		functions = []chat.FunctionDefinition{
			{
				Name:        "lookup_weather",
				Description: "look up weather",
				Parameters: jsonschema.Definition{
					Type: jsonschema.Object,
					Properties: map[string]jsonschema.Definition{
						"zip_code": {
							Type:        jsonschema.String,
							Description: "us zip code",
						},
					},
					Required: []string{"zip_code"},
				},
			},
		}
	}

	return &chat.ChatCompletionRequest{
		MaxTokens: o.MaxTokens - len(o.systemMessage),
		Functions: functions,
		Messages: []chat.ChatCompletionMessage{
			{
				Role:    chat.ChatMessageRoleSystem,
				Content: o.systemMessage,
			},
		},
	}
}

func (o *Assistant) generate(req *chat.ChatCompletionRequest) (string, *chat.FunctionCall, error) {
	var (
		chunk string
		err   error
	)
	resp, err := o.Client.CreateChatCompletion(context.Background(), *req)

	if err != nil {
		return chunk, nil, err
	}

	if len(resp.Choices) == 0 {
		return chunk, nil, errors.New("chat returned empty choices")
	}

	fmt.Printf("assistant req=%#v response=%#v fncall=%#v\n", req, resp, resp.Choices[0].Message.FunctionCall)

	choice := resp.Choices[0]

	// return an error if we get back an invalid function
	if choice.Message.FunctionCall != nil {
		fnCallName := choice.Message.FunctionCall.Name
		foundFunction := false
		for _, fn := range req.Functions {
			if fn.Name == fnCallName {
				foundFunction = true
				break
			}
		}

		if !foundFunction {
			haveNames := make([]string, 0, len(req.Functions))
			for _, fn := range req.Functions {
				haveNames = append(haveNames, fn.Name)
			}
			sort.Strings(haveNames)
			return choice.Message.Content, choice.Message.FunctionCall, fmt.Errorf("invalid function returned; no such function %q, have=%#v", fnCallName, haveNames)
		}
	}

	return choice.Message.Content, choice.Message.FunctionCall, nil
}

// TODO look into basarn?

func transcriptionAsCompletionMessages(t *router.Transcription, roleFunc func(s *router.TranscriptionSegment) string) []chat.ChatCompletionMessage {
	messages := []chat.ChatCompletionMessage{}
	lastEnd := float32(0.0)
	lastRole := ""
	lastSpeaker := ""
	for _, segment := range t.Segments {
		role := roleFunc(&segment)
		if role == "" {
			continue
		}

		if lastRole != role || lastSpeaker != segment.Speaker {
			messages = append(messages, chat.ChatCompletionMessage{
				Role: role,
				Name: segment.Speaker,
			})
		} else if lastEnd > 0 {
			if segment.End-lastEnd > 0.5 {
				messages = append(messages, chat.ChatCompletionMessage{
					Role: role,
					Name: segment.Speaker,
				})
			}
		}
		lastEnd = segment.End
		lastRole = role
		lastSpeaker = segment.Speaker

		lastMessage := &messages[len(messages)-1]
		if segment.Text != "" {
			lastMessage.Content += segment.Text
			continue
		}

		text := []string{}
		for _, word := range segment.Words {
			text = append(text, word.Word)
		}
		lastMessage.Content += strings.Join(text, "")
	}

	// fmt.Printf("transcriptionAsCompletionMessages=%#v\n", messages)
	return messages
}

func shouldRespond(name string, observed map[string]bool, doc router.Document) (*router.Transcription, bool) {
	var t *router.Transcription
	for i := len(doc.Transcriptions) - 1; i >= 0; i-- {
		t = doc.Transcriptions[i]

		if !t.Final {
			return t, false
		}

		break
	}

	// Only respond to things that aren't based on other parts of the transcript. This avoids loops.
	if t == nil || len(t.TranscriptSources) > 0 {
		return t, false
	}

	// we'll fall behind as we wait for an answer. don't try to respond to one of these messages after we've seen it.
	if observed[t.ID] {
		return t, false
	}

	observed[t.ID] = true

	mentioned := false
	// Only consider text said by a person.
	// For now only say something if the word "bridge" occurs in the text.
	for _, msg := range transcriptionAsCompletionMessages(t, func(s *router.TranscriptionSegment) string {
		if s.IsAssistant {
			return ""
		}

		return "user"
	}) {
		fmt.Printf("msg=%#v\n", msg)
		if strings.Contains(strings.ToLower(msg.Content), name) {
			mentioned = true
			break
		}
	}

	if !mentioned {
		return t, false
	}

	return t, true
}

func (a *Assistant) greedilyPopulateMessageHistory(doc router.Document, req *chat.ChatCompletionRequest, limit int) ([]*router.Transcription, uint64) {
	messageInsertionPoint := len(req.Messages)

	transcriptSources := []*router.Transcription{}

	var start uint64
	remaining := limit

	for i := len(doc.Transcriptions) - 1; i >= 0 && remaining > 0; i-- {
		t := doc.Transcriptions[i]
		nextMessages := transcriptionAsCompletionMessages(t, func(s *router.TranscriptionSegment) string {
			if !s.IsAssistant {
				return "user"
			}
			if s.Speaker == a.Name {
				return "assistant"
			}
			return ""
		})

		// Use the latest start timestamp we
		if len(nextMessages) > 0 && start < t.StartTimestamp {
			start = t.StartTimestamp
		}

		extraLength := 0
		for _, nextMessage := range nextMessages {
			extraLength += nextMessage.TokenLength()
		}

		if req.MaxTokens-extraLength <= a.MaxTokens-a.MaxPromptLength {
			break
		}

		req.InsertMessagesAt(messageInsertionPoint, nextMessages...)
		transcriptSources = append(transcriptSources, t)

		remaining--
	}

	return transcriptSources, start
}

func (a *Assistant) respondToDocument(doc router.Document) (*router.Transcription, bool) {
	reqWithFunctions := a.newRequest(true)
	transcriptSourcesWithFunctions, startWithFunctions := a.greedilyPopulateMessageHistory(doc, reqWithFunctions, 1)

	reqWithoutFunctions := a.newRequest(false)
	transcriptSourcesWithoutFunctions, startWithoutFunctions := a.greedilyPopulateMessageHistory(doc, reqWithoutFunctions, 2000)

	var transcriptSources []*router.Transcription
	var start uint64
	var gen string

	genWithFunctions, fnCall, err := a.generate(reqWithFunctions)
	if err == nil {
		if fnCall != nil {
			transcriptSources = transcriptSourcesWithFunctions
			start = startWithFunctions
			gen = genWithFunctions
		}
	} else {
		fmt.Printf("error generating with functions: %s\n", err)
	}

	if fnCall == nil || err != nil {
		genWithoutFunctions, _, err := a.generate(reqWithoutFunctions)
		if err != nil {
			fmt.Printf("error generating without functions: %s\n", err)
			return nil, false
		}
		transcriptSources = transcriptSourcesWithoutFunctions
		start = startWithoutFunctions
		gen = genWithoutFunctions
	}

	return &router.Transcription{
		ID:                cuid.New(),
		Final:             true,
		TranscriptSources: transcriptSources[0:1],
		StartTimestamp:    start,
		EndTimestamp:      start,
		Segments: []router.TranscriptionSegment{
			{
				Speaker:     a.Name,
				IsAssistant: true,
				Text:        gen,
			},
		},
	}, true
}

func (a *Assistant) Run(transcriptionStream chan<- *router.Transcription, listener <-chan router.Document) {
	name := strings.ToLower(a.Name)

	observed := map[string]bool{}

	for doc := range listener {
		if _, ok := shouldRespond(name, observed, doc); !ok {
			continue
		}

		if response, ok := a.respondToDocument(doc); ok {
			transcriptionStream <- response
		}
	}
}
