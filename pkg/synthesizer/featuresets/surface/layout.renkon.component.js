export function component({
    act0,
    cuePanelAction0,
    preact0,
    layout0,
    panelMap0,
    panelKeys0,
    panelIframeProps0,
    blockDefs0,
}) {
    // HACK these all work around the fact that components don't keep inputs
    const layout = Behaviors.keep(layout0)
    const blockDefs = Behaviors.keep(blockDefs0)
    const panelIframeProps = Behaviors.keep(panelIframeProps0)
    const panelKeys = Behaviors.keep(panelKeys0)
    const panelMap = Behaviors.keep(panelMap0)
    const act = Behaviors.keep(act0)
    const cuePanelAction = Behaviors.keep(cuePanelAction0)
    const preact = Behaviors.keep(preact0)

    const {h, html, render: preactRender} = preact

    const renderOptions = Behaviors.keep((values, options) =>
        options.map((option) => option.options
            ? h('optgroup', {label: option.label}, renderOptions(values, option.options))
            : (
                values.push(option.value),
                h('option', {
                    key: values.length-1,
                    value: values.length-1,
                    selected: option.selected,
                    disabled: option.disabled,
                }, option.label)
            )));
    
    const select = Behaviors.keep((notifier, options, props={}) => {
        const values = []
        const vdom = h(
            'select',
            {
                onchange: evt => notifier(values[+evt.target.value], evt),
                ...props,
            },
            renderOptions(values, options),
        )
        return vdom
    });
    const textinput = Behaviors.keep((initial, notifier, props={}) => h('input',
        {
            type: 'text',
            ref: (dom) => {
                if (!dom) {
                    return
                }
                dom.value = initial ?? ''
            },
            onkeydown: (evt) => {
                if (evt.key === "Enter") {
                    evt.preventDefault();
                    evt.stopPropagation();
                    notifier(evt.target.value), evt;
                }
                if (evt.key === "Escape") {
                    evt.preventDefault();
                    evt.stopPropagation();
                    evt.target.value = initial ?? ''
                }
            },
            ...props,
        },
    ));
    const button = Behaviors.keep((notifier, text, props={}) => h(
        'button',
        {
            type: 'text',
            onclick: evt => notifier(evt),
            ...props,
        },
        text,
    ));

    const panelControls = Behaviors.keep(({key, panel, recordQuerySet, blockType}) => {
        return h('div', {
            style: {
                padding: "0.25em",
                fontFamily: 'system-ui',
                fontSize: '0.8rem',
            },
        }, [
            h('div', {}, [
                h('div', {
                    style: {
                        flexGrow: '1',
                        position: 'relative',
                    },
                }, blockDefs[blockType]?.fields?.queryset !== null
                    ? [
                        textinput(
                            JSON.stringify(recordQuerySet),
                            (value, evt) => cuePanelAction({panelTarget: key, panelSender: {key, id: panel.id}, actionKey: 'panel-modify', panelFields: {queryset: JSON.parse(value)}, inputEvent: evt}),
                            {style: {
                                paddingTop: '0.2em',
                                paddingBottom: '0.25em',
                                // paddingRight: '1.8em',
                                width: '-webkit-fill-available',
                            }},
                        ),
                    ]
                    : '',
                ),
                h('div', {
                    style: {
                        backgroundColor: 'lightgray',
                        paddingLeft: '0.25em',
                        paddingRight: '0.25em',
                        paddingTop: '0.5em',
                        paddingBottom: '0.5em',
                        marginTop: '0.25em',
                        marginBottom: '0.25em',
                    },
                }, blockDefs[blockType]?.fields?.queryset !== null
                    ? JSON.stringify(blockDefs[blockType]?.fields?.queryset)
                    : ''),
            ]),
            h('div', {
                style: {
                    display: 'flex',
                    alignItems: "end",
                },
            }, [
                key,
                h('div', {style: {flex: '1'}}),
                select(
                    (value, evt) => cuePanelAction({panelTarget: key, panelSender: {key, id: panel?.id}, actionKey: 'panel-modify', panelFields: {block: value}, inputEvent: evt}),
                    Object.keys(blockDefs).map(t => ({value: t, label: t, selected: t === blockType})),
                ),
                h('span', {style: {width: '0.5em', display: 'inline-block'}}, ' '),
                button(
                    (evt) => cuePanelAction({panelTarget: key, panelSender: {key, id: panel?.id}, actionKey: 'panel-navigate-back', inputEvent: evt}),
                    "⏴",
                    {disabled: !panel?.fields?.back},
                ),
                button(
                    (evt) => cuePanelAction({panelTarget: key, panelSender: {key, id: panel?.id}, actionKey: 'panel-navigate-forward', inputEvent: evt}),
                    "⏵",
                    {disabled: !panel?.fields?.next},
                ),
                h('span', {style: {width: '0.5em', display: 'inline-block'}}, ' '),
                button(
                    (evt) => cuePanelAction({panelTarget: key, panelSender: {key, id: panel?.id}, actionKey: 'panel-close', panelKeys: [key], inputEvent: evt}),
                    "✕",
                ),
            ])
        ])
});

    const panelsH = Behaviors.keep(h('div', {
        style: `
            display: flex;
            flex-direction: ${layout.fields?.direction ?? 'row'};
            gap: 1em;
            flex-grow: 1;
            height: 100vh;
            overflow-x: auto;
            scrollbar-width: none;
        `,
    }, [
        ...Array.from(panelKeys,
            (key) => {
                const panel = panelMap[key]
                return h('div', {
                    style: `
                        display: flex;
                        flex-direction: column;
                        margin-top: 0.5em;
                        margin-bottom: 0.5em;
                        margin-left: 0.5em;
                        margin-right: 0.5em;
                        min-width: calc(50vw - (3em));
                        overflow: auto;
                        flex: 1 1 min-content;
                        border: 1px solid black;
                        border-radius: 0.2em;
                    `,
                    key,
                }, [
                    panel
                        ? h('iframe', {
                            ...panelIframeProps[key],
                            style: `
                                flex-grow: 1;
                                width: 100%;
                                height: 100%;
                                border: 0;
                                border-bottom: 1px solid black;
                            `,
                        })
                        : 'missing panel record',
                    panelControls({
                        key,
                        panel,
                        recordQuerySet: panel?.fields?.queryset,
                        blockType: panel?.fields?.block,
                    }),
                ])
            }
        ),
        h('div', {
            style: `
                display: flex;
                flex-direction: ${layout.fields?.direction === 'row' ? 'column' : 'row'};
            `,
        }, [
            button(
                (evt) => cuePanelAction({panelTarget: null, actionKey: 'panel-start', inputEvent: evt}),
                '+',
                {style: 'width: 2em; height: 2em;'}
            ),
            button(
                (evt) => act({cue: {fields: {type: "action/cue", key: 'surface-import-files'}}}),
                "📂",
                {style: 'width: 2em; height: 2em;'}
            ),
            button(
                (evt) => act({cue: {fields: {type: "action/cue", key: 'surface-import-snapshots'}}}),
                "🚛",
                {style: 'width: 2em; height: 2em;'}
            ),
            h('div', {style: {flex: '1'}}),
        ]),
    ]));

    const render = Behaviors.keep(node => (preactRender(panelsH, node), "ok"));

    return [
        render,
    ]
}
