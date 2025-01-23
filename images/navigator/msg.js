function densify({jsonpointer, sparse}) {
    const dense = new Map()
    Object.entries(sparse).forEach(
        ([ptr, {description, type}]) => {
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
            o.description = description
            o.type = type
        },
    )

    return dense.get("").fields
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
                    h('div', {}, fieldsDOM({h, className: "fieldDescription", o: o2, fieldPrefix: fieldLabel})),
                ])
            }),
    ])
}

export function dom({h, html, md, jsonpointer, msg}) {
    const rootFields = densify({jsonpointer, sparse: msg.msg.meta})
    const data = rootFields.get('data')
    const parameters = data.fields.get('parameters')
    const returns = data.fields.get('returns')
    
    console.log({msg, parameters, returns})

    const name = msg.name
    const description = msg.msg.description

    return h('div', {}, [
        h('h2', {class: 'name'}, name),
        description ? h('div', {class: 'description'}, html([md.render(description)])) : '',
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
