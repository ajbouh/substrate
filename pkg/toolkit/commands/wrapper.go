package commands

type Wrapper interface {
	WrapsCommandsSource() Source
}
