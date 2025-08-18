import { createDynamicModule } from '../../../lib/create-dynamic-module.js';
import { findDefaultExportValueNode } from '../../../lib/parse-static-javascript-nodes.js';
import getJavascriptAST from './javascript/ast.js'
import getJavascriptDeps from './javascript/deps.js'
import getJavascriptDocs from './javascript/docs.js'

const origConsoleLog = console.log

async function runJavaScriptModule({source, workspace, ast, deps}) {
    const workspaceImplModuleName = "@workspace/impl"
    const workspaceImplModuleSource = `
let workspace
export const setWorkspace = (w) => {
    if (workspace) { throw new Error("workspace already set") }
    workspace = w
}
export const getWorkspace = () => workspace`

    const workspaceModuleName = "@workspace"
    const workspaceModuleSource = `
import { getWorkspace } from "${workspaceImplModuleName}"
export default getWorkspace()
`

    const depModules = deps.map(([importName, depName, specifiers]) => {
        const importsDefault = specifiers.some(({type}) => type === 'default')
        const importsNamespace = specifiers.some(({type}) => type === 'namespace')
        let maybeExportDefault = importsDefault ? `export default (dep[Symbol.toStringTag] == 'Module') ? dep.default : dep` : ''

        const importNames = new Set(specifiers.flatMap(({type, importedName}) => type === 'named' ? [importedName] : []))
        let maybeExportNames = ''
        if (importNames.size) {
            maybeExportNames = Array.from(importNames, name => `export const ${name} = dep.${name};`).join("\n")
        }

        // if (importsNamespace) {
        //     // this is a hack and we really should be parsing the exports of the source module to generate maybeExportNames
        //     maybeExportDefault = `export default {...dep}`
        // }

        return [importName, `
const {default: workspace} = await import("${workspaceModuleName}")
const dep = await workspace.get(${JSON.stringify(depName)})
${maybeExportDefault}
${maybeExportNames}
    `]
    })

    const cleanups = []

    const {
        entryURL: workspaceImplEntryURL,
        cleanup: workspaceImplCleanup,
        importMap: workspaceImplImportMap,
    } = createDynamicModule({
        entryName: workspaceImplModuleName,
        entrySource: workspaceImplModuleSource,
    })
    cleanups.push(workspaceImplCleanup)

    const {
        entryURL: workspaceEntryURL,
        cleanup: workspaceCleanup,
        importMap: workspaceImportMap,
    } = createDynamicModule({
        entryName: workspaceModuleName,
        entrySource: workspaceModuleSource,
        scopedImports: workspaceImplImportMap.imports,
    })
    cleanups.push(workspaceCleanup)

    let allScopedImports = [workspaceImportMap.imports]
    let allScopes = [workspaceImportMap.scopes]
    for (const [importName, depModuleSource] of depModules) {
        const {
            cleanup,
            importMap,
        } = createDynamicModule({
            entryName: importName,
            entrySource: depModuleSource,
            scopedImports: workspaceImportMap.imports,
            scopes: workspaceImportMap.scopes,
        })
        allScopedImports.push(importMap.imports)
        allScopes.push(importMap.scopes)
        cleanups.push(cleanup)
    }

    const {
        entryURL,
        cleanup,
        importMap,
    } = createDynamicModule({
        entrySource: source,
        importSources: Object.fromEntries(depModules),
        scopedImports: Object.assign({}, ...allScopedImports),
        scopes: Object.assign({}, ...allScopes),
    })
    cleanups.push(cleanup)

    // add import map to document
    const importmapScript = document.createElement('script');
    importmapScript.type = 'importmap';
    importmapScript.textContent = JSON.stringify(importMap, null, 2);
    document.head.prepend(importmapScript)
    cleanups.push(() => importmapScript.remove())

    const { setWorkspace } = await import(workspaceImplEntryURL)
    setWorkspace(workspace)

    try {
        const module = await import(entryURL)
        return module.default ? module.default : module
    } catch (err) {
        throw err
    } finally {
        // clean up once we're done
        cleanups.forEach(f => f())
    }
}

/**
 * Analyzes the code and converts the last expression (if any) to a 'return' statement.
 *
 * @param {string} code The code to parse.
 * @returns {string} The code with an explicit return statement for the last expression.
 */
function addReturnToLastExpression({source, ast}) {
    if (!ast.body || ast.body.length === 0) {
        return source;
    }

    const lastStatement = ast.body[ast.body.length - 1];

    // The only time we want to add a `return` is if the last statement
    // is an ExpressionStatement. This covers things like `1+1`, `"hello"`,
    // `myFunction()`, but not `let x = 5`, `if(...)`, or `return y`.
    if (lastStatement.type !== 'ExpressionStatement') {
        // In all other cases (e.g., the last statement is already a return,
        // a variable declaration, an if-block, etc.), return the original source.
        return source
    }

    const expression = lastStatement.expression;

    // Slice the original source to get everything before and after the last expression.
    const prefix = source.slice(0, expression.start);
    const suffix = source.slice(expression.start, expression.end);

    // Reconstruct the source with the 'return' keyword injected.
    return `${prefix}return ${suffix}`;
}

// we should use a sandbox instead, for multiple reasons:
// - this hack can break our own console.log
// - this can get stuck in an infinite loop
// - the source or test can interfere with our own execution
async function runJavascriptScriptWithDepValues({source, log, depValues}) {
    const renderedSource = [
        `return (async () => {`,
        'arguments[0] && (console.log = arguments[0]);',
        ...Object.keys(depValues).map(name => `const ${name} = arguments[1].${name};`),
        source,
        `})();`,
    ].join("\n")
    
    try {
        const fn = new Function(renderedSource)
        return await fn.call(null, log, depValues)
    } finally {
        console.log = origConsoleLog
    }
}

async function runJavascript(handlerInputs) {
    const {unit, name, workspace} = handlerInputs
    let {source} = unit
    if (typeof source !== 'string') {
        origConsoleLog({source})
        const err = new Error(`source must be a string`)
        err.source = source
        throw err
    }

    let deps = []
    try {
      deps = await workspace.getAttribute({unit, name, attribute: 'deps'})
    } catch (e) {
      console.warn('could not parse free variables in source', e, {source})
    }

    let ast, hasModuleSyntax
    try {
      ({ast, hasModuleSyntax} = await workspace.getAttribute({unit, name, attribute: 'ast'}))
    } catch (err) {
      console.warn('could not parse ast from source', e, {source})
    }

    if (hasModuleSyntax) {
        return await runJavaScriptModule({source, workspace, deps, ast})
    }

    return await runJavascriptScript({source, workspace, deps, ast})
}

async function runJavascriptScript({source, workspace, deps, ast}) {

    // rewrite the source to return the value of expression if necessary
    source = addReturnToLastExpression({source, ast})

    const getAll = async (names, options) => {
        return Object.fromEntries(await Promise.all(
            Array.from(names, async name => [name, (await workspace.get(name, options))])))
    }

    let depValues = {}
    try {
        const undefinedDeps = deps.filter(v => !workspace.has(v))
        if (undefinedDeps.length) {
            throw new Error(`workspace does not have definitions for unbound variables in source: ${undefinedDeps.join(", ")}`)
        }
        depValues = await getAll(deps)
    } catch (e) {
        console.warn('could not parse free variables in source', e, {source})
    }
        
    return await runJavascriptScriptWithDepValues({source, log: workspace.log, depValues})
}


async function findExportedAttributesIfAny({unit, name, workspace}) {
    const { ast } = await workspace.getAttribute({ unit, name, attribute: 'ast' })
    const {source} = unit
    const attributesSource = findDefaultExportValueNode({source, ast})
    if (!attributesSource) {
        return undefined
    }
    return await runJavascriptScriptWithDepValues({source: `return ${attributesSource}`, log: workspace.log, depValues: {}})
}

export default async function(handlerInputs) {
    if (handlerInputs.action !== 'get') {
        return undefined
    }

    const {unit, name, workspace, inputs: {attribute}} = handlerInputs

    switch (attribute) {
    case 'evaluation':
        return await runJavascript(handlerInputs)
    }

    switch (attribute) {
    case 'ast':
        return await getJavascriptAST(handlerInputs)
    case 'docs':
        return await getJavascriptDocs(handlerInputs)
    case 'deps':
        return await getJavascriptDeps(handlerInputs)
    }

    // if it's a module and it has an export attributes expression, then maybe we can just use that?
    const exportedAttributes = await findExportedAttributesIfAny(handlerInputs)
    if (exportedAttributes) {
        return exportedAttributes[attribute]
    }

    return undefined
}
