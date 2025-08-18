export default async function runJSON({unit: {source}}) {
    return JSON.parse(source)
}
