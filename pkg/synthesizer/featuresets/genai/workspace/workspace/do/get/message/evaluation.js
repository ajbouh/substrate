const origConsoleLog = console.log

const assistantCompletionMessageSymbol = Symbol("assistantCompletionMessage")

export default async function({unit: {source}, workspace}) {
    const textMessage = (role, text) => ({role, content: [{type: 'text', text}]})
    const {role, content} = JSON.parse(source)

    let messages
    if (workspace.has('chat/messages')) {
        messages = await workspace.get('chat/messages')
    } else {
        messages = await (await workspace.get('chat/messages/init'))({workspace})
    }

    messages = Object.freeze([...messages, {role, content}])
    workspace.write({'chat/messages': {evaluation: messages}})

    const createChatCompletion = await workspace.get('createChatCompletion')

    const assistantCompletion = await createChatCompletion({messages: messages})

    // todo would be good to branch somehow and explore all choices, not just the first ones
    const assistantCompletionMessage = assistantCompletion.choices[0].message

    let {
        trimmedAssistantMessage,
        task,
        renderResult,
    } = await workspace.eval['message/assistant']([assistantCompletionMessage.content])

    let assistantMessage = textMessage(assistantCompletionMessage.role, trimmedAssistantMessage)
    assistantMessage[assistantCompletionMessageSymbol] = assistantCompletionMessage
    messages = Object.freeze([...messages, assistantMessage])
    workspace.write({'chat/messages': {evaluation: messages}})

    if (task) {
        origConsoleLog('start', {task})
        if (task.ok) {
            task = await workspace.eval['task']([JSON.stringify(task)])
            origConsoleLog('done', {task})
        }

        if (!task.ok) {
            task = await workspace.eval['task/error']([JSON.stringify(task)])
            origConsoleLog('error done', {task})
        }

        const systemMessageText = renderResult(task).join("\n")
        const systemMessage = JSON.stringify(textMessage("system", systemMessageText))
        assistantMessage = await workspace.eval['message']([systemMessage])
    }

    return assistantMessage
}
