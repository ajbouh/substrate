import handleDo from './workspace/do.js'
import handleDoGet from './workspace/do/get.js'
import handleDoGetJavascript from './workspace/do/get/javascript.js'
import importUnits from './lib/import-units.js'

const metadata = o => workspace.getMetadata(o)

const simpleJSDocForGlobalFunction = ({name, description}) => {
    return [
        `/**`,
        ` * @name ${name}`,
        ` * ${description.split("\n").map(line => " * " + line).join("\n")}`,
        ` * @global`,
        ` * @function`,
        `*/ `
    ].join("\n")
}

const pausePlan = `
/**
 * Pauses the current running plan.
 */
() => workspace.write({'plan/paused': {evaluation: true}})`

const workspaceSource = `
import workspace from "@workspace"
export default workspace
`

export default async () => ({
    // these are part of the bootstrapping sequence, so must be provided as values directly for now.
    'workspace/do': {evaluation: handleDo},
    'workspace/do/get': {evaluation: handleDoGet},
    'workspace/do/get/javascript': {evaluation: handleDoGetJavascript},

    ...await importUnits(import.meta.url, [
            'workspace/do/get/jsdoc-example/evaluation.js',
            'workspace/do/get/json/evaluation.js',
            'workspace/do/get/message/evaluation.js',
            'workspace/do/get/message/assistant/evaluation.js',
            'workspace/do/get/message/user/evaluation.js',
            'workspace/do/get/openapi-request/evaluation.js',
            'workspace/do/get/plan/evaluation.js',
            'workspace/do/get/plan/markdown/evaluation.js',
            'workspace/do/get/prompt/evaluation.js',
            'workspace/do/get/prompt/markdown/evaluation.js',
            'workspace/do/get/task/evaluation.js',
            'workspace/do/get/task/error/evaluation.js',
            'workspace/do/get/javascript/docs.js',

            'workspace/do/test.js',

            'help.js',

            'chat/messages/init.js',
            'chat/messages/init/demos.js',
            'chat/messages/init/instructions.js',

            'lib/jsdoc-render.js',
            'lib/jsdoc-render-signature.js',
            'lib/jsdoc-render-signature/tests/simple.js',
            'lib/jsdoc-render/tests/simple.js',
            'lib/jsdoc-render/tests/destructuring.js',
            'lib/jsdoc-render/tests/virtual.js',

            'lib/jsonpointer.js',
            'lib/openapi.js',

            // additional experiments
            'workspace/do/edit.js',
            'workspace/do/screenshot.js',
            'workspace/do/show.js',
        ]),

    'pausePlan': {source: pausePlan.toString(), type: 'javascript'},
    'continuePlan': {source: '', docs: simpleJSDocForGlobalFunction({name: 'continuePlan', description: 'continues execution of the current plan'}), type: 'plan'},

    'workspace': {source: workspaceSource, type: 'javascript', docs: 'the current workspace'},
    'startDebugger': {evaluation: () => {debugger}, docs: simpleJSDocForGlobalFunction({name: 'startDebugger', description: 'Starts the debugger'})},
    'metadata': {source: metadata.toString(), type: 'javascript'},

    // a bit of a hack
    'chat/messages/init/globals': {evaluation: ['help', 'workspace', 'metadata', 'startDebugger', 'pausePlan', 'continuePlan']},
})
