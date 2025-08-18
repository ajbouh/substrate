import * as acorn from "../../../../lib/acorn-8.15.0.js"


/**
 * Detects if a JavaScript code string uses ES6 module syntax (import/export).
 *
 * @param {string} code The JavaScript code to check.
 * @returns {boolean} True if module syntax is present, otherwise false.
 */
function hasModuleSyntax({ast}) {
  // Check the top-level nodes of the AST
  for (const node of ast.body) {
    const nodeType = node.type;
    if (
      nodeType === 'ImportDeclaration' ||
      nodeType === 'ExportNamedDeclaration' ||
      nodeType === 'ExportDefaultDeclaration' ||
      nodeType === 'ExportAllDeclaration'
    ) {
      // Found an import or export statement
      return true;
    }
  }
  // No import or export statements were found
  return false;
}

export function parse({source}) {
    const comments = [];
    const ast = acorn.parse(source, {
        ecmaVersion: 'latest',
        sourceType: 'module',
        onComment: comments,
        locations: true,
        allowReturnOutsideFunction: true,
        allowAwaitOutsideFunction: true,
    });

    return {
        ast,
        comments,
        hasModuleSyntax: hasModuleSyntax({ast})
    }
}

export default async function (handlerInputs) {
    const { action, unit, name, inputs: { attribute } = {}, workspace } = handlerInputs
    
    const source = unit?.source
    return parse({source})
}
