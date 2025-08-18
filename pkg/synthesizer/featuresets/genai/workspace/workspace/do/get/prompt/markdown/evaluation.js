export default async ({unit: {source}, workspace}) => {
    const result = await workspace.eval.prompt([source])

    const codefenceMatch = result.match(/\s*```(\S+)\n([\s\S]+)\n```\s*/);
    if (codefenceMatch) {
        return {
            source: codefenceMatch[2],
            type: codefenceMatch[1],
        }
    }
    return {
        source: result,
        type: 'text',
    }
}
