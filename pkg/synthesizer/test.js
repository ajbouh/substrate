async function run(name, test, options={}) {
    let failed = false, faileddirectly = false, failedexplicitly = false, skipped = false, traplogs = true
    let debugexplicitly = false
    const logs = [];
    const subtests = [];
    const consolelog = console.log

    const fail = (direct, explicit) => {
        failed = true;
        if (direct) { faileddirectly = true }
        if (explicit) { failedexplicitly = true }
        if (direct && options.debugOnFail) { debugger }
    }
    const t = {
        name,
        async run(subtestName, subtestFn, subtestOptions) {
            console.log = consolelog
            const subtest = run(
                `${name}/${subtestName}`,
                subtestFn,
                {...options, awaitPreceding: Promise.allSettled(subtests), ...subtestOptions},
            );
            subtests.push(subtest);
            const result = await subtest;
            result.failed && fail();
            logs.push(['subtest', result]);
            console.log = t.log
        },
        skip(...msg) {
            logs.push(['log', ...msg])
            const skip = new Error('skip')
            skip.skip = true // should be a symbol
            throw skip
        },
        log(...msg) {
            if (traplogs) {
                logs.push(['log', ...msg])
            } else {
                consolelog(...msg)
            }
        },
        debug(fn) {
            if (options.debug) {
                debugexplicitly = true
                options.debug(fn)
            }
        },
        fail(msg, ...vals) {
            fail(true, true)
            const error = new Error(msg)
            error.logmsg = ['error', msg, ...vals] // should be a symbol
            throw error
        },
        assert(assertion, msg, ...vals) {
            const logmsg = ['assert', assertion, msg, ...vals]
            if (assertion) {
                logs.push(logmsg)
            } else {
                fail(true, true)
                const error = new Error(msg)
                error.logmsg = logmsg
                throw error
            }
        },
    }
    let start, end
    const runner = options.runner || ((test, t) => test(t))

    try {
        if (options.awaitPreceding) {
            // let previous test run finish first.
            await options.awaitPreceding
        } else {
            // let other promises resolve first so we get more a accurate duration
            await Promise.resolve()
        }

        console.log = t.log
        start = Date.now()
        await runner(test, t);
    } catch (e) {
        if (e.skip) {
            skipped = true
        } else {
            fail(true)
            logs.push(e.logmsg || ['error', e])
        }
    } finally {
        await Promise.allSettled(subtests)
        end = Date.now()
        console.log = consolelog
        traplogs = false
    }

    return {
        name,
        skipped,
        failed,
        faileddirectly,
        failedexplicitly,
        debugexplicitly,
        logs,
        test,
        start,
        end,
        duration: end - start,
        options,
    }
}

function report(result, {onfailed}={}) {
    const {name, logs, failed, skipped, duration} = result
    let heading = ['PASS', name, `in ${duration}ms`]
    let expanded
    if (failed) {
        onfailed && onfailed(result)
        heading = ['FAIL', name, `in ${duration}ms`]
        expanded = true
    } else if (skipped) {
        heading = ['SKIP', name, `in ${duration}ms`]
    }
    if (logs.length) { // todo take into account passing asserts ... these are ignored and shouldn't cause us to group
        if (expanded) {
            console.group(...heading)
        } else {
            console.groupCollapsed(...heading)
        }
        for (const [type, ...rest] of logs) {
            switch (type) {
            case 'subtest':
                report(rest[0], {onfailed})
                break;
            case 'assert':
                if (rest[0]) {
                    console.log('assert', ...rest.slice(1))
                } else {
                    console.assert(...rest)
                }
                break
            default:
                console[type](...rest);
            }
        }
        console.groupEnd();
    } else {
        console.log(...heading)
    }
}

export class Testing {
    constructor() {
        this.failures = 0
        this.results = []
    }
    async debugResult(result, debugFn) {
        const debugTests = new Set()
        const onlyRunTests = new Set()
        const visit = result => {
            result.failed && onlyRunTests.add(result.name);
            (result.faileddirectly && !result.failedexplicitly) && debugTests.add(result.name);
            result.logs
                .filter(([type]) => type === 'subtest')
                .forEach(([,subresult]) => visit(subresult))
        }
        visit(result)

        console.log('debugTests', debugTests)
        console.log('onlyRunTests', onlyRunTests)

        await run(result.name, result.test, {
            ...result.options,
            debugOnFail: result.debugexplicitly ? false : true,
            debug: debugFn,
            runner: async (test, t) => {
                if (debugTests.has(t.name)) {
                    debugFn(test)
                }
                if (!onlyRunTests.has(t.name)) {
                    t.skip()
                }
                try {
                    console.group('DEBUG:', t.name)
                    return await test(t)
                } finally {
                    console.groupEnd()
                }
            },
        })
    }
    async debug(debugFn) {
        for (const result of this.results) {
            await this.debugResult(result, debugFn)
        }
    }
    async run(name, test, options) {
        const result = await run(name, test, options)
        if (result.failed) {
            this.failures++
        }
        this.results.push(result)
        report(result)
    }
    async url(url, {pattern, exports, useDebugger}={}) {
        // todo use sandbox
        await this.run(url, async t => {
            const module = await import(url)
            if (!pattern && !exports) {
                exports = module.test ? ['test'] : ['default']
            }
            if (pattern) {
                exports = Object.keys(module).filter(key => new RegExp(pattern).test(key))
            }
            for (const exportKey of exports) {
                const v = module[exportKey]
                if (!v) {
                    t.fail("no export", exportKey)
                }
                t.run(`export ${exportKey}`, v)
            }
        }, {useDebugger})
    }
    async tests(tests) {
        for (const t in tests) {
            this.run(t, tests[t])
        }
    }
}
