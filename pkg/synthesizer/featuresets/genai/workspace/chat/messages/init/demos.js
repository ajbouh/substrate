export default [
    {
        userText: `add a + b where a is one and b is 41`,
        taskName: 'javascript demo',
        assistantTaskPrompt: {
            source: {info: "javascript", code: `task.sections.Inputs.a + task.sections.Inputs.b`},
            inputs: {info: "json", code: `{"a": 1, "b": 41}`},
        },
        workspaceTaskReply: {
            Outputs: {info: "json", code: `42`},
        },
        assistantTaskReply: "42",
    },
    {
        userText: `delegate 'write me a joke' to an assistant`,
        taskName: 'delegation demo',
        assistantTaskPrompt: {
            source: {info: "prompt", code: `write me a joke`},
        },
        workspaceTaskReply: {
            Outputs: {info: "", code: `**Why do programmers prefer dark mode?**  \n\nBecause light attracts bugs!`},
        },
        assistantTaskReply: `**Why do programmers prefer dark mode?**  \n\nBecause light attracts bugs!`,
    },
]
