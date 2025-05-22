const importFeatureset = async (url) => (await import(`${url}${new URL(import.meta.url).search}`)).featureset

export const featuresets = Promise.all([
    importFeatureset(`./surface/surface.featureset.js`),
    importFeatureset(`./context/context.featureset.js`),
    importFeatureset(`./explore/explore.featureset.js`),
    importFeatureset(`./text/text.featureset.js`),
    importFeatureset(`./msg/msg.featureset.js`),
    importFeatureset(`./media/media.featureset.js`),
    importFeatureset(`./pdf/pdf.featureset.js`),
    importFeatureset(`./search/search.featureset.js`),
])
