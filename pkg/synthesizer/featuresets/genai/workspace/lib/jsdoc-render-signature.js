import jsdocRender from '@workspace/lib/jsdoc-render'

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

export default ({name, virtual, global, signature, async, examples, maxExampleCount=3}) => {
    const fieldsFromExample = (example, fields) => Object.fromEntries(fields.map(({name}) => [name, example[name]]))
    const jsdocExamples = (examples || []).slice(0, maxExampleCount).map((example) => ({
        source: [
            `// Returns ${JSON.stringify(fieldsFromExample(example, signature.outputs))}`,
            `${name}(${JSON.stringify(fieldsFromExample(example, signature.inputs))})`,
        ].join("\n"),
    }))
    return jsdocRender(jsdocFunctionForSignature({name, virtual, global, async, signature, examples: jsdocExamples}))
}
