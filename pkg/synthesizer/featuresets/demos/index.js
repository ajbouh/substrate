const importFeatureset = async (url) => (await import(`${url}${new URL(import.meta.url).search}`)).featureset

export const featuresets = Promise.all([
    importFeatureset("./bridge-advanced/bridge-advanced.featureset.js"),
    importFeatureset("./bridge-simple/bridge-simple.featureset.js"),
    importFeatureset("./search/search.featureset.js"),
])
