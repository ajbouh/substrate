export const makeInputs = ({h}) => {
    const renderOptions = (values, options) =>
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
            ));

    return {
        select: (notifier, options, props={}) => {
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
        },
        textinput: (initial, notifier, props={}) => h('input',
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
        ),
        button: (notifier, text, props={}) => h(
            'button',
            {
                type: 'text',
                onclick: evt => notifier(evt),
                ...props,
            },
            text,
        )
    }
}
