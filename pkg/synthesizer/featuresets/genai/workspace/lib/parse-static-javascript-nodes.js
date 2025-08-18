/**
 * Converts a static AST node into its corresponding JavaScript value.
 * Throws an error if it encounters a non-static part (e.g., a variable).
 * @param {object} node - The Acorn AST node.
 * @returns {any} The JavaScript value.
 */
export function astNodeToValue(node) {
    if (!node) return undefined;

    switch (node.type) {
        case 'Literal':
            return node.value;

        case 'ObjectExpression': {
            const obj = {};
            for (const prop of node.properties) {
                const key = prop.key.type === 'Identifier' ? prop.key.name : prop.key.value;
                obj[key] = astNodeToValue(prop.value);
            }
            return obj;
        }

        case 'ArrayExpression':
            return node.elements.map(element => astNodeToValue(element));

        case 'TemplateLiteral':
            if (node.expressions.length > 0) {
                throw new Error('Template literals with expressions are not supported.');
            }
            // For a static template literal, there is only one "quasi" element.
            return node.quasis[0].value.cooked;

        // Handle `null` (which is a Literal) and identifiers like `undefined`.
        case 'Identifier': {
            // Allow common type constructors to be represented as strings.
            const allowedIdentifiers = ['String', 'Number', 'Boolean', 'Object', 'Array', 'Date'];
            if (allowedIdentifiers.includes(node.name)) {
                return node.name; // Represent the identifier as a string.
            }
            if (node.name === 'undefined') {
                return undefined;
            }
            // For any other identifier, it's likely a variable we can't resolve statically.
            throw new Error(`Non-static identifier found: "${node.name}"`);
        }
        
        // Handle negative numbers like "-10"
        case 'UnaryExpression':
            if (node.operator === '-' && node.argument.type === 'Literal') {
                return -node.argument.value;
            }
                throw new Error(`Unsupported unary operator: "${node.operator}"`);

        default:
            throw new Error(`Unsupported AST node type: "${node.type}"`);
    }
}


/**
 * Finds the 'attributes' export declaration node in the AST.
 * @param {object} ast - The Acorn AST.
 * @returns {object|null} The AST node for the value, or null.
 */
export function findStaticJavascriptConst({ast, const: constName}) {
    for (const node of ast.body) {
        if (node.type === 'ExportNamedDeclaration' && node.declaration) {
            const declaration = node.declaration;
            if (declaration.type === 'VariableDeclaration' && declaration.kind === 'const') {
                const declarator = declaration.declarations.find(
                    d => d.id.type === 'Identifier' && d.id.name === constName
                );
                if (declarator) {
                    return declarator.init; // This is the node for the RHS value
                }
            }
        }
    }
    return null;
}


export function findDefaultExportValueNode({ast}) {
    for (const node of ast.body) {
        if (node.type === 'ExportDefaultDeclaration') {
            // The declaration itself is the value node for default exports
            return node.declaration;
        }
    }
    return null;
}