export function component({
    recordsRead0,
    surface0,
    act0,
    cuePanelAction0,
    preact0,
    layout0,
    panelMap0,
    panelKeys0,
    panelIframeProps0,
    msgtxtParser0,
    msgtxtFormatter0,
    ribbonControl0,
    sendRibbonControl0,

    sendActiveMetaSelectionKeyEvent0,
    metaSelectionTabs0,
    activeMetaSelectionOptions0,
    activeMetaSelections0,

}) {
    // HACK these all work around the fact that components don't keep inputs
    const recordsRead = Behaviors.keep(recordsRead0)
    const sendActiveMetaSelectionKeyEvent = Behaviors.keep(sendActiveMetaSelectionKeyEvent0)
    const metaSelectionTabs = Behaviors.keep(metaSelectionTabs0)
    const activeMetaSelectionOptions = Behaviors.keep(activeMetaSelectionOptions0)
    const activeMetaSelections = Behaviors.keep(activeMetaSelections0)
    const ribbonControl = Behaviors.keep(ribbonControl0)
    const sendRibbonControl = Behaviors.keep(sendRibbonControl0)

    const msgtxtParser = Behaviors.keep(msgtxtParser0)
    const msgtxtFormatter = Behaviors.keep(msgtxtFormatter0)
    const layout = Behaviors.keep(layout0)
    const surface = Behaviors.keep(surface0)
    const panelIframeProps = Behaviors.keep(panelIframeProps0)
    const panelKeys = Behaviors.keep(panelKeys0)
    const panelMap = Behaviors.keep(panelMap0)
    const act = Behaviors.keep(act0)
    const cuePanelAction = Behaviors.keep(cuePanelAction0)
    const preact = Behaviors.keep(preact0)

    const actionButton = ({verb, key, label, ...rest}, props) =>
            h('button', {
                onclick: (event) => act({verb, key, ...rest, event}),
                style: `
                    padding: 0.25em;
                `,
                ...props,
            }, label ?? verb ?? key);


// console.log('in layout', {msgtxtParser});
// console.log('in layout', {layout});
console.log('in layout', {surface});
console.log('in layout', {ribbonControl});
// console.log('in layout', {blockDefs});
// console.log('in layout', {panelIframeProps});
// console.log('in layout', {panelKeys});
// console.log('in layout', {panelMap});
// console.log('in layout', {act});
// console.log('in layout', {cuePanelAction});
// console.log('in layout', {preact});

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
            ...props,
            ref: (dom) => {
                if (!dom) {
                    return
                }
                dom.value = initial ?? ''
                props.ref && props?.ref(dom);
            },
            onkeydown: (evt) => {
                props.onkeydown && props.onkeydown(evt)
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

    const panelControls = Behaviors.keep(({key, panel, recordQuerySet, blockType, onmousedown}) => {
        return h('div', {
            class: 'panel-controls',
            onmousedown,
        }, [
            h('div', {style: {marginLeft: '0.5em'}}, key),
            h('div', {style: {flex: '1'}}),
            h('div', {style: {marginLeft: '0.5em'}}, blockType),
            h('span', {style: {width: '0.5em', display: 'inline-block'}}, ' '),
            button(
                (evt) => cuePanelAction({panelTarget: key, panelSender: {key, id: panel?.id}, actionKey: 'panel-close', panelKeys: [key], inputEvent: evt}),
                "✕",
                {
                    class: "close",
                }
            ),
        ])
    });

    const focusPanel = (key, event) => {
        event.preventDefault()
        const panelElement = document.getElementById(`panel_${key}`)
        if (!panelElement || document.activeElement === panelElement) {
            return
        }
        panelElement.focus();
    };

    const panelsH = Behaviors.keep(h('div', {
        style: `
            display: flex;
            flex-direction: ${layout.fields?.direction ?? 'row'};
            gap: 1em;
            flex-grow: 1;
            overflow-x: auto;
            scrollbar-width: none;
            background-color: rgb(221, 221, 221);
        `,
    }, [
        ...Array.from(panelKeys,
            (key) => {
                const panel = panelMap[key]
                return h('div', {
                    class: 'panel',
                    key,
                }, [
                    panelControls({
                        key,
                        panel,
                        recordQuerySet: panel?.fields?.queryset,
                        blockType: panel?.fields?.block,
                        onmousedown: (event) => focusPanel(key, event),
                    }),
                    panel
                        ? h('iframe', {
                            class: 'panel-block',
                            id: `panel_${key}`,
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

                ])
            }
        ),
    ]));

    const actionDraftToText = draft => `$ act ${msgtxtFormatter.formatParameterValues(draft)}`

    const onTextActionRequest = (text, event) => {
        const {input, value, next} = msgtxtParser.parse(text).toMsg();
        console.log({input, value, next, event});
        act({...value.parameters, event})
    }

    const createRibbonButton = ({icon, label, onClick}) => {
        return h('button', { class: 'ribbon-button', onClick },
            // h('span', { style: { fontSize: '20px' } }, icon),
            h('span', { style: { fontSize: '12px' }}, label)
        );
    };

    const Ribbon = ({ tabs, groupsPerTab, expandedTabs, onTabChange, extras }) => {
        const demotedGroupLabels = ['transit', 'dev']
        // const demotedGroupLabels = []
        const mainControlGroups = groups => groups.filter(group => !demotedGroupLabels.includes(group.label))
        const extraControlGroups = groups => groups.filter(group => demotedGroupLabels.includes(group.label))
        const tabGroups = tabs.map((tab, i) => ({
            tab,
            controlGroups: {
                main: mainControlGroups(groupsPerTab[i]?.groups || []),
                extra: extraControlGroups(groupsPerTab[i]?.groups || []),
            },
        })).filter(({tab}) => tab.options.length)
        const ribbonGroup = (group, className='') =>
            h('div', { class: `ribbon-group ${className}` },
                h('div', { class: 'ribbon-group-controls' }, 
                    group.controls.map(control => control)
                ),
                h('div', { class: 'ribbon-group-title' }, group.label)
            )
        return h('div', {
            class: 'ribbon-container',
        }, [
            h('div', {
                class: 'ribbon-extra',
            }, extras),
            h('div', {
                class: 'ribbon-tab-groups',
            }, tabGroups.map(({tab, controlGroups}) =>
                h('div', {
                    class: 'ribbon-tab-group',
                }, [
                    h('div', {
                        class: `ribbon-tab`,
                    }, [
                        tab.label,
                        ' ',
                        tab.options.length > 1
                            ? select(
                                (token, event) => { onTabChange(token); event.stopPropagation() },
                                tab.options.map(option => ({
                                    value: option.token,
                                    label: option.label,
                                    selected: tab.selectedOption === option.key ? true : undefined,
                                })),
                            )
                            : tab.showSingleOptions
                                ? tab.options?.[0]?.label
                                : undefined,
                    ]),
                    h('div', { class: 'ribbon-content' }, [
                        ...controlGroups.main.map(group => ribbonGroup(group)),
                        // ...(expandedTabs.has(tab.key)
                        //     ? []
                        //     : [h('button', {class: 'ribbon-expand'}, '⋮')]),
                    ]),
                    // ...(expandedTabs.has(tab.key)
                    //     ? [
                    //         h('div', { class: 'ribbon-content-extra' }, [
                    //             controlGroups.extra.flatMap(group => [ribbonGroup(group, 'ribbon-tab-group-extra')]),
                    //         ])
                    //     ]
                    //     : []),
                ])),
            ),
        ]);
    };

    const actionBar = h('div', {
            style: `
                display: flex;
                flex-direction: row;
                padding: 0 0.5em 0.5em 0.5em;
                background-color: #ddd;
            `,
        },
        [
            Ribbon({
                tabs: metaSelectionTabs,
                // expandedTabs: new Set([`["surface","panel"]`]),
                groupsPerTab: activeMetaSelections.map((tab, i) => ({
                    key: tab.key,
                    groups: Object.entries(activeMetaSelections[i].groupedVerbs).map(([group, verbs]) => ({
                        label: group,
                        controls: verbs.flatMap(({verb, enabled, label}) => [
                            ' ',
                            actionButton({
                                label,
                                verb,
                                ...activeMetaSelections[i].actionFields,
                            }, {
                                disabled: !enabled,
                            }),
                        ]),
                    })),
                })),
                onTabChange: (token) => {
                    console.log('onTabChange', {token})
                    sendActiveMetaSelectionKeyEvent(token)
                },
                extras: [],
            }),
            ribbonControl != null
                ? h('div', {class: 'ribbon-command-draft'}, [
                    textinput(
                        ribbonControl?.draft
                            ? actionDraftToText(ribbonControl?.draft)
                            : ribbonControl?.text ?? `$ act key: surface-import-files`,
                        (value, event) => {
                            onTextActionRequest(value, event)
                            sendRibbonControl(null);
                        },
                        {
                            class: 'ribbon-command-draft-input',
                            onblur: () => {
                                sendRibbonControl(null);
                            },
                            ref: (dom) => setTimeout(() => dom.focus(), 0),
                            onkeydown: (event) => {
                                if (event.key === "Escape") {
                                    sendRibbonControl(null);
                                }
                            },
                        },
                    ),
                ])
                : undefined,
        ]);

    const style = h('style', {}, `
        .panel {
            display: flex;
            flex-direction: column;
            margin: 0.5em;
            min-width: calc(50vw - (3em));
            overflow: auto;
            flex: 1 1 min-content;
            border: 1px solid black;
            border-radius: 0.5rem;
            background-color: white;
        }

        .panel:focus-within .panel-controls {
            /*background-color: red;*/
        }

        .panel {
            border-radius: 8px; 
            backdrop-filter: blur(30px) saturate(150%);
            transition: all 0.2s ease-out;
            
            background-color: rgba(255, 255, 255, 0.85);
            color: #000000;
        }
        .panel:focus-within {
            box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 
                0 0 10px rgba(0,0,0,0.05),
                0 4px 24px rgba(0,0,0,0.1);
        }

        .panel-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 36px;
            flex-shrink: 0;
            user-select: none;
            cursor: default;
        }

        .panel-controls button {
            width: 46px; 
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: none;
            border: none;
            cursor: default;
            transition: background-color 0.1s ease;
        }
        
        .panel:focus-within .panel-controls button:hover {
            --control-hover-bg: #EFEFEF;
            background-color: var(--control-hover-bg);
        }

        .panel:focus-within .panel-controls button.close:hover {
            --control-close-hover-bg: #E81123;
            background-color: var(--control-close-hover-bg);
            --control-close-hover-icon: #FFFFFF;
            --icon-color: var(--control-close-hover-icon);
            color: var(--control-close-hover-icon);
        }    

        .panel-controls {
            font-family: system-ui;
            font-size: 0.8rem;
            display: flex;
            align-items: anchor-center;
        }

        .ribbon-input:focus {
        }

        .ribbon-input:not(:focus) {
            max-width: 16rem;
        }

        .ribbon-extra {
            position: absolute;
            display: flex;
            margin: 0.75rem 1rem;
            gap: 1rem;
            top: 0;
            right: 0;
            z-index: 1;
        }

        .ribbon-input {
            padding-top: 0.2em;
            padding-bottom: 0.25em;
            flex-grow: 1;
        }

        .ribbon-tab-spacer {
            width: 16rem;
            position: relative;
            flex-grow: 1;
        }

        .ribbon-input:focus {
            flex-grow: 1;
        }

        .ribbon-tab-extra:focus-within {
            flex-grow: 1;
        }

        .ribbon-tab-extra-spacer {
            position: relative;
        }

        .ribbon-tab-extra-spacer::after, .ribbon-tab-spacer::after {
            display: block;
            position: absolute;
            content: '';
            width: 1px;
            right: 0;
            top: 25%;
            border-radius: 1px;
            height: 50%;
            background-color: #ccc;
        }

        .ribbon-container {
            width: 100%;
            font-family: system-ui;
            background-color: #ffffff;
            border-radius: 8px;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            position: relative;
            height: 8rem;
        }

        .ribbon-tab-groups {
            display: flex;
        }

        .ribbon-tab-group {
            position: relative;
        }

        .ribbon-content-extra {
            position: absolute;
            background-color: #ffffff;
            border-radius: 8px;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            left: 0;
            right: 0;
            overflow-x: hidden;
            clip-path: inset(0 -10px -10px -10px);
        }

        .ribbon-tab-group:not(:last-child) {
            border-right: 1px solid #ddd;
        }

        .ribbon-tab {
            text-align: left;
            padding: 0.75rem 1rem;
            cursor: pointer;
            background-color: transparent;
            font-size: 1rem;
            font-weight: 500;
            color: #555;
            position: relative;
            transition: color 0.2s ease;
        }
        
        .ribbon-tab:hover {
            color: #000;
        }

        .ribbon-tab.active {
            color: #096dd9;
        }
        
        .ribbon-tab.active::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 1rem;
            right: 1rem;
            height: 2px;
            background-color: #096dd9;
        }

        .ribbon-expand {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%) translateY(50%);
        }

        .ribbon-content {
            display: flex;
            flex-wrap: wrap;
            position: relative;
            padding-right: 1rem;
            z-index: 1; /* so our expanded drop shadow does not cause problems. */
        }

        .ribbon-group {
            position: relative;
            border-right: 1px solid #e8e8e8;
            padding: 0.5rem 1rem 0rem 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px; /* Reduced gap */
            background-color: #fff;
            margin: 0.25rem 0 1rem 0;
        }

        .ribbon-group:last-child {
            border-right: none;
        }
        
        .ribbon-group-title {
            color: #444;
            font-size: 0.75rem;
            margin-top: 0.25rem;

            align-content: flex-end;
            flex-grow: 1;
        }
        
        .ribbon-group-controls {
            display: flex;
            gap: 6px; /* Slightly reduced gap */
            flex-wrap: wrap;
        }

        .ribbon-button {
            background-color: transparent;
            border: 1px solid transparent;
            border-radius: 4px;
            padding: 4px;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px; /* Reduced gap */
            min-width: 48px;
        }

        .ribbon-button:hover {
            background-color: #f0f0f0;
            border-color: #d9d9d9;
        }

        .ribbon-command-draft-input {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translateX(-50%);
            width: 90rem;
            height: 3rem;
            border-radius: 8px;
            border: 1.5px solid #ccc;
            box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1);
            font-size: 1.5rem;
            padding: 0rem 1.25rem;
            z-index: 1;
        }


    `);

    const root = h('div', {
        style: `
            display: flex;
            height: 100vh;
            flex-direction: column;
        `,
    }, [
        style,
        actionBar,
        panelsH,
    ])

    const render = Behaviors.keep(node => (preactRender(root, node), "ok"));

    return {
        render,
    }
}
