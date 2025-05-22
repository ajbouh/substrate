// ---
// query: view: "group-by-path-max-id"
// ---
// explorer
// group these together so we can delay init until they are all loaded and available.
const {h, html, render, Component} = modules.preact
const {decodeTime} = modules.ulid
const {criteriaMatcher} = modules.recordsMatcher
const {
    mergeRecordQueries,
    mergeRecordQuerysets,
} = modules.recordsQueryMerge

const init = Events.once(modules);
((init) => {
    Events.send(ready, true);
})(init);

const sortRecords = records => records.sort((a, b) => a.fields?.path?.localeCompare(b.fields?.path))

const records = Behaviors.collect(
    undefined,
    recordsUpdated, (now, {records: {incremental, records}={}}) =>
        records
            ? sortRecords(incremental ? [...now, ...records] : records)
            : now,
);

const recordsById = Behaviors.collect(
    {map: new Map()},
    recordsUpdated, (now, {records: {incremental, records}={}}) => {
        if (!records) {
            return now
        }
        const next = incremental ? {...now} : {map: new Map()}
        for (const record of records) {
            next.map.set(record.id, record)
        }
        return next
    },
);

const facets = Behaviors.gather(/Facet$/);
const facetEntries = Object.values(facets);

const commonInput = {h, decodeTime}

const actOnRecordSelections = Events.receiver();
(({verbFallbacks, event}) => {
    const definedVerbs = new Set(verbsForRecords(recordSelections))
    const verb = verbFallbacks.find(verb => definedVerbs.has(verb))
    act({verb, records: recordSelections, event})
})(actOnRecordSelections);

const recordSelectionDelta = Events.receiver();
const recordSelectionReplace = Events.receiver();
const recordSelectionMap = Behaviors.select(
    {map: new Map()},
    recordSelectionDelta, (now, {record, selected}) => {
        const map = now.map
        selected
            ? map.set(record.id, record)
            : map.delete(record.id);
        return {map}
    },
    recordSelectionReplace, (now, {ids}) => {
        const map = new Map()
        for (const id of ids) {
            map.set(id, recordsById.map.get(id))
        }
        return {map}
    },
)
const recordSelections = [...recordSelectionMap.map.values()]
const recordSelectionIds = new Set(recordSelectionMap.map.keys())

const SelectableList = ({oninput, ondblclick, onmousedown, facet, records}) => {
    return h('div', {}, [
        h('div', {
            style: `
                height: 1em;
                border-bottom: 1px solid #bbb;
                border-right: 1px solid #bbb;
                padding-left: 0.5rem;
            `,
        }, ''),
        h('select', {
            multiple: true,
            size: records.length,
            oninput,
            ondblclick,
            onmousedown,
        }, records.map((record, i) =>
            h('option', {
                value: record.id,
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

    font-family: Inter, sans-serif;
    font-size: 1rem;
    line-height: 1.8;
    padding-top: 0px;
    padding-bottom: 0px;
    box-sizing: border-box;
    user-select: none;
}

option {
    color: rgb(31, 41, 55);
    font-family: Inter, sans-serif;
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
}

.facet-column {
    display flex;
    flex-direction: column;
    padding-top: 0;
    padding-bottom: 0;
    box-sizing: border-box;
    user-select: none;
    flex-grow: 1;
}

.facet-cell {
    display: flex;
    align-items: center;
    justify-content: right;
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

body:focus-within .facet-cell[data-selected=true] {
    background-color: rgb(186,214,251);
}

body:not(:focus-within) .facet-cell[data-selected=true] {
    background-color: #cecece;
}

`

const addFilter = (criteria) => {
    Events.send(recordsWrite, [{
        fields: {
            ...panel.fields,
            queryset: mergeRecordQuerysets(queryset, {
                "records": {basis_criteria: {where: criteria}}
            }),
        }
    }])
}

const DataColumnList = ({facetEntries, records, recordSelectionIds}) => {
    return h(Component, null, [
        ...facetEntries.map((facet) => {
            return h('div', { class: 'facet-column' }, [
                h('div', {class: 'facet-heading'}, facet.label),
                ...records.map((record, i) => {
                    return facet.filterable
                        ? h('a', {
                            class: 'facet-cell',
                            href: '#',
                            onclick: (evt) => addFilter(facet.filterable(record)),
                            'data-selected': recordSelectionIds.has(record.id) ? true : undefined,
                        }, facet.render({...commonInput, record}))
                        : h('div', {
                            class: 'facet-cell',
                            'data-selected': recordSelectionIds.has(record.id) ? true : undefined,
                        }, facet.render({...commonInput, record}));
                })
            ])
        }),
        h('div', { class: 'facet-column' }, [
            h('div', {class: 'facet-heading'}, ''),
                ...records.map((record, i) => {
                    return h('div', {
                        class: 'facet-cell',
                        'data-selected': recordSelectionIds.has(record.id) ? true : undefined,
                    }, '');
                })
        ])
    ]);
}

const facetForSelectionList = facets['pathFacet'];

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
                padding: 0.5em;
            `
        }, [
            ...(recordSelections.length > 0
                ? verbsForRecords(recordSelections).flatMap(verb => [
                    ' ',
                    h('button', {onclick: (event) => act({verb, records: recordSelections, event})}, verb)
                ])
                : []),
        ]),
        h('div', {
            style: `
            display: flex;
            gap: 0;
            flex-grow: 1;
            overflow: auto;
            `,
        }, [
            h(SelectableList, {
                records,
                facet: facetForSelectionList,
                oninput: (evt) => Events.send(recordSelectionReplace, {ids: Array.from(evt.target.selectedOptions, elt => elt.value)}),
                onmousedown: (evt) => requestAnimationFrame(() => Events.send(recordSelectionReplace, {ids: Array.from(evt.target.parentElement.selectedOptions, elt => elt.value)})),
                ondblclick: (evt) => Events.send(actOnRecordSelections, {verbFallbacks: ['open', 'edit', 'view', 'inspect'], event: evt}),
            }),
            h(DataColumnList, {
                records,
                facetEntries: facetEntries.filter(facet => facet !== facetForSelectionList),
                recordSelectionIds,
            })
        ]),
    ]),
    document.body,
)
