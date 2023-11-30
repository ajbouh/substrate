# Contributing to localAI

Thank you for your interest in contributing to LocalAI! We appreciate your time and effort in helping to improve our project. Before you get started, please take a moment to review these guidelines.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setting up the Development Environment](#setting-up-the-development-environment)
- [Contributing](#contributing)
  - [Submitting an Issue](#submitting-an-issue)
  - [Creating a Pull Request (PR)](#creating-a-pull-request-pr)
- [Coding Guidelines](#coding-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community and Communication](#community-and-communication)



## Getting Started

### Prerequisites

- Golang [1.21]
- Git
- macOS/Linux

### Setting up the Development Environment and running localAI in the local environment

1. Clone the repository: `git clone https://github.com/go-skynet/LocalAI.git`
2. Navigate to the project directory: `cd LocalAI`
3. Install the required dependencies: `make prepare`
4. Run LocalAI: `make run`

## Contributing

We welcome contributions from everyone! To get started, follow these steps:

### Submitting an Issue

If you find a bug, have a feature request, or encounter any issues, please check the [issue tracker](https://github.com/go-skynet/LocalAI/issues) to see if a similar issue has already been reported. If not, feel free to [create a new issue](https://github.com/go-skynet/LocalAI/issues/new) and provide as much detail as possible.

### Creating a Pull Request (PR)

1. Fork the repository.
2. Create a new branch with a descriptive name: `git checkout -b [branch name]`
3. Make your changes and commit them.
4. Push the changes to your fork: `git push origin [branch name]`
5. Create a new pull request from your branch to the main project's `main` or `master` branch.
6. Provide a clear description of your changes in the pull request.
7. Make any requested changes during the review process.
8. Once your PR is approved, it will be merged into the main project.

## Coding Guidelines

- No specific coding guidelines at the moment. Please make sure the code can be tested. The most popular lint tools like []`golangci-lint`](https://golangci-lint.run) can help you here.

## Testing

`make test` cannot handle all the model now. Please be sure to add a test case for the new features or the part was changed.

## Documentation

- We are welcome the contribution of the documents, please open new PR in the official document repo [localai-website](https://github.com/go-skynet/localai-website)

## Community and Communication

- You can reach out via the Github issue tracker.
- Open a new discussion at [Discussion](https://github.com/go-skynet/LocalAI/discussions)
- Join the Discord channel [Discord](https://discord.gg/uJAeKSAGDy)

---