export default async function({workspace}) {
    const initialInstructions = await workspace.get('chat/messages/init/instructions')
    const initialDemos = await workspace.get('chat/messages/init/demos')
    const runMessageAssistant = await workspace.get('workspace/do/get/message/assistant/evaluation')
    const globals = await workspace.get('chat/messages/init/globals')
    const globalsDocs = globals.map(g => workspace.read(g)?.docs).filter(_ => _)

    const textMessage = (role, text) => ({role, content: [{type: 'text', text: Array.isArray(text) ? text.join("\n"): text}]})
    return [
        textMessage("system", [
            ...initialInstructions,
            `The javascript environment has the following globals:\n\n\`\`\`javascript\n${globalsDocs.join("\n\n")}\n\`\`\`\n`,
        ]),
        ...initialDemos.flatMap(({taskDepth=3, taskName, userText, assistantTaskPrompt, workspaceTaskReply, assistantTaskReply}) => [
            textMessage("user", userText),
            textMessage("assistant", [
                ...runMessageAssistant.renderPrompt({taskDepth: taskDepth, name: taskName, ...assistantTaskPrompt}),
            ]),
            textMessage("system", [
                ...runMessageAssistant.renderResult({depth: taskDepth, sections: workspaceTaskReply}),
            ]),
            textMessage("assistant", assistantTaskReply),
        ]),
    ]
}
