import { astNodeToValue, findDefaultExportValueNode, findStaticJavascriptConst } from './parse-static-javascript-nodes.js'
import { parse } from '../workspace/do/get/javascript/ast.js'

export default async (base, subpaths, sharedAttributes={}) => {
    return Object.fromEntries(await Promise.all(subpaths.map(async subpath => {
        const attributes = {...sharedAttributes}
        const url = new URL(subpath, base)
        const name = subpath.replace(/(\.[^.]+)$/, '') // trim suffix
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`response is not ok; status="${response.status} ${response.statusText}"`)
        }
        const contentType = response.headers.get('Content-Type')
        if (contentType.startsWith('application/javascript') ||
            contentType.startsWith('text/javascript')) {
            attributes.type = 'javascript'
        }
        let source = await response.text()
        if (attributes.type === 'javascript') {
            source = source + `\n//# sourceURL=${name}`
            const {ast} = parse({source})
            const attributesNode = findStaticJavascriptConst({ast, const: 'attributes'})
            if (attributesNode) {
                Object.assign(attributes, astNodeToValue(attributesNode))
            }

            if (attributes.type !== 'javascript') {
                const defaultExport = findDefaultExportValueNode({ast})
                if (defaultExport) {
                    const defaultExportValue = astNodeToValue(defaultExport)
                    source = typeof defaultExportValue === 'string' ? defaultExportValue : JSON.stringify(defaultExportValue)
                }
            }
        }
        return [name, {source, ...attributes}]
    })))
}
