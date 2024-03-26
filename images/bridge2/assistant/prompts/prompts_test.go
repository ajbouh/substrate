package prompts

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
	"gotest.tools/assert"
)

func TestLoadTemplates(t *testing.T) {
	tmpl, err := loadTemplates()
	require.NoError(t, err)
	assert.Equal(t, `; defined templates are: "complete.tmpl"`, tmpl.DefinedTemplates())
}

func TestRender(t *testing.T) {
	s, err := Render("complete", map[string]interface{}{
		"SystemMessage": "test",
		"UserInput":     "test",
		"AssistantName": "bridge",
	})
	require.NoError(t, err)
	t.Log(s)
	assert.Assert(t, strings.HasSuffix(s, "BRIDGE:"), "the rendered output should end with the assistant name without a trailing newline")
}
