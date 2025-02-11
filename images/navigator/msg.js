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

export function dom({h, html, md, jsonpointer, msg}) {
    const rootFields = densify({jsonpointer, sparse: msg?.msg?.meta})
    const data = rootFields?.get('data')
    const parameters = data?.fields?.get('parameters')
    const returns = data?.fields?.get('returns')
    
    // TODO merge msg.msg.data with data above
    const examples = msg?.msg?.data?.examples

    console.log({msg, parameters, returns, examples})

    const name = msg?.name
    const description = msg?.description

    return h('div', {}, [
        h('h2', {class: 'name'}, name),
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
