// const windowMessages = Events.observe(notify => {
//     const listener = (evt) => notify(evt)
//     window.addEventListener("message", listener)
//     return () => window.removeEventListener("message", listener)
// }, {queued: true});

// const panelEvents = Events.some(
//     windowMessages,
//     panelBlockScriptsUpdates,
//     panelBlockRecordsUpdates,
//     panelBlockConfigUpdates,
// )

// component({
//     key,
//     style: `...`,
//     notifiers: {
//         panelWrite: (key, v) => Events.send(panelWrite, {...v, key}),
//         recordsWrite: (key, records) => Events.send(recordsWrite, records),
//     },
//     h,
//     events: panelEvents,
// }, key);


export function component(
    key,
    style,
    events,
    notifiers,
) {
    const encodeURIComponents = (components) => Object.entries(components).flatMap(([k, v]) => (Array.isArray(v) ? v : [v]).map(v => `${k}=${encodeURIComponent(v)}`)).join("&")
    const blockIframeURL = `block.html?${encodeURIComponents({
        initjson: JSON.stringify({type: 'block-init', key}),
        emitjson: JSON.stringify({type: 'block-emit', key}),
        "Events.receiver": ["ready", "recordsUpdated", "recordsWrite", "panelWrite"],
        "Events.queuedReceiver": ["close", "recordsQuery"],
        "output": ["ready", "focused", "close", "recordsQuery", "panelWrite", "recordsWrite"],
    })}`;

    const [
        windowMessages,
        blockScriptsUpdated,
        blockRecordsUpdated,
        blockConfigUpdated,
    ] = events

    // console.log(key, {events});
    // console.log(key, {windowMessages});
    // console.log(key, {blockScriptsUpdated});
    // console.log(key, {blockRecordsUpdated});
    // console.log(key, {blockConfigUpdated});

    // TODO write recordsQuery(key: Array<string>, query)
    // TODO write close(key: Array<string>) // cancels entire key prefix

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
                        ready = true
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

    const recordsChanged = Events.collect(
        undefined,
        Events.change(blockRecordsUpdated), (now, blockRecordsUpdated) => blockRecordsUpdated?.[key]);

    const scriptsChanged = Events.collect(
        undefined,
        Events.change(blockScriptsUpdated), (now, blockScriptsUpdated) => blockScriptsUpdated?.[key]);

    const message = Events.collect(
        {
            port: undefined,
            scripts: undefined,
            sentInitial: false,
            ready: false,
            records: undefined,
            pendingMessage: undefined,
        },
        Events.some(Events.change(port), ready, scriptsChanged, recordsChanged),
            (now, [portChanged, nowReady, scriptsChanged, recordsChanged]) => {
                // console.log(key, {portChanged, nowReady, scriptsChanged, recordsChanged})

                const next = {
                    ...now,
                    pendingMessage: undefined,
                }
                if (portChanged) {
                    next.port = portChanged
                }
                if (nowReady) {
                    next.ready = true
                }
                if (scriptsChanged) {
                    const {scripts, baseURI} = scriptsChanged
                    next.scripts = scripts
                    next.baseURI = baseURI
                    next.ready = false
                    next.sentInitial = false
                }
                if (recordsChanged) {
                    next.recordsUpdated = recordsChanged
                }
                // if we're not ready then we can send scripts, baseURI
                if (!next.ready) {
                    if (!next.sentInitial && next.port && next.scripts) {
                        const initialMessage = {scripts: next.scripts, baseURI: next.baseURI, reset: true}
                        // console.log(key, "sending setup initialMessage", initialMessage)
                        next.port.postMessage(initialMessage)
                        next.sentInitial = true
                    }
                }

                // either keep building up our pending message or make a new one
                const message = now.pendingMessage || {registerEvents: {}}
                let injectRecords = portChanged || scriptsChanged || recordsChanged;
                let injectConfig = portChanged || scriptsChanged;

                if (injectRecords && next.recordsUpdated) {
                    message.registerEvents.recordsUpdated = next.recordsUpdated
                }

                // send our message if we can.
                if (next.port && next.ready) {
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
        src: blockIframeURL,
    };

    return [
        iframeProps,
    ]
}
