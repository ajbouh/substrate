// ---
// query: view: "group-by-path-max-id"
// ---
// explorer
// group these together so we can delay init until they are all loaded and available.
const {h, html, render, Component} = modules.preact
const {decodeTime} = modules.ulid
const {criteriaMatcher} = modules.recordsMatcher

const init = Events.once(modules);
((init) => {
    Events.send(ready, true);
})(init);

const actionOfferRecords = Behaviors.collect(
    undefined,
    recordsUpdated, (now, {offers: {incremental, records: offers}={}}) => {
        return offers ?? now
    })
const actionOffersets = actionOfferRecords.map(({fields: {offerset}}) => offerset)

const sortRecords = records => records.sort((a, b) => a.fields?.path?.localeCompare(b.fields?.path))
// const sortRecords = records => records.sort((a, b) => a.fields?.path?.localeCompare(b.fields?.path))
// const sortRecords = records => records.reverse()

const records = Behaviors.collect(
    undefined,
    recordsUpdated, (now, {records: {incremental, records}={}}) =>
        records
            ? sortRecords(incremental ? [...records, ...now] : records)
            : now,
);

const recordStringDigest = record => record.fields.self
    ? JSON.stringify({self: record.fields.self, ...(Object.fromEntries(record.fields.self.map(field => [field, record.fields[field]])))})
    : JSON.stringify({self: ["id"], id: record.id})

const recordKey = record => recordStringDigest(record)

const recordsMap = Behaviors.collect(
    {map: new Map(), removed: new Set()},
    recordsUpdated, (prev, {records: {incremental, records}={}}) => {
        if (!records) {
            return prev
        }

        let removed
        let map
        let any = false
        if (incremental) {
            removed = new Set()
            map = prev.map
            for (const record of records) {
                const key = recordKey(record)
                if (map.has(key)) {
                    continue
                }
                map.set(key, record)
                any = true
            }
        } else {
            any = true
            removed = new Set(prev.map.keys())
            map = new Map()
            for (const record of records) {
                const key = recordKey(record)
                removed.delete(key)
                map.set(key, record)
            }
        }

        return any ? {map, removed} : prev
    }
)

const recordsRemoved = Events.collect(undefined, recordsMap, (prev, {removed}) => removed.size ? removed : undefined)

console.log({recordsRemoved})

const facets = Behaviors.gather(/Facet$/);
const facetEntries = Object.values(facets);
const facetDomains = Object.values(Behaviors.gather(/FacetDomain$/));
((facetDomains, records) => {
    facetDomains.map(domain => domain(records, {decodeTime}))
})(facetDomains, records)

const commonInput = {h, decodeTime}

const actOnRecordSelections = Events.receiver();
(({verbFallbacks, event}) => act({verb: verbFallbacks, records: recordSelections, event}))(actOnRecordSelections);

const recordSelectionReplace = Events.receiver();
const recordSelectionMap = Behaviors.select(
    {map: new Map(), options: []},
    // self.fields.selectionQuery, (prev, query) => {
    //     const map = new Map()
    //     const matcher = criteriaMatcher(query)
    //     for (const record of records.filter(matcher)) {

    //     }
    //     return prev
    // },
    recordSelectionReplace, (prev, {options}) => {
        const map = new Map()
        for (const option of options) {
            const key = option.value
            map.set(key, recordsMap.map.get(key))
        }
        return {map, options}
    },
    recordsRemoved, (prev, removed) => {
        const optionMap = new Map(Array.from(prev.options, option => [option.value, option]))
        const map = new Map(prev.map)
        let any
        for (const key of removed) {
            if (map.delete(key)) {
                any = true
            }
            const option = optionMap.get(key)
            if (option) {
                option.selected = false
                optionMap.delete(key)
            }
        }
        return any ? {map, options: [...optionMap.values()]} : prev
    }
)

console.log('in explorer', {self});
console.log('in explorer', {recordSelectionMap});

((declareSelection, recordSelections) => {
    declareSelection(recordSelections)
})(declareSelection, Events.change(recordSelections));

const recordSelections = [...recordSelectionMap.map.values()]
const recordSelectionKeys = new Set(recordSelectionMap.map.keys())

const defaultElement = Behaviors.receiver();
const windowFocus = Events.listener(window, 'focus', event => event);
((defaultElement, windowFocus) => {
    if (!defaultElement) {
        return
    }
    if (document.activeElement === defaultElement) {
        return
    }
    defaultElement.focus();
})(defaultElement, windowFocus);

const SelectableList = ({oninput, ondblclick, onmousedown, facet, records, selectRef}) => {
    return h('div', {
        style: `
            position: sticky;
            left: 0;
            z-index: 1;
        `,
    }, [
        h('div', {
            class: 'facet-heading',
        }, facet.label),
        h('select', {
            ref: selectRef,
            multiple: true,
            size: records.length,
            oninput,
            ondblclick,
            onmousedown,
        }, records.map((record, i) =>
            h('option', {
                value: recordKey(record),
            }, facet.render({...commonInput, record}))))
    ])
};

const style = `
select {
    scrollbar-width: none;
    outline: none;
    border: 0;
    overflow: hidden;
    border-radius: 0;

    font-family: monospace;
    font-size: 1rem;
    line-height: 1.8;
    padding-top: 0px;
    padding-bottom: 0px;
    box-sizing: border-box;
    user-select: none;
}

option {
    color: rgb(31, 41, 55);
    font-family: monospace;
    font-size: 1rem;
    height: calc(1.2rem);
    min-height: calc(1.2rem);
    box-sizing: border-box;
    text-align: left;
    padding-left: 0.5rem;
}

option:nth-child(even):not(:checked) {
    background-color: #f5f5f5;
}

.facet-heading {
    height: 1rem;
    font-family: Inter, sans-serif;
    font-size: 0.8rem;
    font-weight: bold;
    border-bottom: 1px solid #bbb;
    border-left: 1px solid #bbb;
    border-right: 1px solid #bbb;
    padding-left: 0.5rem;

    position: sticky;
    top: 0;
    background-color: white;
}

.facet-column {
    display flex;
    flex-direction: column;
    padding-top: 0;
    padding-bottom: 0;
    box-sizing: border-box;
    user-select: none;
    flex-grow: 1;

    position: relative;
}

.facet-cell {
    display: flex;
    align-items: center;
    justify-content: var(--facet-align, right);
    font-family: Inter, sans-serif;
    font-size 1rem;
    color: #374151;
    height: 1.2rem;
    min-height: 1.2rem;
    padding-left: 1rem;
    padding-right: 1rem;
    box-sizing: border-box;
    white-space: nowrap;
}

.facet-cell:nth-child(odd) {
    background-color: #f5f5f5;
}

.facet-cell[data-selected=true] {
    background-color: rgb(186,214,251);
}

.facet-table:focus-within .facet-cell[data-selected=true] {
    background-color: rgb(186,214,251);
}

.facet-table:not(:focus-within) .facet-cell[data-selected=true] {
    background-color: #cecece;
}

`

// simple implementation of structural equality
const eq = (a, b) => (a === b) || (JSON.stringify(a) === JSON.stringify(b))
const conservedBehavior = (prev, next) => eq(prev, next) ? prev : next
const selfQueryset = Behaviors.collect(self.fields.queryset, self.fields.queryset, conservedBehavior)
const selfKey = Behaviors.collect(self.fields.key, self.fields.key, conservedBehavior)
const selfPath = Behaviors.collect(self.fields.path, self.fields.path, conservedBehavior)

const addFilter = (criteria, event) => {
    act({
        key: 'panel-modify',
        records: [self],
        event,
        dat: {
            fields: {
                queryset: mergeRecordQuerysets(selfQueryset, {
                    "records": {view_criteria: {where: criteria}}
                }),
            },
        },
    })
}

const declareSelection = (selection) => {
    const selectionQuery = recordsToQuery(selection)
    if (eq(self.fields.selectionQuery, selectionQuery)) {
        console.warn("breaking infinite loop!!!!")
        return
    }
    console.log({
        'eq(self.fields.selectionQuery, selectionQuery)': eq(self.fields.selectionQuery, selectionQuery),
        selectionQuery,
        'self.fields.selectionQuery': self.fields.selectionQuery,
    })
    Events.send(recordsWrite, [
        {
            fields: {
                ...self.fields,
                selectionQuery,
            },
        },
    ])
    console.log("declaring selection", selection)
}

const DataColumnList = ({facetEntries, records, recordSelectionKeys}) => {
    return h(Component, null, [
        ...facetEntries.map((facet) => {
            return h('div', {
                class: 'facet-column',
                style: {
                    '--facet-align': facet.align || 'right',
                },
            }, [
                h('div', {class: 'facet-heading'}, facet.label),
                ...records.map((record, i) => {
                    return facet.filterable
                        ? h('a', {
                            class: 'facet-cell',
                            href: '#',
                            onclick: (evt) => addFilter(facet.filterable(record), evt),
                            'data-selected': recordSelectionKeys.has(recordKey(record)) ? true : undefined,
                        }, facet.render({...commonInput, record}))
                        : h('div', {
                            class: 'facet-cell',
                            'data-selected': recordSelectionKeys.has(recordKey(record)) ? true : undefined,
                        }, facet.render({...commonInput, record}));
                })
            ])
        }),
        h('div', { class: 'facet-column' }, [
            h('div', {class: 'facet-heading'}, ''),
                ...records.map((record, i) => {
                    return h('div', {
                        class: 'facet-cell',
                        'data-selected': recordSelectionKeys.has(recordKey(record)) ? true : undefined,
                    }, '');
                })
        ])
    ]);
}

// const facetForSelectionList = facets['pathFacet'];
const facetForSelectionList = facets['idFacet'];

render(
    h('div', {
        style: `
            display: flex;
            flex-direction: column;
            height: 100vh;
        `,
    }, [
        h('style', null, style),
        h('div', {
            style: `
            display: flex;
            gap: 0;
            flex-grow: 1;
            overflow: auto;
            `,
            class: 'facet-table',
        }, [
            h(SelectableList, {
                selectRef: dom => dom && Events.send(defaultElement, dom),
                records,
                facet: facetForSelectionList,
                oninput: (evt) => Events.send(recordSelectionReplace, {options: evt.target.selectedOptions}),
                onmousedown: (evt) => requestAnimationFrame(() => Events.send(recordSelectionReplace, {options: evt.target.parentElement.selectedOptions})),
                ondblclick: (evt) => Events.send(actOnRecordSelections, {verbFallbacks: ['open', 'edit', 'view', 'inspect'], event: evt}),
            }),
            h(DataColumnList, {
                records,
                facetEntries: facetEntries.filter(facet => facet !== facetForSelectionList),
                recordSelectionKeys,
            })
        ]),
    ]),
    document.body,
)
