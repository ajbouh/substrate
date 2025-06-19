export function component({
    modules,
}) {
    const modules0 = Behaviors.keep(modules)

    const {
        javascript,
    } = modules0.codemirror

    const extension = javascript()

    const matcher = Behaviors.keep((record) => {
        const match = record?.fields?.type === "text/javascript" ||
            record?.fields?.type === "block" ||
            record?.fields?.type === "action" ||
            record?.fields?.type === "facet" ||
            record?.fields?.schema?.data?.format === "text/javascript" ||
            record?.fields?.schema?.data?.format === "text/renkon"
        return match
    })

    return {
        matcher,
        extension,
    }
}
