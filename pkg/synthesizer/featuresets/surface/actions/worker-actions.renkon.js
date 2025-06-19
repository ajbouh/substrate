export function component({
    recordRead,
    recordsRead,
    withActionCueRecord,
}) {
    const raise = err => { throw err }
    const fetchText = url => fetch(url).then(response => response.ok
        ? response.text()
        : raise(new Error(`response is not ok; status="${response.status} ${response.statusText}"`)))

    function genchars(length) {
        let result = '';
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const charsLength = chars.length;
        for ( let i = 0; i < length; i++ ) {
          result += chars.charAt(Math.floor(Math.random() * charsLength));
        }
        return result;
    }
      
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const genkey = () => `${formatDate(new Date())}-${genchars(4)}`

    const parseFrontmatter = text => {
        if (!text.startsWith(';;;({\n')) {
            return {text}
        }
        const frontmatterEnd = '\n});;;\n'
        let i = text.indexOf(frontmatterEnd)

        const [_, ...frontmatterLines] = text.substring(0, i).split('\n')

        // trim trailing comma, if present, so we can use JSON.parse
        const lastFrontmatterLine = frontmatterLines[frontmatterLines.length - 1]
        if (lastFrontmatterLine.endsWith(',')) {
            frontmatterLines[frontmatterLines.length - 1] = lastFrontmatterLine.substring(0, lastFrontmatterLine.length-1)
        }

        return {
            frontmatter: JSON.parse(["{", ...frontmatterLines, "}"].join("\n")),
            text: text.substring(i + frontmatterEnd.length),
        }
    }

    const gatherScripts = (records) =>
        records.filter(({fields}) => fields.type !== "module")
        .map(async record => parseFrontmatter(await fetchText(record.data_url)))

    const discoverModulesUsedInScripts = (scripts) => [...new Set(scripts.flatMap(({frontmatter}) => frontmatter?.["moduleImports"] ?? []))]

    const debugAsyncFn = (name, f) => async (...o) => { const r = await f(...o); console.log(`${name}(`, o, `)`, '=>', r); return r }
    const resolveModuleNames = debugAsyncFn('resolveModuleNames', async (moduleNames) =>
        Object.entries(await recordsRead(
            Object.assign({},
                ...moduleNames.flatMap(moduleName => ({[moduleName]: {
                        view: "group-by-path-max-id",
                        view_criteria: {
                            where: {
                                type: [{compare: "=", value: "module"}],
                                module: [{compare: "=", value: moduleName}],
                            },
                        },
                    }}))))).flatMap(([key, [record]=[]]) => record ? [{id: record.id, key}] : []))

    const gatherModules = debugAsyncFn('gatherModules', async (scripts, records) => [
        ...await resolveModuleNames(discoverModulesUsedInScripts(scripts)),
        ...records
            .filter(({fields}) => fields.type === "module" && fields.module)
            .map(record => ({
                id: record.id,
                key: record.fields.module,
            }))
    ])

    const start = async ({records, cue}) => {
        let {fields: {redo, panel, dat: {key, path, event}={}}} = cue

        if (redo) {
            ({fields: {key, path}} = await recordRead(redo));
        }

        if (!key) {
            key = genkey()
        }

        if (!path) {
            path = `/workers/${key}`
        }

        const gatheredScripts = await Promise.all(gatherScripts(records))
        const modules = await gatherModules(gatheredScripts, records)

        const moduleScripts = modules.length
            ? [
                // calculate module import paths based on self. this helps make records machine independent...
                `const moduleImportMap = {${modules.map(({key, id}) => `${JSON.stringify(key)}: module_${key}_record_data_url,`)}}`,
                `const moduleRecordRead = (() => {
                    const noncer = (() => {
                        let nonce = 0
                        return () => nonce++
                    })()
                    const noncegen = Date.now()
                    return id => new Promise((resolve, reject) => {
                        const ns = [\`recordread-\${noncegen}-\${noncer()}\`]
                        const ch = new window.MessageChannel()
                        ch.port2.onmessage = ({data: {records: [record]}}) => {
                            resolve(record)
                        }
                        ch.port2.onmessageerror = (evt) => reject(evt)
                        Events.send(query, {
                            ns,
                            port: ch.port1,
                            queryset: {records: {global: true, basis_criteria: {where: {id: [{compare: "=", value: id}]}}}},
                            [Renkon.app.transferSymbol]: [ch.port1],
                        })
                    })
                })();`,
                ...modules.map(({id, key}) => `
                    const module_${key}_record_id = self.fields.links?.["module/${key}"]?.attributes?.["eventref:event"];
                    const module_${key}_record = moduleRecordRead(module_${key}_record_id);
                    const module_${key}_record_data_url = module_${key}_record.data_url;
                    `),
            ]
            : []

        const scripts = [
            ...gatheredScripts.map(({text}) => text),
            ...moduleScripts,
        ]

        console.log({gatheredScripts, modules, moduleScripts, scripts})

        const moduleLinks = Object.fromEntries(
            modules.map(module => [
                `module/${module.key}`,
                {
                    rel: "module",
                    attributes: {
                        "eventref:event": module.id,
                        module,
                    },
                },
            ]));

        const causeLinks = {
            "cause": {
                rel: "eventref",
                attributes: {
                    "eventref:event": cue.id,
                    "eventref:redo": true,
                },
            },
        };

        let writes = [
            {
                fields: {
                    self: ["type", "key"],
                    type: "worker",
                    key,
                    path,
                    scripts,
                    links: {
                        ...causeLinks,
                        ...moduleLinks,
                    },
                },
            }
        ]

        if (event?.shiftKey) {
            writes = withActionCueRecord(writes, {verb: 'inspect', panel, dat: {event}})
        }

        return writes
    }

    const offers = [
        {
            verb: 'start worker',
            group: 'worker',
            key: 'worker-start-from-text-data',
            criteria: {
                'schema.data.format': [{compare: "like", value: "text/%"}],
            },
            // description: '',
            act: start,
        },
        {
            verb: 'start worker',
            group: 'worker',
            key: 'worker-start-from-text',
            criteria: {
                'type': [{compare: "like", value: "text/%"}],
            },
            // description: '',
            act: start,
        },
        {
            verb: 'restart worker',
            group: 'worker',
            key: 'restart-worker',
            criteria: {
                'type': [{compare: "=", value: "worker"}],
            },
            // description: '',
            act: ({records}) => {
                return records.map(record => ({
                    fields: {
                        type: 'worker-control',
                        key: record.fields.key,
                        control: {restart: true},
                    },
                }))
            },
        },
        {
            verb: 'stop worker',
            group: 'worker',
            key: 'stop-worker',
            criteria: {
                'type': [{compare: "=", value: "worker"}],
            },
            // description: '',
            act: ({records}) => {
                return records.map(record => ({
                    fields: {
                        type: 'worker-control',
                        key: record.fields.key,
                        control: {stopEvaluator: true},
                    },
                }))
            },
        },
        {
            verb: 'start worker',
            group: 'worker',
            key: 'start-worker',
            criteria: {
                'type': [{compare: "=", value: "worker"}],
            },
            // description: '',
            act: ({records}) => {
                return records.map(record => ({
                    fields: {
                        type: 'worker-control',
                        key: record.fields.key,
                        control: {startEvaluator: true},
                    },
                }))
            },
        },
    ];

    return {
        offers,
    }
}
