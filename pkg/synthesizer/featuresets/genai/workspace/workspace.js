import {ulid} from '../../../ulid.js'

// can use this to discover all entries affected by an update
// getDependencies = a => workspace.getDependencies(a)
// all = Object.keys(workspace.#units)
const getDependants = (name, {getDependencies, all, transitive=true}={}, dependants={}) => {
    if (name in dependants) {
        return
    }
    const mine = []
    dependants[name] = mine
    for (const a of all) {
        if (getDependencies(a).includes(name)) {
            mine.push(a)
        }
    }
    if (transitive) {
        for (const a of mine) {
            getDependants(a, {getDependencies, all, transitive}, dependants)
        }
    }
    return dependants
}
// getDependencies = a => workspace.getDependencies(a)
const getDependencies = (name, {getDependencies: getDependencies0, transitive=true}={}, dependencies={}) => {
    if (name in dependencies) {
        return
    }
    const mine = getDependencies0(name)
    dependencies[name] = mine
    if (transitive) {
        for (const a of mine) {
            getDependencies(a, {getDependencies: getDependencies0, transitive}, dependencies)
        }
    }
    return dependencies
}

const metadataSymbol = Symbol("metadata")

export const Workspace = class {
    #id;
    #clones;
    #history;
    #units;

    #checkpointID;
    #checkpoints;
    #checkpointHistory;

    #tracerMap;
    #tracerNames;
    #tracers;
    #tracer;

    constructor({id, units}={}) {
        this.#id = id ?? this.#genID('wksp')
        this.#units = {}
        this.#history = []
        this.#clones = {}

        this.#checkpoints = new Map()
        this.#checkpointHistory = []

        this.unit = new Proxy({}, {
            get(_, prop) {
                return (strings, ...values) => {
                    let source = strings[0];
                    for (let i = 0; i < values.length; i++) {
                        source += values[i] + strings[i + 1];
                    }

                    return { type: String(prop), source };
                }
            }
        });

        const self = this
        this.eval = new Proxy(
            async ({unit, name}) => await self.getAttribute({unit, name, attribute: 'evaluation'}),
            {
                get(target, prop) {
                    return (strings, ...values) => {
                        let source = strings[0];
                        for (let i = 0; i < values.length; i++) {
                            source += values[i] + strings[i + 1];
                        }

                        const unit = {type: String(prop), source}
                        return target({unit})
                    }
                },
            });

        this.#initTracer()

        this.write(units)
        this.save()
    }

    #genID(kind, delim='-') {
        return `${kind}${delim}${ulid()}`
    }

    #initTracer() {
        this.#tracerMap = new Map()
        this.#tracers = []
        this.#tracerNames = []
        this.#tracer = {
            // these tracers get notified
            pending: (p) => this.#tracers.forEach(t => t.pending && t.pending(this, p)),

            // these tracers get inputs and can modify outputs
            do: (inputs) => {
                const callbacks = this.#tracers.map(t => t.do && t.do(this, inputs))
                return (result) => {
                    for (const cb of callbacks) {
                        const cbResult = cb && cb(result)
                        if (cbResult !== undefined) {
                            result = cbResult
                        }
                    }
                    return result
                }
            },

            // these tracers get start and finish
            clone: options => {
                const callbacks = this.#tracers.map(t => t.clone && t.clone(this, options))
                return (result) => callbacks.forEach(cb => cb && cb(result))
            },
            load: id => {
                const callbacks = this.#tracers.map(t => t.load && t.load(this, id))
                return (result) => callbacks.forEach(cb => cb && cb(result))
            },
            save: () => {
                const callbacks = this.#tracers.map(t => t.save && t.save(this))
                return (result) => callbacks.forEach(cb => cb && cb(result))
            },
            write: unit => {
                const callbacks = this.#tracers.map(t => t.write && t.write(this, unit))
                return (result) => callbacks.forEach(cb => cb && cb(result))
            },
            read: name => {
                const callbacks = this.#tracers.map(t => t.read && t.read(this, name))
                return (result) => callbacks.forEach(cb => cb && cb(result))
            },
            get: (options) => {
                const callbacks = this.#tracers.map(t => t.get && t.get(this, options))
                return (result) => callbacks.forEach(cb => cb && cb(result))
            },
        }
        this.log = this.#tracer.log

        // todo move these to be units in the workspace itself
        const startEvent = (arr, kind, initialProps={}) => {
            const id = this.#genID(kind)
            const evt = {id, start: Date.now(), ...initialProps}
            arr.push(evt)
            return (finishProps) => {
                const end = Date.now()
                const dur = end - evt.start
                Object.freeze(Object.assign(evt, finishProps, {dur, end}))
            }
        }

        const saveAggressively = false
        this.#addTracer('history', {
            do: saveAggressively
                ? (wksp, doInputs) => {
                    const finishEvent = startEvent(wksp.#history, 'evt', {name: 'do', do: doInputs, exante: wksp.save()})
                    wksp.#markDirty()
                    return ({returned, caught}) => { finishEvent({returned, caught, expost: wksp.save()}) }
                }
                : (wksp, doInputs) => {
                    const finishEvent = startEvent(wksp.#history, 'evt', {name: 'do', do: doInputs})
                    wksp.#markDirty()
                    return ({returned, caught}) => { finishEvent({returned, caught}) }
                },
            clone: (wksp, options) => {
                const finishEvent = startEvent(wksp.#history, 'evt', {name: 'clone', options})
                wksp.#markDirty()
                return (clone) => { finishEvent({clone, expost: wksp.save()}) }
            },
            write: (wksp, {set, del}) => {
                const finishEvent = startEvent(wksp.#history, 'evt', {name: 'write', set, del, exante: wksp.save()})
                wksp.#markDirty()
                return () => { finishEvent({expost: wksp.save()}) }
            },
        })
        this.#addTracer('checkpointHistory', {
            save: (wksp) => {
                const finishEvent = startEvent(wksp.#checkpointHistory, 'evt', {name: 'save'})
                return (id) => finishEvent({expost: id})
            },
            load: (wksp, load) => {
                const finishEvent = startEvent(wksp.#checkpointHistory, 'evt', {name: 'load', load, exante: wksp.save()})
                return () => { finishEvent({expost: wksp.#checkpointID}) }
            },
        })
    }

    #checkpoint() {
        return {
            units: Object.freeze({...this.#units}), // everything in here should already be frozen or uncloneable
            clones: Object.freeze({...this.#clones}),
            history: Object.freeze([...this.#history]),
        }
    }

    #restore(checkpoint) {
        this.#units = {...checkpoint.units}
        this.#clones = {...checkpoint.clones}
        this.#history = [...checkpoint.history]
    }

    save() {
        if (this.#isDirty()) {
            const finishTrace = this.#tracer.save()
            const checkpoint = this.#checkpoint()
            const checkpointID = this.#genID('ckpt')
            this.#checkpoints.set(checkpointID, checkpoint)
            this.#checkpointID = checkpointID
            finishTrace(checkpointID)
        }
        return this.#checkpointID
    }

    checkpointID() {
        return this.#checkpointID
    }

    #markDirty() {
        this.#checkpointID = undefined
    }

    #isDirty() {
        return this.#checkpointID === undefined
    }

    load(checkpointID) {
        const finishTrace = this.#tracer.load(checkpointID)

        const checkpoint = this.#checkpoints.get(checkpointID)
        this.#restore(checkpoint)
        this.#checkpointID = checkpointID
        finishTrace()
    }

    become(cloneID) {
        const clone = this.#clones.get(cloneID)
        const checkpointID = clone.save()
        const checkpoint = otherWorkspace.#checkpoints.get(checkpointID)
        this.#checkpoints.set(checkpointID, checkpoint)
        this.load(checkpointID)
        return checkpointID
    }

    
    async #addTracer(name, tracer) {
        this.#tracerNames = [name, ...this.#tracerNames]
        this.#tracerMap.set(name, tracer)
        this.#tracers = this.#tracerNames.map(id => this.#tracerMap.get(id))

        return () => {
            this.#tracerNames = this.#tracerNames.filter(id => id !== name)
            this.#tracerMap.delete(name)
            this.#tracers = this.#tracerNames.map(id => this.#tracerMap.get(id))
        }
    }

    addTracer({unit, name}) {
        if (!name) {
            name = this.#genID('tracer')
        }
        if (unit.evaluation) {
            return this.#addTracer(name, unit.evaluation)
        }
        return this.getAttribute({unit, name, attribute: 'evaluation'}).then(tracer => this.#addTracer(name, tracer))
    }

    async useTracerDuring(tracer, fn) {
        const removeTracer = await this.addTracer(tracer)
        try {
            return await fn()
        } finally {
            removeTracer()
        }
    }

    get [metadataSymbol]() {
        const {source, ...m} = this.read('workspace')
        return m
    }

    write(units) {
        const set = {}
        let del
        for (const name in units) {
            let unit = units[name]
            if (unit === undefined) {
                if (!del) {
                    del = []
                }
                del.push(name)
                continue
            }

            // ensure the unit is cloneable. we currently skip evaluation because of window.fetch. but we should do the opposite
            let {evaluation, ...attributes} = unit
            unit = structuredClone(attributes)
            if (evaluation !== undefined) {
                unit.evaluation = evaluation
            }

            set[name] = Object.freeze(unit)
        }
        Object.freeze(set)
        
        const traceOptions = {set}
        if (del) {
            Object.freeze(del)
            traceOptions.del
        }
        const traceFinish = this.#tracer.write(traceOptions)
        Object.assign(this.#units, set)
        if (del) {
            for (const name of del) {
                delete this.#units[name]
            }
        }
        traceFinish()
    }

    read(name) {
        const traceFinish = this.#tracer.read(name)
        const source = this.#units[name]
        if (!source) {
            throw new Error(`unknown name: ${name}`)
        }
        traceFinish(source)
        return source
    }

    getMetadata(unit) {
        return unit[metadataSymbol]
    }

    setMetadata(unit, metadata) {
        // should this be traced?
        unit[metadataSymbol] = metadata
    }

    list() {
        return Object.keys(this.#units)
    }

    has(name) {
        return name in this.#units
    }

    get id() {
        return this.#id
    }

    async get(name, attribute='evaluation') {
        return this.getAttribute({attribute, name})
    }

    async getAttribute(options) {
        const traceFinish = this.#tracer.get(options)
        let {unit, attribute, name} = options
        if (!unit) {
            if (this.has(name)) {
                unit = this.read(name)
            }
        }

        if (!attribute) {
            traceFinish(unit)
            return unit
        }

        let value = unit?.[attribute]
        if (value === undefined) {
            value = await this.do({action: 'get', unit, name, inputs: {attribute, inputs: options.inputs}})
        }

        traceFinish(value)
        return value
    }

    async do({action, unit, name, inputs}) {
        if (!unit) {
            if (this.has(name)) {
                unit = this.read(name)
            }
        }

        const doInputs = {action, name, unit, inputs, workspace: this}
        const traceFinish = this.#tracer.do(doInputs)
        const p = (async () => {
            // a unit can delegate a specific action to another unit
            const doerName = unit?.do?.[action] ?? 'workspace/do'
            const doer = await this.get(doerName)
            let returned, caught
            try {
                returned = await doer(doInputs)
            } catch (err) {
                caught = err
            }
            traceFinish({returned, caught})
            if (caught) {
                throw caught
            }
            return returned
        })()
        p.do = doInputs // for debugging
        this.#tracer.pending(p)
        return await p
    }

    async spawn() {
        let options
        if (this.has('workspace/spawn/defaults')) {
            options = await this.get('workspace/spawn/defaults')
        }
        return this.clone()
    }

    clone({copy={}, set={}, load, checkpointIDs=[]}={}) {
        if (!load) {
            load = this.save()
        }

        copy = Object.freeze(structuredClone(copy))
        set = Object.freeze(structuredClone(set))
        checkpointIDs = Object.freeze(structuredClone(checkpointIDs))
        if (typeof load !== 'string') {
            throw new Error('load must be a string checkpointID')
        }
        const cloneID = this.#genID('wksp')
        const cloned = new this.constructor({id: cloneID})
        const copyCheckpoint = checkpointID => {
            const checkpoint = this.#checkpoints.get(checkpointID)
            if (!checkpoint) {
                throw new Error(`unknown checkpoint ${checkpointID}`)
            }
            if (cloned.#checkpoints.has(checkpointID)) {
                throw new Error(`cloned workspace already has checkpoint ${checkpointID}`)
            }
            cloned.#checkpoints.set(checkpointID, checkpoint)
        }

        for (const checkpointID of checkpointIDs) {
            copyCheckpoint(checkpointID)
        }
        if (!checkpointIDs.includes(load)) {
            copyCheckpoint(load)
        }
        cloned.load(load)

        const units = {}
        if (copy) {
            for (const [dst, src] of Object.entries(copy)) {
                units[dst] = this.read(src)
            }
        }
        if (set) {
            for (const [dst, value] of Object.entries(set)) {
                units[dst] = value
            }
        }
        cloned.write(units)
        cloned.save()

        const traceFinish = this.#tracer.clone({copy, set, load, checkpointIDs})
        const id = this.#genID('clone')
        this.#clones[id] = cloned
        traceFinish(id)
        return cloned
    }
}
