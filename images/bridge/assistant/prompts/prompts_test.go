package prompts

import (
	"strings"
	"testing"

	"gotest.tools/assert"
)

func TestLoadTemplates(t *testing.T) {
	tmpl, err := loadTemplates()
	assert.Assert(t, err)
	assert.Equal(t, `; defined templates are: "complete.tmpl", "tool-response-simple.tmpl", "tool-response.tmpl", "tool-select.tmpl"`, tmpl.DefinedTemplates())
}

func TestRender(t *testing.T) {
	templateString, err := Render("complete", map[string]any{
		"AssistantName": "bridge",
	})
	assert.Assert(t, err)
	tmpl, err := ParseTemplate(templateString)
	assert.Assert(t, err)
	s, err := RenderToString(tmpl, map[string]any{
		"UserInput": "test",
	})
	assert.Assert(t, err)
	t.Log(s)
	assert.Assert(t, !strings.HasSuffix(s, "\n"), "the rendered output should not end with without a trailing newline")
}
