// generate a shim for the following signature

// /**
//  * @typedef {Object} Person
//  * @prop {string} firstName - The person's first name.
//  * @prop {string} lastName - The person's last name.
//  * @prop {number} age - The person's age.
//  */

// /**
//  * Calculates the sum of two numbers.
//  *
//  * @arg {number} a - The first number.
//  * @arg {number} b - The second number.
//  * @returns {number} The sum of `a` and `b`.
//  *
//  * @example
//  * // Example usage:
//  * const result = sum(5, 3);
//  * console.log(result); // Output: 8
//  *
//  * @example <caption>Another example with different values.</caption>
//  * const anotherResult = sum(10, -2);
//  * console.log(anotherResult); // Output: 8
//  */
// function sum(a, b) {
//   return a + b;
// }

const jsdocForExample = ({description, source}) => [
    description ? `@example <caption>${description}</caption>` : `@example`,
    ...source.split("\n"),
    '',
]

const jsdocForProperty = ({type, name, description}) =>
    // can also use @prop
    description ? `@prop {${type}} ${name} - ${description}` : `@prop {${type}} ${name}`

    const jsdocForParam = ({type, name, properties, required, description}) => [
    // can also use @arg
    description
        ? `@arg {${type}${required ? '' : '='}} ${name} - ${description}`
        : `@arg {${type}${required ? '' : '='}} ${name}`,
    ...((type === 'object' && properties)
        ? Object.entries(properties).flatMap(
            ([propertyName, property]) => jsdocForParam({...property, name: `${name}.${propertyName}`}))
        : []),
]

const jsdocForReturns = ({type, description}) => description ? `@returns {${type}} ${description}` : `@returns {${type}}`

const jsdocRenderStanza = stanza => [
    '/**\n',
    ...stanza.flatMap(line => {
        if (line === undefined) {
            return []
        }
        const trimmed = line.trimRight()
        if (trimmed.length) {
            return [` * `, trimmed, '\n']
        }
        return [' *\n']
    }),
    ' */\n',
]
const jsdocRenderStanzas = stanzas => stanzas.flatMap(stanza => jsdocRenderStanza(stanza)).join("")

const jsdocStanzaForTypedef = ({type, name, description, properties}) => [
    description,
    `@typedef {${type}} ${name}`,
    ...Object.entries(properties).flatMap(([name, property]) => jsdocForProperty({...property, name})),
]

const jsdocStanzaForFunction = ({name, virtual, async, global, description, params, returns, examples}) => [
    ...(virtual ? [`@name ${name}`] : []),
    `@function`,
    ...(async ? [`@async`] : []),
    ...(global ? [`@global`] : []),
    '',
    ...(description?.length ? [...description.trim().split("\n"), ''] : []),
    ...(examples?.length ? examples.flatMap(example => jsdocForExample(example)) : []),
    ...Object.entries(params).flatMap(([name, param]) => jsdocForParam({...param, name})),
    (params && Object.keys(params).length) ? '' : undefined,
    returns ? jsdocForReturns(returns) : undefined,
]

export default (doc) => {
    const stanzas = []
    let returnTypedef
    if (doc.returns.type === 'object' && doc.returns.properties) {
        const returnType = `${doc.name}Returns`
        returnTypedef = jsdocStanzaForTypedef({
            type: 'object',
            name: returnType,
            properties: doc.returns.properties,
        })
        doc = {
            ...doc,
            returns: {
                ...doc.returns,
                type: returnType,
            },
        }
    }
    stanzas.push(jsdocStanzaForFunction(doc))
    if (returnTypedef) {
        stanzas.push(returnTypedef)
    }
    return {
        jsdoc: jsdocRenderStanzas(stanzas),
    }
}
