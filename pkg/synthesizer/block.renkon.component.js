export function component({
    key,
    debug,
    scripts,
    events,
    behaviors,
    notifiers,
    receivers,
}) {
    const encodeURIComponents = (components) => Object.entries(components).flatMap(([k, v]) => (Array.isArray(v) ? v : [v]).map(v => `${k}=${encodeURIComponent(v)}`)).join("&")
    const iframeURLParameters = {
        initjson: JSON.stringify({type: 'block-init', key}),
        emitjson: JSON.stringify({type: 'block-emit', key}),
        "Events.receiver": ["ready", ...receivers.filter(({type, nodeclare, queued}) => type === "event" && !nodeclare && !queued).map(({name}) => name)],
        "Events.queuedReceiver": receivers.filter(({type, nodeclare, queued}) => type === "event" && !nodeclare && queued).map(({name}) => name),
        "Behaviors.receiver": receivers.filter(({type, nodeclare}) => type === "behavior" && !nodeclare).map(({name}) => name),
        "output": [
            "ready",
            "focused",
            ...Object.keys(notifiers),
        ]
    }

    const eventReceivers = receivers.filter(({type}) => type === "event")
    const behaviorReceivers = receivers.filter(({type}) => type === "behavior")

    const key0 = Behaviors.keep(key)
    const iframeURL = `block.html?${encodeURIComponents(iframeURLParameters)}`;

    if (debug) {
        console.log(key0, {events});
    }
    const [
        windowMessages,
        keys,
    ] = events

    const extraEvents = events.slice(2)

    const windowMessagesEvent = Events.change(windowMessages);

    const port = Behaviors.select(
        undefined,
        windowMessagesEvent, (now, messages) => {
            let port = now
            for (const o of messages) {
                if (typeof o.data !== 'object') {
                    continue
                }
                const {data: {type, key: initKey, port: initPort}} = o;
                if (type !== 'block-init' || initKey !== key0) {
                    continue
                }
                // const portWasUndefined = port === undefined
                // port = o.ports[0]
                port = initPort
                // console.log(key, "updating port to", port, portWasUndefined ? "port was undefined" : "", o)
            }
            return port
        },
    );

    const ready = Events.select(
        undefined,
        windowMessagesEvent, (ready, messages) => {
            for (const o of messages) {
                if (typeof o.data !== 'object') {
                    continue
                }
                const {data: {type, key: emitKey, nodes}} = o;
                if (type !== 'block-emit' || emitKey !== key0) {
                    continue
                }
                
                for (const k in nodes) {
                    if (k === 'ready') {
                        ready = ready === undefined ? 1 : (ready + 1)
                    }
                    const v = nodes[k]
                    if (v) {
                        const notifier = notifiers[k]
                        if (notifier) {
                            // console.log(key, "notifying", k, v, o)
                            notifier(emitKey, v)
                        }
                    }
                }
            }

            return ready
        },
    );

    const scripts0 = Behaviors.collect(
        undefined,
        scripts, (now, scriptsUpdated) => scriptsUpdated?.[key0] ?? now);

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

    const message = Events.collect(
        {
            port: undefined,
            scripts: undefined,
            sentInitial: false,
            ready: false,
            extraBehaviors: {},
            pendingEvents: undefined,
        },
        Events.some(Events.change(port), ready, Events.change(scripts0), Events.change(behaviors), extraEventsChanged),
            (now, [portChanged, nowReady, scriptsChanged, behaviorsChanged, extraEventsChanged]) => {
                // console.log(key, {now, portChanged, nowReady, scriptsChanged, behaviorsChanged, extraEventsChanged})

                const next = {
                    ...now,
                    pendingEvents: undefined,
                }
                let pendingEvents = now.pendingEvents || {}
                let pendingBehaviors = {}
                if (nowReady) {
                    next.ready = true
                }
                if (portChanged) {
                    next.port = portChanged
                    next.ready = false
                    next.sentInitial = false
                }
                if (scriptsChanged) {
                    const {scripts, baseURI} = scriptsChanged
                    next.scripts = scripts
                    next.baseURI = baseURI
                    next.ready = false
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
                // if we're not ready then we can send scripts, baseURI
                if (!next.ready) {
                    if (!next.sentInitial && next.port && next.scripts) {
                        const initialMessage = {
                            scripts: next.scripts,
                            baseURI: next.baseURI,
                            reload: true,
                            registerEvents: next.extraBehaviors,
                        }
                        // console.log(key, "sending setup initialMessage", initialMessage)
                        next.port.postMessage(initialMessage)
                        next.sentInitial = true
                    } else {
                        // console.log(key, "NOT sending setup initialMessage", {next})
                    }
                }

                if (next.port) {
                    let message = {registerEvents: {}}

                    // if (portChanged || scriptsChanged) {
                    //     Object.assign(message.registerEvents, next.extraBehaviors)
                    // }

                    // if we're ready, include events
                    if (next.ready) {
                        Object.assign(message.registerEvents, pendingEvents)
                        pendingEvents = undefined
                        Object.assign(message.registerEvents, pendingBehaviors)
                        pendingBehaviors = undefined
                    }

                    // send our message if we have anything to say
                    if (Object.keys(message.registerEvents).length > 0) {
                        next.port.postMessage(message)
                    }
                }
                
                next.pendingEvents = pendingEvents

                return next
            },
    );

    const iframeProps = {
        key: key0,
        src: iframeURL,
    };

    return {
        iframeProps,
    }
}
