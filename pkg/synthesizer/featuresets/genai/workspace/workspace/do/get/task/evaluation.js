// a viewer is a way to generate short, fixed-length views of long, variable length outputs

// todo have the viewer know its own id
// have the viewer start with an overview of what it is viewing
// have the viewer include methods that can be called on it

// ```viewer
// id:      session.views[4]
// type:    text/plain
// source:  session.views[3].search({regexp: /asdfasd/})
// summary:      1,250 pages (4KB per page)
// content: (page 1 of 1250)
//   [INFO] Server starting up...
//   [INFO] Connecting to database...
//   ...
// actions:
//     - .goto({page})
//     - .search({regexp})
//     - .help()
// ```

// todo need to save each task as an entry in a global session object
// session.tasks[3].views.logs
// or session.views[4]

// a viewer can have different values nested inside
// json object with html in it
// json object with markdown in it
// markdown string with json codefence

const TextView = class { 
    constructor({id, source, content, type, pageSize = 4096, page = 1}) {
        this.id = id
        this.source = source;
        this.content = content;
        this.type = type
        this.pageSize = pageSize;
        this.page = page;
    }

    withID({id}) {
        return new this.constructor({
            id: id,
            source: source,
            content: content,
            type: type,
            pageSize: pageSize,
            page: page,
        })
    }

    getPage({pageNumber}) {
        const totalPages = Math.ceil(this.content.length / this.pageSize);
        if (pageNumber < 1 || pageNumber > totalPages) {
            return new this.constructor({source: 'Error', content: 'Page not found.', page: 1 });
        }
        const newSource = `${this.id}.getPage({pageNumber: ${pageNumber}})`;
        return new this.constructor({source: newSource, content: this.content, pageSize: this.pageSize, page: pageNumber });
    }

    render() {
        const totalPages = Math.ceil(this.content.length / this.pageSize);

        const summary = `page ${this.page} of ${totalPages}`;
        const startChar = (this.page - 1) * this.pageSize;
        const endChar = startChar + this.pageSize;
        let pageContent = this.content.substring(startChar, endChar);
        if (this.content.length !== endChar && this.content[endChar] !== '\n' && this.content[endChar-1] !== '\n') {
            pageContent += '...'
        }
        
        const lineCount = s => s.split('\n').length
        const totalLines = lineCount(this.content);
        let currentLineNum = lineCount(this.content.substring(0, startChar));        
        const lineNumPadding = totalLines.toString().length;
        const viewportString = pageContent.split('\n').map(line => {
            const lineNumber = (currentLineNum++).toString().padStart(lineNumPadding, ' ');
            return `  ${lineNumber} | ${line}`;
        }).join('\n');

        return [
            this.id &&
                `id:       ${this.id}`,
            this.type &&
                `type:     ${this.type}`,
            this.source &&
                `source:   ${this.source}`,
            `summary:  ${summary}`,
            `content:`,
            viewportString,
            `actions:
  - \`${this.id}.getPage({pageNumber:})\` to go to a particular page
  - \`${this.id}.content\` to get a string of the full content`,
        ].filter(_ => _).join("\n")
    }
}

export default async ({unit: {source: content}, workspace}) => {
    const logs = []
    const pending = []
    const nameSymbol = Symbol("name")
    const tracer = {
        log(...msgs) {
            const entry = msgs.every(msg => typeof msg === 'string') ? msgs.join("\n") : JSON.stringify(msgs)
            logs.push(entry)
        },
        pending(p) {
            pending.push(p)
        },
        run(inputs) {
            return ({caught, returned}) => {
                if (caught) {
                    this.log(`<Error> ${caught.name}: ${caught.message}`)
                }
                // origConsoleLog('run', inputs.code, {inputs, caught, returned})
                if (returned && inputs.name && typeof returned === 'function') {
                    return {
                        caught,
                        returned: (...o) => {
                            // origConsoleLog("running trapped", inputs.name, returned)
                            try {
                                const result = returned(...o)
                                if (!(result instanceof Promise)) {
                                    return result
                                }
                                const p = result.then(res => res, rej => {
                                    if (Object.isExtensible(rej)) {
                                        rej[nameSymbol] = inputs.name
                                    }
                                    throw rej
                                })
                                this.pending(p)
                                return p
                            } catch (e) {
                                if (Object.isExtensible(e)) {
                                    e[nameSymbol] = inputs.name
                                }
                                throw e
                            }
                        },
                    }
                }
            }
        },
    }

    return await workspace.useTracerDuring({unit: {evaluation: tracer}}, async () => {
        let views
        const newView = async ({source, content, type, pageSize}) => {
            if (views) {
                views = workspace.has('views') ? await workspace.get('views') : []
            }
            const viewIx = views.length
            const view = new TextView({source, id: `views[${viewIx}]`, content, type, pageSize})
            views = [...views, view]
            console.log('setting views on workspace', {workspace, views, view})
            return {info: 'page-viewer', code: view.render()}
        }

        const pageSize = 4096
        const textOrView = async ({content, type, maxLength=pageSize}) => {
            const info = type === 'application/json' ? 'json' : ''
            if (content.length + info.length + 9 <= maxLength) {
                return {info, code: content}
            }
            return await newView({content, type, pageSize})
        }

        const task = JSON.parse(content)
        task.ok = false

        let errorSection = 'Error'
        try {
            // is it good to write task directly into the workspace? would it be better to layer it in just for this run somehow?
            const units = {
                'task': {evaluation: task}
            }
            if (views) {
                units['views'] = {evaluation: views}
            }
            workspace.write(units)
            const returned = await workspace.eval[task.lang ?? 'javascript']([task.code])
            console.log({returned, logs})
            if (logs.length) {
                task.sections["Logs"] = await newView({
                    content: logs.join("\n"),
                    type: 'text/plain',
                })
            }

            if (returned !== undefined) {
                errorSection = 'Output Error'
                task.sections['Outputs'] = await textOrView({
                    content: JSON.stringify(returned),
                    type: 'application/json',
                })
            } else if (!logs.length) {
                task.sections['Success'] = {info: "json", code: "true"}
            }

            console.log({pending})
            const uncaught = (await Promise.allSettled(pending)).filter(r => r.status === 'rejected').map(r => r.reason)
            console.log({uncaught})
            if (uncaught.length) {
                task.sections['Uncaught Error'] = await newView({
                    content: uncaught.map(err => `Uncaught (in promise) ${err.name}: ${err.message}`).join("\n"),
                    type: 'text/plain',
                })
            } else {
                task.ok = true
            }
        } catch (caught) {
            console.log({caught})
            task.sections[errorSection] = `${caught.name}: ${caught.message}`

            const advice = []
            if (caught.name === 'ReferenceError') {
                advice.push(
                    `// available globals are: ${workspace.getGlobals().join(", ")}`,
                    `// use help(nameOfGlobal) to see its documentation`
                )
            } else {
                // if we see that an error came from a unit with a particular name, generate an advice section
                const caughtAlias = caught[nameSymbol]
                if (caughtAlias) {
                    advice.push(
                        `// see documentation for ${caughtAlias} by running`,
                        `help(${caughtAlias})`,
                    )
                }
            }
            if (advice.length) {
                task.sections['Advice'] = {info: 'javascript', code: advice.join("\n")}
            }
        }

        return task
    })
}
