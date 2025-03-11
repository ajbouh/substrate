function findMatchingInspector(inspectorMatchers, value) {
    const partition = (arr, fn) => arr.reduce((acc, val) => (acc[fn(val) ? 0 : 1].push(val), acc), [[], []]);
    const matches = inspectorMatchers.map(fn => fn(value, [], value)).filter(m => m)
    const [partials, full] = partition(matches, m => m.fields)
    if (full.length) {
        return full[0]
    }
    if (partials.length) {
        const residue = []
        if (typeof value === 'object') {
            for (const key in value) {
                if (!partials.some(({fields}) => fields.includes(key))) {
                    residue.push([key, value[key]])
                }
            }
        }
        return {
            type: "partials",
            parameters: {
                partials: [
                    ...partials,
                    ...(residue.length ? [
                        {type: "object", parameters: Object.fromEntries(residue)},
                    ] : []),
                ],
                value,
            }
        }
    }
    return {
        type: "object",
        parameters: value
    }
}

// a convenience function to make destructuring a given value safer
const fieldMatcher = (fn) => (value, path, root) => (typeof value === 'object') && value && fn(value, path, root)
const stringTest = (value, pattern) => (typeof value === 'string') && (!pattern || pattern.test(value))
const inspectorMatchers = [
    fieldMatcher(({source}, path, root) => (
        stringTest(source) &&
        {
            type: "pre",
            parameters: {text: source},
            fields: ["source"],
        }
    )),
    fieldMatcher(({href, text}, path, root) => (
        stringTest(href) &&
        {
            type: "link",
            parameters: {href, text: text || href},
            fields: ["href", "text"],
        }
    )),
    fieldMatcher(({description}, path, root) => (
        stringTest(description) &&
        {
            type: "markdown",
            parameters: {text: description},
            fields: ["description"],
        }
    )),
    fieldMatcher(({base64, mimeType}, path, root) => (
        stringTest(base64) &&
        stringTest(mimeType, /^image\//) &&
        {
            type: "img",
            parameters: {src: `data:${mimeType};base64,${base64}`},
            fields: ["base64", "mimeType"],
        }
    )),
]

export const makeInspectors = function({h, Renkon}) {
    return {
        auto(value) {
            const {
                type,
                parameters
            } = findMatchingInspector(inspectorMatchers, value)
            return this[type](parameters)
        },
        partials({value, partials}) {
            // a bit naive, but returns a parent <div> with each match in partials.
            return h('div', {}, partials.map(({type, parameters}) => this[type](parameters)))
        },
        object: (value) => {
            return h("div", {
                ref: (dom) => dom && Renkon.app.newInspector(value, dom),
            }, "")
        },
        iframe: ({src}) => h('iframe', {src}),
        pre: ({text}) => h('pre', {}, text),
        link: ({href, text}) => h('a', {href}, text),
        img: ({src}) => h('img', {src}),
        markdown: ({text}) => html([md.render(text)]),
    }
}
