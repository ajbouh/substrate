import * as acorn from "./acorn-8.15.0.js"

/**
 * Extracts specifier details from an ExportNamedDeclaration's `declaration` property.
 * @param {object} declaration - The declaration node.
 * @returns {Array} An array of specifier objects.
 */
function extractSpecifiersFromDeclaration(declaration) {
    if (declaration.declarations) { // `export const a = 1, b = 2`
        return declaration.declarations.map((decl, i) => ({
            localName: decl.id.name,
            exportedName: decl.id.name,
            span: {
                // use the start of `const ...` for the first span
                start: i == 0 ? declaration.start : decl.start,
                end: decl.end,
            },
        }));
    }
    if (declaration.id) { // `export function a() {}`
        return [{
            localName: declaration.id.name,
            exportedName: declaration.id.name,
            span: {start: declaration.start, end: declaration.end},
        }];
    }
    return [];
}

/**
 * Extracts specifier details from an ExportNamedDeclaration's `specifiers` property.
 * @param {Array} specifiers - The array of specifier nodes.
 * @returns {Array} An array of specifier objects.
 */
function extractSpecifiersFromSpecifiers(specifiers) {
    // `export { a, b as c }`
    return specifiers.map(spec => ({
        localName: spec.local.name,
        exportedName: spec.exported.name
    }));
}

/**
 * A map of AST node types to pure handler functions that process them.
 * Each handler returns a structured object or null.
 */
const nodeHandlers = {
    'ImportDeclaration': (node) => {
        const importData = {
            source: node.source.value,
            specifiers: node.specifiers.map(specifier => {
                if (specifier.type === 'ImportDefaultSpecifier') {
                    return { type: 'default', localName: specifier.local.name };
                }
                if (specifier.type === 'ImportNamespaceSpecifier') {
                    return { type: 'namespace', localName: specifier.local.name };
                }
                return { type: 'named', importedName: specifier.imported.name, localName: specifier.local.name };
            }),
            attributes: (node.attributes || []).map(attribute => ({
                key: attribute.key.name || attribute.key.value,
                value: attribute.value.value
            })),
            span: { start: node.start, end: node.end },
        };
        return { type: 'import', data: importData };
    },
    'ImportExpression': (node) => {
        if (node.source.type === 'Literal') {
            return {
                type: 'import',
                data: {
                    dynamic: true,
                    source: node.source.value,
                    specifiers: [],
                    attributes: [],
                    span: { start: node.start, end: node.end },
                }
            };
        }
        return null; // Handle cases like import(variable)
    },
    'ExportNamedDeclaration': (node) => {
        const exportData = {
            type: 'named',
            source: node.source ? node.source.value : null,
            specifiers: node.declaration
                ? extractSpecifiersFromDeclaration(node.declaration)
                : extractSpecifiersFromSpecifiers(node.specifiers),
            span: { start: node.start, end: node.end },
        };
        return { type: 'export', data: exportData };
    },
    'ExportDefaultDeclaration': (node) => {
        return {
            type: 'export',
            data: {
                type: 'default',
                name: node.declaration.id ? node.declaration.id.name : 'anonymous',
                span: { start: node.start, end: node.end },
            },
        };
    },
    'ExportAllDeclaration': (node) => {
        return {
            type: 'export',
            data: {
                type: 'all',
                source: node.source.value,
                span: { start: node.start, end: node.end },
            },
        };
    }
};

function walk(node, callback) {
    if (!node) return;
    callback(node);
    for (const key in node) {
        if (Object.prototype.hasOwnProperty.call(node, key)) {
            const child = node[key];
            if (typeof child === 'object' && child !== null) {
                if (Array.isArray(child)) {
                    child.forEach(item => walk(item, callback));
                } else {
                    walk(child, callback);
                }
            }
        }
    }
}

/**
 * Parses a string of JavaScript code to extract import and export statements.
 * @param {string} code The JavaScript code to parse.
 * @returns {object} An object containing arrays of `imports` and `exports`.
 */
export function parseImportExportStatements(code) {
    const ast = acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
    const statements = { imports: [], exports: [] };

    walk(ast, (node) => {
        const handler = nodeHandlers[node.type];
        if (handler) {
            const result = handler(node);
            if (result) { // Check if handler returned a result
                if (result.type === 'import') {
                    statements.imports.push(result.data);
                } else if (result.type === 'export') {
                    statements.exports.push(result.data);
                }
            }
        }
    });

    return statements;
}


const testCases = [
    {
        name: "Simple Default Import",
        input: "import myDefault from 'my-module';",
        expected: {
            imports: [{ source: 'my-module', specifiers: [{ type: 'default', localName: 'myDefault' }], attributes: [], span: {start: 0, end: 34} }],
            exports: []
        }
    },
    {
        name: "Simple Dynamic Import",
        input: "() => import('foo');",
        expected: {
            imports: [{ dynamic: true, source: 'foo', specifiers: [], attributes: [], span: {start: 6, end: 19} }],
            exports: []
        }
    },
    {
        name: "Import with attributes",
        input: "import data from './data.json' with { type: 'json' };",
        expected: {
            imports: [{ source: './data.json', specifiers: [{ type: 'default', localName: 'data' }], attributes: [{key: 'type', value: 'json'}], span: {start: 0, end: 53} }],
            exports: []
        }
    },
    {
        name: "Named export of a constant",
        input: "export const myVar = 123;",
        expected: {
            imports: [],
            exports: [{
                type: 'named',
                source: null,
                specifiers: [{ localName: 'myVar', exportedName: 'myVar', span: {start: 7, end: 24} }],
                span: {start: 0, end: 25},
            }]
        }
    },
    {
        name: "Default export of a function",
        input: "export default function myFunc() {}",
        expected: {
            imports: [],
            exports: [{ type: 'default', name: 'myFunc', span: {start: 0, end: 35} }]
        }
    },
    {
        name: "Combination of imports and exports",
        input: `
            import React from 'react';
            import { useState } from 'react';
            export const greeting = 'hello';
            export default function App() {}
        `,
        expected: {
            imports: [
                { source: 'react', specifiers: [{ type: 'default', localName: 'React' }], attributes: [], span: {start: 13, end: 39} },
                { source: 'react', specifiers: [{ type: 'named', importedName: 'useState', localName: 'useState' }], attributes: [], span: {start: 52, end: 85} }
            ],
            exports: [
                {
                    type: 'named',
                    source: null,
                    specifiers: [{ localName: 'greeting', exportedName: 'greeting', span: {start: 105, end: 129} }],
                    span: {start: 98, end: 130},
                },
                {
                    type: 'default',
                    name: 'App',
                    span: {start: 143, end: 175},
                }
            ]
        }
    },
        {
        name: "No imports or exports",
        input: "const a = 1; let b = 2;",
        expected: {
            imports: [],
            exports: []
        }
    },
    {
        name: "Empty input",
        input: "",
        expected: {
            imports: [],
            exports: []
        }
    },
    {
        name: "Invalid syntax should throw error",
        input: "import { myVar from 'my-module';", // Invalid syntax
        error: {"pos":15,"loc":{"line":1,"column":15},"raisedAt":19}
    }
];

function runTestCase(t, tc) {
    function execute(inputCode) {
        try {
            const value = parseImportExportStatements(inputCode);
            return { value, error: null };
        } catch (e) {
            return { value: null, error: e };
        }
    }

    const want = tc.error
        ? {value: null, error: tc.error }
        : {value: tc.expected, error: null }

    const got = execute(tc.input)

    t.assert(JSON.stringify(want) === JSON.stringify(got), "output should match expectation", "want", want, "!=", "got", got)
}

export const test = t => {
    testCases.forEach(tc => t.run(tc.name, t => runTestCase(t, tc)))
}
