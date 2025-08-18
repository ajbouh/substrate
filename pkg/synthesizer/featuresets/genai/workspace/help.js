const helpDocs = `
/**
 * Prints help docs for the given value to the log
 * @name help
 * @global
 * @function
 * @param {Function|object} val Value to get help for
 * 
 * @example help(workspace)
 * @example help(foo)
 */
`

/**
 * Prints help docs for the given value to the log
 * @name help
 * @global
 * @function
 * @param {Function|object} val Value to get help for
 * 
 * @example help(workspace)
 * @example help(foo)
 */
export default async o => {
    let docs = metadata(o)?.docs
    if (!docs) {
        let name
        if (typeof o === 'string') {
            name = o
        } else if (typeof o?.name === 'string') {
            name = o.name
        }
        if (name) {
            docs = workspace.read(name)?.docs
        }
    }
    if (!docs) {
        docs = `no help available for \${o}\n${helpDocs}`
    }
    console.log(docs)
}
