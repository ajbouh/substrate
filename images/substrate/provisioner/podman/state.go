package podmanprovisioner

type State string

// From https://docs.podman.io/en/stable/markdown/podman-events.1.html
// attach
// checkpoint
// cleanup
// commit
// connect
// create
// died
// disconnect
// exec
// exec_died
// exited
// export
// import
// init
// kill
// mount
// pause
// prune
// remove
// rename
// restart
// restore
// start
// stop
// sync
// unmount
// unpause

const CreateState State = "create"
const RunningState State = "running"
const StartState State = "start"
const ReadyState State = "ready"
const PauseState State = "pause"
const RestartState State = "restart"
const RemoveState State = "remove"
const KillState State = "kill"
const DieState State = "die"
const DiedState State = "died"
const ExitedState State = "exited"

func StateFromDockerStatus(s string, ready bool) State {
	if s == string(RunningState) && ready {
		return ReadyState
	}
	return State(s)
}

func (s State) String() string {
	return string(s)
}

func (s State) IsReady() bool {
	return s == ReadyState
}

func (s State) IsPending() bool {
	switch s {
	case CreateState, RestartState, StartState, RunningState:
		return true
	}

	return false
}

func (s State) IsGone() bool {
	switch s {
	case PauseState, RemoveState, KillState, ExitedState, DieState, DiedState:
		return true
	}

	return false
}
