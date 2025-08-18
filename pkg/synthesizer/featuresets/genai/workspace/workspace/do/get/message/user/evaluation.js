export default async ({unit: {source}, workspace}) => {
    const textMessage = (role, text) => ({role, content: [{type: 'text', text}]})
    return await workspace.eval.message([JSON.stringify(textMessage("user", source))])
}
