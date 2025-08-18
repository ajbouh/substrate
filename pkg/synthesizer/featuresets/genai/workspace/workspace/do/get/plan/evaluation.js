export default async ({unit: {source}, workspace}) => {
    const exante = workspace.save()

    let todo = workspace.has('plan/todo') ? await workspace.get('plan/todo') : []

    if (workspace.has('plan/paused')) {
        const wasPaused = await workspace.get('plan/paused')
        if (wasPaused) {
            workspace.write({'plan/paused': {evaluation: false}})
        }
    }

    // push plan
    let now = JSON.parse(source || "{}")
    if (now?.steps?.length) {
        todo = [...now.steps, ...todo]
        workspace.write({'plan/todo': {source: JSON.stringify(todo), type: 'json'}})
    }

    if (todo.length === 0) {
        return
    }

    const step = todo[0]
    todo = todo.slice(1)
    workspace.write({
        'plan/todo': {source: JSON.stringify(todo), type: 'json'},
        // (...should workspace always make the running source available?)
        'plan/step': {source: JSON.stringify(step), type: 'json'},
    })

    let returned, caught
    try {
        console.log({step})
        returned = await workspace.eval({unit: step})
    } catch (err) {
        caught = err
    }

    let past = workspace.has('plan/past') ? await workspace.get('plan/past') : []
    past = [...past, {step, returned, caught, exante, expost: workspace.save()}]
    workspace.write({
        // (...should all runs be logged in plan/past?)
        'plan/past': {source: JSON.stringify(past), type: 'json'},
    })

    if (caught) {
        throw caught
    }

    const nextTodo = workspace.has('plan/todo') ? await workspace.get('plan/todo') : []
    if (nextTodo.length === 0) {
        return returned
    }

    const shouldPause = workspace.has('plan/paused') ? await workspace.get('plan/paused') : false
    if (shouldPause) {
        return shouldPause
    }

    return await workspace.eval.plan``
}
