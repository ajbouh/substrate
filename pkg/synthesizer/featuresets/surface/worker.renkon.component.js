export function component({
    key,
    debug,
    scripts,
    events,
    behaviors,
    notifiers,
    receivers,

    onWorkerMessage,
}) {
    const receivers0 = Behaviors.keep(receivers)
    const notifiers0 = Behaviors.keep(notifiers)
    const encodeURIComponents = Behaviors.keep((components) => Object.entries(components).flatMap(([k, v]) => (Array.isArray(v) ? v : [v]).map(v => `${k}=${encodeURIComponent(v)}`)).join("&"))
    const urlParameters = Behaviors.keep({
        emitjson: JSON.stringify({type: 'worker-emit', key}),
        "Events.receiver": receivers0.filter(({type, nodeclare, queued}) => type === "event" && !nodeclare && !queued).map(({name}) => name),
        "Events.queuedReceiver": receivers0.filter(({type, nodeclare, queued}) => type === "event" && !nodeclare && queued).map(({name}) => name),
        "Behaviors.receiver": receivers0.filter(({type, nodeclare}) => type === "behavior" && !nodeclare).map(({name}) => name),
        "output": Object.keys(notifiers0),
    })

    const eventReceivers = receivers0.filter(({type}) => type === "event")
    const behaviorReceivers = receivers0.filter(({type}) => type === "behavior")

    const debug0 = Behaviors.keep(debug)
    const key0 = Behaviors.keep(key)
    const behaviors0 = Behaviors.keep(behaviors)
    const scripts0 = Behaviors.collect(
        undefined,
        scripts, (now, scriptsUpdated) => scriptsUpdated?.[key] ?? now);
    const workerURL = Behaviors.keep(`./featuresets/surface/worker.js?${encodeURIComponents(urlParameters)}`);
    const onWorkerMessage0 = Behaviors.keep(onWorkerMessage)

    const workerAndPort = Behaviors.keep(((workerURL, onWorkerMessage0) => {
        const channel = new window.MessageChannel()
        const port = channel.port1
        port.onmessageerror = message => {
            console.error(key0, "port.onmessageerror", message)
        }
        port.onmessage = message => {
            debug0 && console.log(key0, "port.onmessage", message)
            onWorkerMessage0(key0, message)
        }
        const worker = new window.Worker(workerURL, {type: 'module'})
        worker.onerror = (ev) => console.error(key0, ev)
        debug0 && console.log(key0, "creating worker", workerURL, worker, port)
        worker.postMessage({data: {}}, {transfer: [channel.port2]});
        return {worker, port}
    })(workerURL, onWorkerMessage0));

    const {worker, port} = workerAndPort

    debug0 && console.log(key, {notifiers0});
    debug0 && console.log(key, {worker});
    debug0 && console.log(key, {port});
    debug0 && console.log(key, {events});

    const messagesEvents = events[0]
    const myMessagesEvents = messagesEvents.map(event => event[key])
    const controlRecordEvents = events[1]
    const myControlRecordEvents = Events.collect(
        undefined,
        controlRecordEvents, (prev, events) => {
            const max = (prev || []).reduce((acc, event) => acc && (acc > event.id) ? acc : event.id, '0')
            const mine = events.map(event => event[key]).filter(event => event && event.id > max)
            return mine.length ? mine : undefined
        });
    const extraEvents = events.slice(3)

    debug0 && console.log(key, {events})
    debug0 && console.log(key, {messagesEvents})
    debug0 && console.log(key, {myMessagesEvents})
    debug0 && console.log(key, {controlRecordEvents})
    debug0 && console.log(key, {myControlRecordEvents})

    const notifications = Events.select(
        undefined,
        myMessagesEvents, (_, messages) => {
            for (const o of messages) {
                if (!o || typeof o.data !== 'object') {
                    continue
                }
                const {data: {type, key: emitKey, nodes}} = o;
                if (type !== 'worker-emit' || emitKey !== key) {
                    continue
                }
                
                for (const k in nodes) {
                    const v = nodes[k]
                    if (v) {
                        const notifier = notifiers0[k]
                        if (notifier) {
                            debug0 && console.log(key, "notifying", k, v, o)
                            notifier(emitKey, v)
                        }
                    }
                }
            }
        },
    );

    // this seems like it will dedupe events when it shouldn't. switch to something that won't do that.
    const extraEventsChanged = Events.collect(
        [],
        Events.change(extraEvents), (now, extraEvents) => {
            let deltas = 0
            const next = extraEvents
                .map((v, i) => eventReceivers[i]?.keyed ? v?.[key0] : v)
                .map((v, i) => now[i] === v ? undefined : (deltas++, v));
            return deltas > 0 ? next : now
        },
    );
    // console.log(key, {extraEventsChanged})        

    const pump = Behaviors.collect(
        {
            port,
            scripts: undefined,
            sentInitial: false,
            extraBehaviors: {},
            pendingEvents: undefined,
            pendingControlEvents: undefined,
        },
        Events.some(Events.change(scripts0), Events.change(behaviors0), extraEventsChanged, myControlRecordEvents),
            (now, [scriptsChanged, behaviorsChanged, extraEventsChanged, controlEvents]) => {
                debug0 && console.log(key, {now, scriptsChanged, extraEventsChanged, controlEvents})

                const next = {
                    ...now,
                    pendingEvents: undefined,
                }
                let pendingEvents = now.pendingEvents || {}
                let pendingBehaviors = {}
                if (scriptsChanged) {
                    const {scripts, baseURI} = scriptsChanged
                    next.scripts = scripts
                    next.baseURI = baseURI
                    next.sentInitial = false
                }
                if (extraEventsChanged) {
                    extraEventsChanged.forEach((v, i) => {
                        if (v === undefined) {
                            return
                        }
                        const receiver = eventReceivers[i]
                        const name = receiver.name
                        pendingEvents[name] = receiver.queued
                            ? (pendingEvents[name] || []).push(v)
                            : v;
                    })
                }
                if (behaviorsChanged) {
                    for (const receiver of behaviorReceivers) {
                        const name = receiver.name
                        const v = receiver.keyed ? behaviorsChanged[name]?.[key0] : behaviorsChanged[name]
                        if (v !== undefined) {
                            if (next.extraBehaviors[name] !== v) {
                                next.extraBehaviors[name] = v
                                pendingBehaviors[name] = v
                            }
                        }
                    }
                }

                if (!next.sentInitial && next.scripts) {
                    const initialMessage = {
                        scripts: next.scripts,
                        baseURI: next.baseURI,
                        reset: true,
                        startEvaluator: true,
                        registerEvents: {
                            ...next.extraBehaviors,
                            ...pendingEvents,
                        }
                    }
                    pendingEvents = undefined
                    debug0 && console.log(key, "sending setup initialMessage", initialMessage)
                    next.port.postMessage(initialMessage)
                    next.sentInitial = true
                } else if (next.sentInitial) {
                    debug0 && console.log(key, "NOT sending setup initialMessage", {next})

                    let message = {
                        registerEvents: {
                            ...pendingEvents,
                            ...pendingBehaviors,
                        },
                    }

                    pendingEvents = undefined
                    pendingBehaviors = undefined

                    // send our message if we have anything to say
                    if (Object.keys(message.registerEvents).length > 0) {
                        debug0 && console.log(key, "sending message", message)
                        next.port.postMessage(message)
                    }
                }
                
                next.pendingEvents = pendingEvents

                if (next.port) {
                    for (const event of [...(next.pendingControlEvents || []), ...(controlEvents || [])]) {
                        next.port.postMessage({
                            evaluate: event.fields.control?.evaluate,
                            // inspect: event.fields.control?.inspect,
                            startEvaluator: event.fields.control?.startEvaluator,
                            stopEvaluator: event.fields.control?.stopEvaluator,
                            ...(event.fields.control?.restart
                                ? {
                                    scripts: next.scripts,
                                    baseURI: next.baseURI,
                                    reset: true,
                                    startEvaluator: true,
                                    registerEvents: {
                                        ...next.extraBehaviors,
                                    },
                                }
                                : {}),
                            ...next.extraBehaviors,
                        })
                    }
                    next.pendingControlEvents = undefined
                } else if (controlEvents) {
                    next.pendingControlEvents = [...(next.pendingControlEvents || []), ...(controlEvents || [])]
                }

                return next
            },
    );

    const sentInitial = pump.sentInitial

    return {
        key,
        worker,
        sentInitial,
    }
}
