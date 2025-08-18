export default async ({unit: {source}, workspace}) => {
    const stepPromptsUnit = await workspace.eval['prompt/markdown']
`Transform the following list into a json array, with each number its own element in the array but the element number itself removed. Output a json codefence, no javascript.

${source}`

    const stepPrompts = await workspace.eval({unit: stepPromptsUnit})

    const steps = stepPrompts.map(source => ({source, type: 'message/user'}))
    console.log({steps})
    return await workspace.eval.plan([JSON.stringify({steps})])
}
