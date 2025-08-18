// a test is a function that accepts the inputs {unit} and throws on failure
async function testsFor(workspace, targetNames) {
    // const prefixes = Array.from(targetNames, name => `${name}/tests/`)
    const testNames = workspace.list()
    return [
        ...testNames.flatMap((testName) => {
            for (const targetName of targetNames) {
                if (testName.startsWith(`${targetName}/tests/`)) {
                    return [{testName, targetName}]
                }
            }
            return []
        }),
        // ...(await Promise.all(testNames.map((async testName => {
        //     const testFor = await workspace.getAttribute({testName, attribute: 'testFor'})
        //     return targetNames.has(testFor)
        //         ? {testName, unit}
        //         : undefined
        // })))).filter(_ => _),
    ]
}

async function runTests(workspace, names) {
    let passed = [], failed = [], total = 0

    const allTestMatches = await testsFor(workspace, new Set(names))
    for (const [name, matches] of Object.entries(Object.groupBy(allTestMatches, m => m.targetName))) {
        total += matches.length

        const unit = await workspace.get(name)
        for (const {testName: test} of matches) {
            try {
                const testUnit = await workspace.get(test)
                await testUnit({unit, workspace})
                passed.push({name, test})
            } catch (caught) {
                failed.push({name, test, caught})
            }
        }
    }

    if (failed.length) {
        const failedObj = {}
        for (const {name, test} of failed) {
            if (!(name in failedObj)) {
                failedObj[name] = []
            }
            failedObj[name].push(test)
        }
        const err = new AggregateError(failed.map(({caught}) => caught), `tests failed: ${JSON.stringify(failedObj)}`)
        err.passed = passed
        err.failed = failed
        err.total = total
        throw err
    }

    return {
        passed,
        failed,
        total,
    }
}

export default async function ({workspace, inputs}) {
    // const aliases = Array.isArray(aliasOrAliases) ? aliasOrAliases : [aliasOrAliases]
    return await runTests(workspace, workspace.list())
}