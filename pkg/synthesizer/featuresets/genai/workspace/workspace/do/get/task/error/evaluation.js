export default async ({unit: {source: content}}) => {
    const task = JSON.parse(content)
    return task
}
