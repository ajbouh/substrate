import { parseImportExportStatements } from "./importexport.js"

const bundleComponent = async (source) => {
    const {imports, exports} = parseImportExportStatements(source)
    const renkonInputImports = imports.filter(({source}) => source.startsWith("renkon:"));
    const otherImports = imports.filter(({source}) => !source.startsWith("renkon:"));
    renkonInputImports.forEach(({source, specifiers}) => specifiers.forEach(specifier => {
        if (specifier.importedName !== specifier.localName) {
            throw new Error(`import aliases not allowed for source "${source}"`)
        }
    }));
    const renkonOutputExports = exports
    renkonOutputExports.forEach(({specifiers}) => specifiers.forEach(specifier => {
        if (specifier.exportedName !== specifier.localName) {
            throw new Error(`export aliases not allowed`)
        }
    }));

    const renkonInputs = renkonInputImports.flatMap(({specifiers}) => specifiers.map(specifier => specifier.importedName))
    const renkonInputTypesByImportSource = {
        "renkon:inputs:behaviors": "Behavior",
        "renkon:inputs:events": "Event",
    }
    const types = Object.fromEntries(renkonInputImports.flatMap(({source, specifiers}) => specifiers.map(specifier => [specifier.importedName, renkonInputTypesByImportSource[source]])))

    const renkonOutputs = renkonOutputExports.flatMap(({specifiers}) => specifiers.map(specifier => specifier.exportedName))

    if (otherImports.length) {
        renkonInputs.push("importmap")
        types["importmap"] = "Behavior"
    }

    const spansToReplace = [
        ...renkonInputImports.map(({span}) => ({...span, sub: ''})), // remove the entire import
        ...otherImports.map(({span, source, specifiers}) => { // rewrite the import as a destructuring assignment.
            const destructured = specifiers.map(({localName, importedName}) => `${importedName}: ${localName}`).join(", ")
            return {
                ...span,
                sub: `const {${destructured}} = import(importmap[${JSON.stringify(source)}])`}
        }),
        ...renkonOutputExports.map(({span, specifiers}) => { // remove entire exports without specifiers or just up to the first specifier
            if (!specifiers) {
                return {...span, sub: ''}
            }
            return {
                start: span.start,
                end: Math.min(specifiers.map(({span: specifierSpan}) => specifierSpan?.start ?? span.end)),
                sub: '',
            }
        }), 
    ]

    spansToReplace.sort((a, b) => b.end - a.end)

    source = spansToReplace.reduce(
        (acc, {start, sub, end}) =>`${acc.substring(0, start)}${sub}${acc.substring(end)}`,
        source)

    source = `function component({${renkonInputs.join(",")}}, _types=${JSON.stringify(types)}) {
${source.trim()}
return {${renkonOutputs.join(",")}};
}`
    return {
        output: source,
        renkonInputs,
        renkonOutputs,
        imports: otherImports,
    }
}

const testCases = [
    {
        name: 'combined inputs',
        input: `import {x, y} from "renkon:inputs:behaviors"`,
        output: `function component({x,y}, _types={"x":"Behavior","y":"Behavior"}) {

return {};
}`,
        renkonInputs: ["x", "y"],
        renkonOutputs: [],
    },
    {
        name: 'no inputs are ok',
        input: `
            import z from "otherimport"
        `,
        renkonInputs: ["importmap"],
        renkonOutputs: [],
    },
    {
        name: 'inputs ignore other imports',
        input: `
            import {x, y} from "renkon:inputs:behaviors"
            import z from "otherimport"
        `,
        renkonInputs: ["x", "y", "importmap"],
        renkonOutputs: [],
    },
    {
        name: 'same name alias ok',
        input: `import {x as x} from "renkon:inputs:behaviors"`,
        output: `function component({x}, _types={"x":"Behavior"}) {

return {};
}`,
        renkonInputs: ["x"],
        renkonOutputs: [],
    },
    {
        name: 'other imports work',
        input: `
            import {z as y} from "otherimport"
        `,
        output: `function component({importmap}, _types={"importmap":"Behavior"}) {
const {z: y} = import(importmap["otherimport"])
return {};
}`,
        renkonInputs: ["importmap"],
        renkonOutputs: [],
    },
    {
        name: 'alias ok for other imports',
        input: `
            import {x} from "renkon:inputs:behaviors"
            import {z as y} from "otherimport"
        `,
        output: `function component({x,importmap}, _types={"x":"Behavior","importmap":"Behavior"}) {
const {z: y} = import(importmap["otherimport"])
return {};
}`,
        renkonInputs: ["x", "importmap"],
        renkonOutputs: [],
    },
    {
        name: 'separate inputs',
        input: `
            import {x} from "renkon:inputs:behaviors"
            import {y} from "renkon:inputs:behaviors"
        `,
        output: `function component({x,y}, _types={"x":"Behavior","y":"Behavior"}) {

return {};
}`,
        renkonInputs: ["x", "y"],
        renkonOutputs: [],
    },
    {
        name: 'inputs can be behaviors and events',
        input: `
            import {x} from "renkon:inputs:behaviors"
            import {y} from "renkon:inputs:events"
        `,
        output: `function component({x,y}, _types={"x":"Behavior","y":"Event"}) {

return {};
}`,
        renkonInputs: ["x", "y"],
        renkonOutputs: [],
    },
    {
        name: 'no aliases allowed',
        input: `
        import {x as y} from "renkon:inputs:behaviors"
        `,
        error: "import aliases not allowed"
    },
    {
        name: 'exports as outputs',
        input: `
export const z = 1;
const w = 3;
export {w as w};
const x = 2;
export {x};
        `,
        output: `function component({}, _types={}) {
const z = 1;
const w = 3;

const x = 2;
return {z,w,x};
}`,
        renkonInputs: [],
        renkonOutputs: ["z", "w", "x"],
    },
    {
        name: 'exports as output do not allow aliases',
        input: `
            const x = 2;
            export {x as y};
        `,
        error: "export aliases not allowed"
    },
]

const jsonEq = (a, b) => JSON.stringify(a) === JSON.stringify(b)

export const test = async t => {
    for (const tc of testCases) {
        await t.run(tc.name, async t => {
            try {
                const x = await bundleComponent(tc.input)
                t.assert(jsonEq(tc.renkonInputs, x.renkonInputs), "renkon inputs should match", "want", tc.renkonInputs, "!=", "got", x.renkonInputs)
                // intentionally broken so we can show debug features of testing library
                t.assert(!jsonEq(tc.renkonOutputs, x.renkonOutputs), "renkon outputs should match", "want", tc.renkonOutputs, "!=", "got", x.renkonOutputs)
                if (tc.output) {
                    t.assert(jsonEq(tc.output, x.output), "output should match", "want", tc.output, "!=", "got", x.output)
                }
            } catch (e) {
                if (!tc.error) {
                    throw e
                }
                t.assert(e.message.includes(tc.error), "expected error", e, "to include", tc.error)
            }
        })
    }
}
