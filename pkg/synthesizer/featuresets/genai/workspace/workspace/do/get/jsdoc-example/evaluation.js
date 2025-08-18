export default async function runJSDocExample({unit: {source}, name, workspace}) {
    try {
        let description, params, returns
        if (typeof source === 'string') {
            ({description, params, returns} = JSON.parse(source))
        } else {
            ({description, params, returns} = source)
        }
        return await workspace.eval.javascript`
            async ({unit}) => {
                // testID=${name} description=${JSON.stringify(description)}
                const got = await unit(${params.map(p => JSON.stringify(p)).join(", ")});
                const want = ${JSON.stringify(returns)};
                if (JSON.stringify(want) !== JSON.stringify(got)) { throw new Error(\`FAIL testID=${name}; got = \${JSON.stringify(got)}\`); }
                console.log("PASS testID=${name}");
            }`
    } catch (caught) {
        return {
            caught,
        }
    }
}
