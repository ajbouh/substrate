export default async ({unit: {source}, workspace}) => {
    const spawned = await workspace.spawn()
    const message = {role: 'user', content: [{type: 'text', text: source}]}
    const response = await spawned.eval.message([JSON.stringify(message)])
    return response.content[0].text
}
