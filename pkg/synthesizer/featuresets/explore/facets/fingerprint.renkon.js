const fingerprintFacet = (() => {
    const inspectValue = v => {
        switch (typeof v) {
        case 'undefined':
            return '∅'
        case 'string':
            return v.includes('"') || v.includes("∅")? JSON.stringify(v) : v
        case 'object':
            return JSON.stringify(v)
        }
        return `${v}`
    }        
    const selfString = (self, fields) => self === undefined
        ? ''
        : Array.isArray(self)
            ? self.map(field => `${field}:${inspectValue(fields[field])}`).join(" ")
            : JSON.stringify(self);

    return {
        label: 'Fingerprint',
        priority: 100,
        align: 'left',
        render: ({h, record}) => h('a', {
            href: '#',
        }, selfString(record.fields.self, record.fields)),
    }
})()
