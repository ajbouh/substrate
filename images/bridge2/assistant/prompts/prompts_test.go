package prompts

import (
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
	})
	require.NoError(t, err)
	t.Log(s)
}
