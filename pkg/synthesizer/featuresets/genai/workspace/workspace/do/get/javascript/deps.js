import { parseFreeVariables } from '../../../../lib/parse-free-variables.js'
import parseImportExportStatements from '../../../../lib/parse-import-export-statements.js'
/**
 * Finds all free variables in a given JavaScript code string.
 * A free variable is a variable that is referenced but not declared in the
 * current scope or any of its parent scopes.
 *
 * @param {string} code The JavaScript source code to analyze.
 * @returns {string[]} An array of unique free variable names.
 */
export default async function (handlerInputs) {
    const { action, unit, name, inputs: { attribute } = {}, workspace } = handlerInputs
    const { ast, hasModuleSyntax } = await workspace.getAttribute({ unit, name, attribute: 'ast' })

    if (!hasModuleSyntax) {
        return parseFreeVariables({ast})
    }

    const {imports} = parseImportExportStatements({ast})
    const importSources = imports.map(({source, specifiers}) => ({source, specifiers}))

    const workspacePrefix = '@workspace/'
    const deps = []
    for (const {source: importSource, specifiers} of importSources) {
        let dep = importSource
        if (!dep.startsWith(workspacePrefix)) {
            continue
        }

        dep = dep.slice(workspacePrefix.length)
        if (dep.endsWith('.js')) {
            dep = dep.slice(0, -3)
        }
        deps.push([importSource, dep, specifiers.map(({type, importedName}) => ({type, importedName}))])
    }

    return deps
}
