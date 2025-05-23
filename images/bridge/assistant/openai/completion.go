// JSON model forked from `go-openai` under the Apache 2.0 license
// https://github.com/sashabaranov/go-openai
// http://www.apache.org/licenses/LICENSE-2.0
package openai

var (
// ErrCompletionUnsupportedModel              = errors.New("this model is not supported with this method, please use CreateChatCompletion client method instead") //nolint:lll
// ErrCompletionStreamNotSupported            = errors.New("streaming is not supported with this method, please use CreateCompletionStream")                      //nolint:lll
// ErrCompletionRequestPromptTypeNotSupported = errors.New("the type of CompletionRequest.Prompt only supports string and []string")                              //nolint:lll
)

// GPT3 Defines the models provided by OpenAI to use when generating
// completions from OpenAI.
// GPT3 Models are designed for text-based tasks. For code-specific
// tasks, please refer to the Codex series of models.
const (
	GPT432K0613           = "gpt-4-32k-0613"
	GPT432K0314           = "gpt-4-32k-0314"
	GPT432K               = "gpt-4-32k"
	GPT40613              = "gpt-4-0613"
	GPT40314              = "gpt-4-0314"
	GPT4Turbo0125         = "gpt-4-0125-preview"
	GPT4Turbo1106         = "gpt-4-1106-preview"
	GPT4TurboPreview      = "gpt-4-turbo-preview"
	GPT4VisionPreview     = "gpt-4-vision-preview"
	GPT4                  = "gpt-4"
	GPT3Dot5Turbo0125     = "gpt-3.5-turbo-0125"
	GPT3Dot5Turbo1106     = "gpt-3.5-turbo-1106"
	GPT3Dot5Turbo0613     = "gpt-3.5-turbo-0613"
	GPT3Dot5Turbo0301     = "gpt-3.5-turbo-0301"
	GPT3Dot5Turbo16K      = "gpt-3.5-turbo-16k"
	GPT3Dot5Turbo16K0613  = "gpt-3.5-turbo-16k-0613"
	GPT3Dot5Turbo         = "gpt-3.5-turbo"
	GPT3Dot5TurboInstruct = "gpt-3.5-turbo-instruct"
	// Deprecated: Will be shut down on January 04, 2024. Use gpt-3.5-turbo-instruct instead.
	GPT3TextDavinci003 = "text-davinci-003"
	// Deprecated: Will be shut down on January 04, 2024. Use gpt-3.5-turbo-instruct instead.
	GPT3TextDavinci002 = "text-davinci-002"
	// Deprecated: Will be shut down on January 04, 2024. Use gpt-3.5-turbo-instruct instead.
	GPT3TextCurie001 = "text-curie-001"
	// Deprecated: Will be shut down on January 04, 2024. Use gpt-3.5-turbo-instruct instead.
	GPT3TextBabbage001 = "text-babbage-001"
	// Deprecated: Will be shut down on January 04, 2024. Use gpt-3.5-turbo-instruct instead.
	GPT3TextAda001 = "text-ada-001"
	// Deprecated: Will be shut down on January 04, 2024. Use gpt-3.5-turbo-instruct instead.
	GPT3TextDavinci001 = "text-davinci-001"
	// Deprecated: Will be shut down on January 04, 2024. Use gpt-3.5-turbo-instruct instead.
	GPT3DavinciInstructBeta = "davinci-instruct-beta"
	GPT3Davinci             = "davinci"
	GPT3Davinci002          = "davinci-002"
	// Deprecated: Will be shut down on January 04, 2024. Use gpt-3.5-turbo-instruct instead.
	GPT3CurieInstructBeta = "curie-instruct-beta"
	GPT3Curie             = "curie"
	GPT3Curie002          = "curie-002"
	GPT3Ada               = "ada"
	GPT3Ada002            = "ada-002"
	GPT3Babbage           = "babbage"
	GPT3Babbage002        = "babbage-002"
)

// Codex Defines the models provided by OpenAI.
// These models are designed for code-specific tasks, and use
// a different tokenizer which optimizes for whitespace.
const (
	CodexCodeDavinci002 = "code-davinci-002"
	CodexCodeCushman001 = "code-cushman-001"
	CodexCodeDavinci001 = "code-davinci-001"
)

// var disabledModelsForEndpoints = map[string]map[string]bool{
// 	"/completions": {
// 		GPT3Dot5Turbo:        true,
// 		GPT3Dot5Turbo0301:    true,
// 		GPT3Dot5Turbo0613:    true,
// 		GPT3Dot5Turbo1106:    true,
// 		GPT3Dot5Turbo0125:    true,
// 		GPT3Dot5Turbo16K:     true,
// 		GPT3Dot5Turbo16K0613: true,
// 		GPT4:                 true,
// 		GPT4TurboPreview:     true,
// 		GPT4VisionPreview:    true,
// 		GPT4Turbo1106:        true,
// 		GPT4Turbo0125:        true,
// 		GPT40314:             true,
// 		GPT40613:             true,
// 		GPT432K:              true,
// 		GPT432K0314:          true,
// 		GPT432K0613:          true,
// 	},
// }

// func checkEndpointSupportsModel(endpoint, model string) bool {
// 	return !disabledModelsForEndpoints[endpoint][model]
// }

// func checkPromptType(prompt any) bool {
// 	_, isString := prompt.(string)
// 	_, isStringSlice := prompt.([]string)
// 	return isString || isStringSlice
// }

// CompletionRequest represents a request structure for completion API.
type CompletionRequest struct {
	// The "model" field is injected automatically when calling via the command
	// API, so exclude it from this request.
	// Model string `json:"model" yaml:"model"`
	// XXX seems like API may support a list of strings too, is that helpful, or
	// just limit to full strings?
	Prompt      string  `json:"prompt,omitempty" yaml:"prompt,omitempty"`
	Suffix      string  `json:"suffix,omitempty" yaml:"suffix,omitempty"`
	MaxTokens   int     `json:"max_tokens,omitempty" yaml:"max_tokens,omitempty"`
	Temperature float32 `json:"temperature,omitempty" yaml:"temperature,omitempty"`
	TopP        float32 `json:"top_p,omitempty" yaml:"top_p,omitempty"`
	N           int     `json:"n,omitempty" yaml:"n,omitempty"`
	// Stream           bool     `json:"stream,omitempty"`
	LogProbs         int      `json:"logprobs,omitempty" yaml:"logprobs,omitempty"`
	Echo             bool     `json:"echo,omitempty" yaml:"echo,omitempty"`
	Stop             []string `json:"stop,omitempty" yaml:"stop,omitempty"`
	PresencePenalty  float32  `json:"presence_penalty,omitempty" yaml:"presence_penalty,omitempty"`
	FrequencyPenalty float32  `json:"frequency_penalty,omitempty" yaml:"frequency_penalty,omitempty"`
	BestOf           int      `json:"best_of,omitempty" yaml:"best_of,omitempty"`
	// LogitBias is must be a token id string (specified by their token ID in the tokenizer), not a word string.
	// incorrect: `"logit_bias":{"You": 6}`, correct: `"logit_bias":{"1639": 6}`
	// refs: https://platform.openai.com/docs/api-reference/completions/create#completions/create-logit_bias
	LogitBias map[string]int `json:"logit_bias,omitempty" yaml:"logit_bias,omitempty"`
	User      string         `json:"user,omitempty" yaml:"user,omitempty"`
}

// CompletionChoice represents one of possible completions.
type CompletionChoice struct {
	Text         string        `json:"text"`
	Index        int           `json:"index"`
	FinishReason string        `json:"finish_reason"`
	LogProbs     LogprobResult `json:"logprobs"`
}

// LogprobResult represents logprob result of Choice.
type LogprobResult struct {
	Tokens        []string             `json:"tokens"`
	TokenLogprobs []float32            `json:"token_logprobs"`
	TopLogprobs   []map[string]float32 `json:"top_logprobs"`
	TextOffset    []int                `json:"text_offset"`
}

// Usage Represents the total token usage per request to OpenAI.
type Usage struct {
	PromptTokens     int `json:"prompt_tokens"`
	CompletionTokens int `json:"completion_tokens"`
	TotalTokens      int `json:"total_tokens"`
}

// CompletionResponse represents a response structure for completion API.
type CompletionResponse struct {
	ID      string             `json:"id"`
	Object  string             `json:"object"`
	Created int64              `json:"created"`
	Model   string             `json:"model"`
	Choices []CompletionChoice `json:"choices"`
	Usage   Usage              `json:"usage"`

	// httpHeader
}
