export default async function (handlerInputs) {
    const {action, unit, name, workspace} = handlerInputs
    const actionHandlerName = `workspace/do/${action}`
    const actionHandler = await workspace.get(actionHandlerName)
    return await actionHandler.call(this, handlerInputs)
}
