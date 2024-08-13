package prompts

import (
	"testing"

	"gotest.tools/assert"
)

func TestLoadTemplates(t *testing.T) {
	tmpl, err := loadTemplates()
	assert.Assert(t, err)
	assert.Equal(t, `; defined templates are: "tool-response.tmpl", "tool-select.tmpl"`, tmpl.DefinedTemplates())
}
