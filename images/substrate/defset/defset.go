package defset

import (
	"context"
	"fmt"
	"io"
	"strings"

	"cuelang.org/go/cue"
	cueerrors "cuelang.org/go/cue/errors"
	cueformat "cuelang.org/go/cue/format"
	lru "github.com/hashicorp/golang-lru/v2"
)

type DefSet struct {
	ServicesCueValues map[string]cue.Value
	RootValue         cue.Value

	serviceSpawnCueValueLRU *lru.Cache[string, cue.Value]

	CueMu      *CueMutex
	CueContext *cue.Context
	Err        error
}

func (s *DefSet) Initialize() {
	s.serviceSpawnCueValueLRU, _ = lru.New[string, cue.Value](128)
}

func (s *DefSet) DecodeLookupPath(p cue.Path, target any) error {
	s.CueMu.Lock()
	defer s.CueMu.Unlock()

	return s.RootValue.LookupPath(p).Decode(target)
}

func (s *DefSet) DecodeLookupPathIfExists(p cue.Path, target any) (bool, error) {
	s.CueMu.Lock()
	defer s.CueMu.Unlock()

	v := s.RootValue.LookupPath(p)
	if !v.Exists() {
		return false, nil
	}

	return true, v.Decode(target)
}

func (s *DefSet) LookupServiceInstanceJSON(ctx context.Context, serviceName, instanceName string, path cue.Path) ([]byte, error) {
	s.CueMu.Lock()
	defer s.CueMu.Unlock()

	serviceCueValue, ok := s.ServicesCueValues[serviceName]
	if !ok {
		return nil, fmt.Errorf("unknown service: %s", serviceName)
	}

	instanceCueValue := serviceCueValue.LookupPath(cue.MakePath(cue.Str("instances"), cue.Str(instanceName)))
	cueValue := instanceCueValue.LookupPath(path)
	return cueValue.MarshalJSON()
}

func (s *DefSet) FmtErr(err error) string {
	s.CueMu.Lock()
	defer s.CueMu.Unlock()

	var sb strings.Builder
	cueerrors.Print(&sb, err, &cueerrors.Config{
		Format: func(w io.Writer, format string, args ...interface{}) {
			fmt.Fprintf(w, format, args...)
		},
	})

	// Generate an AST
	//   try out different options
	syn := s.RootValue.Syntax(
		// cue.Final(),         // close structs and lists
		cue.Concrete(false), // allow incomplete values
		cue.Definitions(true),
		cue.Hidden(true),
		cue.Optional(true),
		cue.Attributes(true),
		cue.Docs(true),
	)

	// Pretty print the AST, returns ([]byte, error)
	b, err := cueformat.Node(
		syn,
		// format.TabIndent(false),
		// format.UseSpaces(2),
	)
	if err != nil {
		sb.WriteString("error formatting root value: ")
		sb.WriteString(err.Error())
	} else {
		sb.WriteString("root value: ")
		sb.WriteRune('\n')
		sb.Write(b)
	}
	// errs := cueerrors.Errors(err)
	// messages := make([]string, 0, len(errs))
	// for _, err := range errs {
	// 	messages = append(messages, err.Error())
	// }
	// return strings.Join(messages, "\n")

	return sb.String()
}
