const init = Events.once([modules]);
((init) => {
    Events.send(ready, true);
    Events.send(urlChange, "./featuresets/index.js");
})(init);

const {h, html, render} = modules.preact

const modifyURL = (url, fn) => { const u = new URL(url, document.baseURI); fn(u); return u.toString(); }
const fetchLatestModule = (url) => import(modifyURL(url, u => u.searchParams.set('nonce', Date.now())))

const installFeaturesets = async (featuresets) => {
    const writeses = await Promise.all(
        featuresets.map(
            async (featureset) => {
                let writes = await featureset.records({path: surface.fields.path})
                writes = writes.map(write => ({
                    ...write,
                    fields: {
                        ...write?.fields,
                        surface: surface.fields.path,
                        featureset: featureset.name,
                    },
                }))
                return writes
            }))
    const writes = writeses.flat(1)
    Events.send(recordsWrite, writes)
}

const installLatestFeaturesets = async (featuresets) => {
    // if the featureset has a url, fetch the latest version of it
    console.log(featuresets)
    featuresets = await Promise.all(featuresets.map(
        async (featureset) => featureset.url ? (await fetchLatestModule(featureset.url)).featureset : featureset))
    await installFeaturesets(featuresets)
}

const urlChange = Events.receiver()
const url = Behaviors.keep(urlChange);

const moduleUpdated = Events.collect(undefined, urlChange, (now, url) => fetchLatestModule(url));

const featuresetsUpdated = Events.resolvePart(Events.collect(
    undefined,
    moduleUpdated, (now, module) => {
        try {
            return [
                module.featuresets ? module.featuresets : [],
                module.featureset ? [module.featureset] : [],
            ]
        } catch (e) {
            console.error(e)
            return []
        }
}));

const featuresets = Behaviors.keep(featuresetsUpdated.flat());

render(
    h('div', {
        style: `
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        gap: 1em;
        max-width: calc(100cqi - 2em);
        margin: auto;
        padding: 1em;
        `,
    }, [
        h('input', {
            type: 'text',
            ref: (dom) => {
                if (!dom) {
                    return
                }
                dom.value = url
            },
            onkeydown: (evt) => {
                if (evt.key === "Enter") {
                    evt.preventDefault();
                    evt.stopPropagation();
                    Events.send(urlChange, evt.target.value);
                }
                if (evt.key === "Escape") {
                    evt.preventDefault();
                    evt.stopPropagation();
                    evt.target.value = url
                }
            },
        }),
        h('hr'),
        ...featuresets.map((feature, i) =>
            h('div', {

            }, [
                i > 0 ? h('hr') : undefined,
                h('div', {
                    style: `display: flex; justify-content: space-between; align-items: center;`,
                }, [
                    h('span', {style: 'font-weight: bold; line-height: 2;'}, feature.title || `anonymous featureset`),
                    h('button', {onclick: () => installLatestFeaturesets([feature])}, `install`),
                ]),
                h('p', {
                    style: `
                    margin-block-start: 0rem;
                    `,
                }, feature.description),
                h('div', {
                    style: `
                    color: #aaa;
                    font-family: monospace;
                    `,
                }, ['url: ', feature.url]),
            ]),
        ),
    ]),
    document.body,
)
