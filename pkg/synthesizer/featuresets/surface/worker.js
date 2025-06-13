// console.log("worker loaded", self.location, "at", new Date())
import {ProgramState} from "../../renkon-core.js";
// for debugging
self.ProgramState = ProgramState;

const searchParams = new URLSearchParams(self.location.search)
const behaviorsReceivers = searchParams.getAll("Behaviors.receiver")
const eventsReceivers = searchParams.getAll("Events.receiver")
const eventsQueuedReceivers = searchParams.getAll("Events.queuedReceiver")
const outputs = searchParams.getAll("output")
const emit = searchParams.get("emitjson") || `{"type": "emit"}`

const persistentScripts = [
    ...behaviorsReceivers.map(name => `const ${name} = Behaviors.receiver();`),
    ...eventsReceivers.map(name => `const ${name} = Events.receiver();`),
    ...eventsQueuedReceivers.map(name => `const ${name} = Events.receiver({queued: true});`),
    `Renkon.app.makeEmitter(${JSON.stringify(outputs)})(Events.or(${outputs.join(", ")}));`,
]

// HACK
self.window = {
    MessageChannel: globalThis.MessageChannel,
    requestAnimationFrame: f => setTimeout(f, 0),
    cancelAnimationFrame: k => clearTimeout(k),
    location: {},
}

let loadedScripts = []

const transferSymbol = Symbol("transfer")
const queuedReceivers = new Set(eventsQueuedReceivers)
const includeTransferForReceiver = (transfer, iterableValue, value) => {
    const include = v => {
        if (typeof v === 'object' && transferSymbol in v) {
            transfer.push(...v[transferSymbol])
        }
    }
    if (iterableValue) {
        for (const v of value) {
            include(v)
        }
    } else {
        include(value)
    }
}

const createProgramState = (postMessageTo) => {
    const ps = new ProgramState(0, {
        postMessageTo,
        persistentScripts,
        get loadedScripts() {
            return loadedScripts
        },
        transferSymbol,
        makeEmitter(names) {
            let previousMaxTime = 0
            return (any) => {
                const message = JSON.parse(emit)
                message.nodes = {}
                let maxTime = 0
                let transfer = []
                for (const name of names) {
                    const node = ps.resolved.get(name)
                    // console.log('in worker', {name, node})
                    if (node) {
                        maxTime = Math.max(maxTime, node.time)
                        try {
                            let iterableValue = queuedReceivers.has(name)
                            let value = node.value
                            // HACK for some reason we see sometimes see "unqueued" values. fix them before passing upwards.
                            if (iterableValue && !Array.isArray(value)) {
                                console.warn("node is queued receiver, but its value is not an array", {name, value})
                                value = [value]
                                iterableValue = true
                            }
                            message.nodes[name] = value
                            includeTransferForReceiver(transfer, iterableValue, value)
                        } catch (e) {
                            console.error(e, "error including transfer for receiver", {name, node})
                        }
                    }
                }
                // only postMessage if at least one value is new
                if (maxTime > previousMaxTime) {
                    // console.log('in worker updating maxTime', {maxTime, previousMaxTime})
                    postMessageTo.postMessage(message, {transfer})
                    previousMaxTime = maxTime
                } else {
                    // console.log('in worker, skipping post because of maxTime', {maxTime, previousMaxTime})
                }
            }
        },
        get state() {
            return ps
        },
    })
    return ps
}
const stopProgramStateEvaluator = (ps) => {
    if (ps?.evaluatorRunning) {
        self.cancelAnimationFrame(ps.evaluatorRunning)
        ps.evaluatorRunning = 0
    }
}

let ps

self.onmessage = (event) => {
    const {ports: [port]} = event
    port.onmessage = ({data: {reload, reset, baseURI, scripts, registerEvents, evaluate, inspect, startEvaluator, stopEvaluator}, ports: [inspectReplyPort]}) => {
        console.log('in worker', {reload, reset, baseURI, scripts, registerEvents, evaluate, inspect, startEvaluator, stopEvaluator})
        if ((reset || reload) && ps) {
            console.log("reset in worker...")
            stopProgramStateEvaluator(ps)
            ps.updateProgram([])
            ps.evaluate(Date.now())
            ps = undefined
        }

        if (!ps) {
            console.log("setupProgram in worker", {behaviorsReceivers, eventsReceivers, eventsQueuedReceivers, outputs, emit, persistentScripts, baseURI})
            ps = createProgramState(port)
            ps.setupProgram(persistentScripts, baseURI)
            ps.evaluate(0)
            // for debugging
            self.programState = ps
        }

        
        if (scripts) {
            console.log('in worker', {scripts})
            loadedScripts = scripts
            ps.updateProgram([...persistentScripts, ...scripts], baseURI);
            // console.log(ps)
        }

        if (registerEvents) {
            for (const k in registerEvents) {
                if (queuedReceivers.has(k)) {
                    for (const v of registerEvents[k]) {
                        ps.registerEvent(k, v);
                    }
                } else {
                    ps.registerEvent(k, registerEvents[k]);
                }
            }
        }

        if (evaluate !== undefined) {
            ps.evaluate(evaluate)
        }

        if (inspect) {
            const reply = {}
            if (inspect.sampleNodes) {
                reply.resolved = {}
                for (const name of sampleNodes) {
                    reply.resolved[name] = ps.resolved.get(name)
                }
            }
            if (inspect.findDecls) {
                reply.decls = {}
                for (const name of inspect.findDecls) {
                    reply.decls[name] = ps.findDecl(name)
                }
            }
            inspectReplyPort.postMessage(reply)
        }

        if (startEvaluator) {
            if (!ps.evaluatorRunning) {
                ps.evaluator();
            }
        }

        if (stopEvaluator) {
            stopProgramStateEvaluator(ps)
        }
    }
}
