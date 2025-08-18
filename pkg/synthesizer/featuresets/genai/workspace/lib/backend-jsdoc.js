import {jsdocRenderFunction} from './jsdoc-render-signature.js'

const jsdocTypeFromAxType = (type) => type.isArray
    ? `Array<${jsdocTypeFromAxType({...type, isArray: false})}>`
    : type.name === 'code'
        ? 'string'
        : type.name

const jsdocFromAxField = ({name, description, type, isOptional}) => ({
    type: jsdocTypeFromAxType(type || {name: 'unknown'}),
    name,
    description,
    required: !isOptional,
})

const jsdocFunctionForSignature = ({name, virtual, async, global, examples, signature: {description, inputs, outputs}}) => ({
    name,
    kind: 'function',
    virtual,
    async,
    global,
    description,
    examples,
    params: {
        obj: {
            type: 'object',
            required: true,
            properties: Object.fromEntries(inputs.map((field) => [field.name, jsdocFromAxField(field)])),
        },
    },
    returns: {
        type: async ? 'Promise<object>' : 'object',
        required: true,
        properties: Object.fromEntries(outputs.map((field) => [field.name, jsdocFromAxField(field)])),
    },
});

export const jsdocRenderSignature = ({name, virtual, global, signature, async, examples, maxExampleCount=3}) => {
    const fieldsFromExample = (example, fields) => Object.fromEntries(fields.map(({name}) => [name, example[name]]))
    const jsdocExamples = (examples || []).slice(0, maxExampleCount).map((example) => ({
        source: [
            `// Returns ${JSON.stringify(fieldsFromExample(example, signature.outputs))}`,
            `${name}(${JSON.stringify(fieldsFromExample(example, signature.inputs))})`,
        ].join("\n"),
    }))
    return jsdocRenderFunction(jsdocFunctionForSignature({name, virtual, global, async, signature, examples: jsdocExamples}))
}

// // convert schema types to JSDoc types
// const jsdocTypeForOpenAPISchemaType = (prop) => {
//     if (!prop) return 'any';
//     switch (prop.type) {
//         case 'string':
//             if (prop.format === 'date-time') return 'Date';
//             return 'string';
//         case 'integer':
//         case 'number':
//             return 'number';
//         case 'boolean':
//             return 'boolean';
//         case 'object':
//             return 'object';
//         case 'array':
//             // Check for item type for more specific array documentation
//             const itemType = prop.items ? getJsDocType(prop.items) : 'any';
//             return `Array<${itemType}>`;
//         default:
//             return 'any';
//     }
// };

const testCases = [
    {
        description: "simple virtual",
        params: [{
            name: "calculateTotalPrice",
            virtual: true,
            signature: {
                description: "Calculates the final price of an item by adding a tax rate.",
                inputs: [
                    {"name": "basePrice", "type": "number", "description": "The price before tax." },
                    {"name": "taxRate", "type": "number", "description": "The tax rate as a decimal (e.g., 0.05 for 5%)." },
                ],
                outputs: [
                    {"name": "totalPrice", "type": "number", "description": "The final price including tax." },
                ],
            },
            examples: [
                {basePrice: 1.0, taxRate: 0.1, totalPrice: 1.1},
                {basePrice: 2.0, taxRate: 0.1, totalPrice: 2.2},
            ],
        }],
        returns: {
            jsdoc: `/**
 * @typedef {object} calculateTotalPriceReturns
 * @property {number} totalPrice - The final price including tax.
 */
/**
 * @name calculateTotalPrice
 * @function
 * 
 * Calculates the final price of an item by adding a tax rate.
 * 
 * @example
 * // Returns {"totalPrice":1.1}
 * calculateTotalPrice({"basePrice":1,"taxRate":0.1})
 * 
 * @example
 * // Returns {"totalPrice":2.2}
 * calculateTotalPrice({"basePrice":2,"taxRate":0.1})
 * 
 * @param {object} inputs
 * @param {number} inputs.basePrice - The price before tax.
 * @param {number} inputs.taxRate - The tax rate as a decimal (e.g., 0.05 for 5%).
 * 
 * @returns {calculateTotalPriceReturns}
 */
`,
        },
    },
]

export const runTestCase = async (t, tc, {fn}) => {
    const jsonEq = (a, b) => JSON.stringify(a) === JSON.stringify(b)
    const returns = await fn(...tc.params)
    t.assert(jsonEq(returns, tc.returns), 'expected returns', {tc, want: tc.returns, got: returns})
}

export const test = (t) => {
    for (const tc of testCases) {
        t.run(tc.description, t => runTestCase(t, tc, {fn: jsdocRenderSignature}))
    }
}
