export function component({
    key,
    style,
    scripts,
    events,
    notifiers,
    defineExtraEvents,
    eventsReceivers,
    eventsReceiversQueued,
}) {
    const encodeURIComponents = (components) => Object.entries(components).flatMap(([k, v]) => (Array.isArray(v) ? v : [v]).map(v => `${k}=${encodeURIComponent(v)}`)).join("&")
    const iframeURLParameters = {
        initjson: JSON.stringify({type: 'block-init', key}),
        emitjson: JSON.stringify({type: 'block-emit', key}),
        "Events.receiver": ["ready", ...eventsReceivers],
        "Events.queuedReceiver": [...eventsReceiversQueued],
        "output": [
            "ready",
            ...Object.keys(notifiers),
        ]
    }
    // console.log(key, {iframeURLParameters});
    const iframeURL = `block.html?${encodeURIComponents(iframeURLParameters)}`;

    // console.log(key, {events});
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
                if (type !== 'block-init' || initKey !== key) {
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
                if (type !== 'block-emit' || emitKey !== key) {
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
        scripts, (now, scriptsUpdated) => scriptsUpdated?.[key] ?? now);

    const extraEventsChanged = Events.collect(
        [],
        Events.change(extraEvents), (now, extraEvents) => {
            let deltas = 0
            const next = extraEvents
                .map((v, i) => defineExtraEvents[i]?.keyed ? v?.[key] : v)
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
            extraEvents: {},
            pendingMessage: undefined,
        },
        Events.some(Events.change(port), ready, Events.change(scripts0), extraEventsChanged),
            (now, [portChanged, nowReady, scriptsChanged, extraEventsChanged]) => {
                // console.log(key, {now, portChanged, nowReady, scriptsChanged, extraEventsChanged})
                const next = {
                    ...now,
                    pendingMessage: undefined,
                }
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
                        if (v !== undefined) {
                            next.extraEvents[defineExtraEvents[i].name] = v
                        }
                    })
                }
                // if we're not ready then we can send scripts, baseURI
                if (!next.ready) {
                    if (!next.sentInitial && next.port && next.scripts) {
                        const initialMessage = {scripts: next.scripts, baseURI: next.baseURI, reload: true}
                        // console.log(key, "sending setup initialMessage", initialMessage)
                        next.port.postMessage(initialMessage)
                        next.sentInitial = true
                    } else {
                        // console.log(key, "NOT sending setup initialMessage", {next})
                    }
                }

                // either keep building up our pending message or make a new one
                const message = now.pendingMessage || {registerEvents: {}}
                let injectedEventKeys
                if (portChanged || scriptsChanged) {
                    injectedEventKeys = Object.keys(next.extraEvents)
                } else {
                    injectedEventKeys = extraEventsChanged.flatMap((v, i) => v !== undefined ? [defineExtraEvents[i].name] : [])
                }
                // console.log(key, {injectedEventKeys})

                for (const key of injectedEventKeys) {
                    message.registerEvents[key] = next.extraEvents[key]
                }

                // send our message if we can.
                if (next.port && next.ready && Object.keys(message.registerEvents).length > 0) {
                    // console.log(key, "sending message", message)
                    next.port.postMessage(message)
                } else {
                    // console.log(key, "delaying message", message)
                    next.pendingMessage = message
                }

                return next
            },
    );

    const iframeProps = {
        key,
        style,
        src: iframeURL,
    };

    // console.log(key, {iframeProps})

    return {
        iframeProps,
    }
}
