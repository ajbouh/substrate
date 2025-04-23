const baseURI = document.baseURI
const recordStoreBaseURL = (async () => {
    let bootstrapMsg0
    const bootstrapMsg = async () => {
        if (bootstrapMsg0 === undefined) {
            bootstrapMsg0 = import("./msg.js")
        }
        return await bootstrapMsg0
    }
    
    const queryLinks0 = async (url, query) => {
        const {reflect, sender} = await bootstrapMsg()
        const sendmsg = sender()

        const msgindex = await reflect(url)
        const linksQuery = msgindex['links:query']
        if (!linksQuery) {
            return undefined
        }
        const result = await sendmsg(linksQuery, query)
        return result.data.returns.links
    }
    const queryLinks = async (...a) => {
        const r = await queryLinks0(...a)
        // console.log("queryLinks", ...a, "=>", r)
        return r
    }

    const resolveURL = async () => {
        const url = new URL(baseURI);
        const recordstore = url.searchParams.get("eventstore") || url.searchParams.get("recordstore");
        if (recordstore) {
            return recordstore
        }
    
        const baseLinks = await queryLinks(baseURI)
        const spaceURL = baseLinks['space']?.href
        const atopURL = baseLinks['atop']?.href
        const eventstoreURL = baseLinks['eventstore']?.href

        let atopLinks
        let atopSpaceURL
        let atopEventstoreURL
        if (atopURL) {
            atopLinks = await queryLinks(atopURL);
            atopEventstoreURL = atopLinks['eventstore']?.href
            if (atopEventstoreURL) {
                return atopEventstoreURL
            }

            atopSpaceURL = atopLinks['space']?.href
            if (atopSpaceURL) {
                const atopSpaceLinks = await queryLinks(spaceURL)
                return atopSpaceLinks['eventstore']?.href
            }
        }

        if (eventstoreURL) {
            return eventstoreURL
        }

        const spaceLinks = await queryLinks(spaceURL)
        return spaceLinks['eventstore']?.href
    }

    return await resolveURL()
})();
