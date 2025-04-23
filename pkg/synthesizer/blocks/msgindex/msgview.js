function densify({jsonpointer, sparse}) {
    if (!sparse) {
        return new Map()
    }
    const dense = new Map()
    Object.entries(sparse).forEach(
        ([ptr, attrs]) => {
            const p = jsonpointer.compile(ptr).compiled
            p.reduce((acc, e) => {
                let m = acc.get(e)
                if (!m) {
                    m = {fields: new Map()}
                    acc.set(e, m)
                }
                return m.fields
            }, dense)
            const last = p.length - 1
            const o = p.slice(0, last).reduce((acc, e) => acc.get(e).fields, dense).get(p[last])
            for (const k in attrs) {
                o[k] = attrs[k]
            }
        },
    )

    return dense.get("")?.fields || new Map()
}

function fieldsDOM({h, className, o, fieldPrefix=""}) {
    return h('div', {class: className}, [
        o?.description ? o.description : '',
        !o || (o.fields.size === 0) ?
            [] :
            Array.from(o.fields, ([name, o2]) => {
                const fieldLabel = fieldPrefix.length
                    ? /^\d+$/.test(name)
                        ? `${fieldPrefix}[${name}]`
                        : /"|-|\./.test(name)
                            ? `${fieldPrefix}[${JSON.stringify(name)}]`
                            : `${fieldPrefix}.${name}`
                    : name
                return h('div', {class: "field"}, [
                    h('span', {class: "fieldName"}, fieldLabel),
                    h('span', {class: "fieldType"}, o2.type ?? 'object'),
                    h('span', {class: "fieldRequired"}, o2.required ? 'Required' : ''),
                    h('div', {}, fieldsDOM({h, className: "fieldDescription", o: o2, fieldPrefix: fieldLabel})),
                ])
            }),
    ])
}

function msg2Syntax(msg, msgName) {
    return [
        msg.description ? msg.description.split('\n').map(l => `// ${l}`).join('\n') + '\n' : '',
        msgName, ' ',
        Object.entries(msg.data?.parameters || {}).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(" "),
    ]
}

function examplesDOM({h, className, examples, msgName}) {
    return h('div', {class: className}, [
        ...Object.entries(examples).map(([name, example]) => {
            return h('div', {class: 'example'}, [
                h('div', {class: "name"}, name),
                h('code', {style: {'white-space': 'pre-wrap'}}, msg2Syntax(example, msgName)),
            ])
        }),
    ])
}

export function dom({h, html, md, jsonpointer}) {
    return ({msg, msgname, style}) => {
        if (!msg) {
            return null
        }
        const rootFields = densify({jsonpointer, sparse: msg?.msg?.meta})
        const data = rootFields?.get('data')
        const parameters = data?.fields?.get('parameters')
        const returns = data?.fields?.get('returns')
        
        // TODO merge msg.msg.data with data above
        const examples = msg?.msg?.data?.examples

        console.log({msg, parameters, returns, examples})

        const name = msg?.name
        const description = msg?.description

        return h('div', {style}, [
            h('style', {}, `
                .fieldDescription > .field {
                    padding: 1em;
                    border-radius: 0.2em;
                    border: 1px #ccc solid;
                }
                .field {
                    border-bottom: 1px #ccc solid;
                    border-collapse: collapse;
                    margin-top: 1ex;
                    padding-bottom: 1ex;
                }
                .fieldName {
                    font-weight: 700;
                    color: #111;
                    font-family: monospace;
                }
                .fieldType {
                    font-weight: 200;
                    color: #777;
                    margin-left: 1ex;
                    font-size: 0.9em;
                }
                .fieldDescription {
                    color: #555;
                    padding-top: 1ex;
                    padding-bottom: 1ex;
                }
                .fieldRequired {
                    font-weight: 700;
                    color: #f95;
                    margin-left: 1ex;
                    font-size: 0.9em;
                }
                .example {
                    background: #fcfcfc;
                    border-radius: 0.25em;
                    border: 1px solid #ccc;
                }
                .example .name {
                    background: #ddd;
                    color: #444;
                    font-weight: 700;
                    padding-left: 1em;
                    padding-top: 0.25em;
                    padding-bottom: 0.25em;
                }
                .example code {
                    padding: 1em;
                    display: block;
                    color: #333;
                }
                
            `),
            h('h2', {class: 'name'}, msgname),
            description ? h('div', {class: 'description'}, html([md.render(description)])) : '',
            examples ? h('div', {}, [
                h('h3', {}, 'Examples'),
                examplesDOM({h, className: "", examples, msgName: name}),
            ]) : '',
            h('div', {}, [
                h('h3', {}, 'Parameters'),
                fieldsDOM({h, className: "", o: parameters}),
            ]),
            h('div', {}, [
                h('h3', {}, 'Returns'),
                fieldsDOM({h, className: "", o: returns}),
            ]),
        ])
    }
}
