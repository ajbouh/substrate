export default async function (handlerInputs) {
    const {action, unit, name, inputs: {attribute}={}, workspace} = handlerInputs
    let type = unit?.type
    let getter

    let getterName = `workspace/do/get/${type}`
    if (workspace.has(getterName)) {
        getter = await workspace.get(getterName)
    }
    if (!getter) {
        if (attribute) {
            getterName = `workspace/do/get/${type}/${attribute}`
            if (workspace.has(getterName)) {
                getter = await workspace.get(getterName)
            }
        }
    }
    if (!getter) {
        // the default evaluation is just the source itself
        if (attribute === 'evaluation') {
            return unit.source
        }
        return undefined
    }

    return await getter(handlerInputs)
}
