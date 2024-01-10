package openai

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/go-skynet/LocalAI/api/backend"
	config "github.com/go-skynet/LocalAI/api/config"
	"github.com/go-skynet/LocalAI/api/options"
	"github.com/go-skynet/LocalAI/api/schema"
	model "github.com/go-skynet/LocalAI/pkg/model"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"github.com/rs/zerolog/log"
)

func EditEndpoint(cm *config.ConfigLoader, o *options.Option) func(c *fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		modelFile, input, err := readInput(c, o, true)
		if err != nil {
			return fmt.Errorf("failed reading parameters from request:%w", err)
		}

		config, input, err := readConfig(modelFile, input, cm, o.Loader, o.Debug, o.Threads, o.ContextSize, o.F16)
		if err != nil {
			return fmt.Errorf("failed reading parameters from request:%w", err)
		}

		log.Debug().Msgf("Parameter Config: %+v", config)

		templateFile := ""

		// A model can have a "file.bin.tmpl" file associated with a prompt template prefix
		if o.Loader.ExistsInModelPath(fmt.Sprintf("%s.tmpl", config.Model)) {
			templateFile = config.Model
		}

		if config.TemplateConfig.Edit != "" {
			templateFile = config.TemplateConfig.Edit
		}

		var result []schema.Choice
		totalTokenUsage := backend.TokenUsage{}

		for _, i := range config.InputStrings {
			if templateFile != "" {
				templatedInput, err := o.Loader.EvaluateTemplateForPrompt(model.EditPromptTemplate, templateFile, model.PromptTemplateData{
					Input:        i,
					Instruction:  input.Instruction,
					SystemPrompt: config.SystemPrompt,
				})
				if err == nil {
					i = templatedInput
					log.Debug().Msgf("Template found, input modified to: %s", i)
				}
			}

			r, tokenUsage, err := ComputeChoices(input, i, config, o, o.Loader, func(s string, c *[]schema.Choice) {
				*c = append(*c, schema.Choice{Text: s})
			}, nil)
			if err != nil {
				return err
			}

			totalTokenUsage.Prompt += tokenUsage.Prompt
			totalTokenUsage.Completion += tokenUsage.Completion

			result = append(result, r...)
		}

		id := uuid.New().String()
		created := int(time.Now().Unix())
		resp := &schema.OpenAIResponse{
			ID:      id,
			Created: created,
			Model:   input.Model, // we have to return what the user sent here, due to OpenAI spec.
			Choices: result,
			Object:  "edit",
			Usage: schema.OpenAIUsage{
				PromptTokens:     totalTokenUsage.Prompt,
				CompletionTokens: totalTokenUsage.Completion,
				TotalTokens:      totalTokenUsage.Prompt + totalTokenUsage.Completion,
			},
		}

		jsonResult, _ := json.Marshal(resp)
		log.Debug().Msgf("Response: %s", jsonResult)

		// Return the prediction in the response body
		return c.JSON(resp)
	}
}
