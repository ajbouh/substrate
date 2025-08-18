export default async ({unit, name, workspace, action}) => {
    // todo we should discover this instead of knowing its name ahead of time
    const screenshotWebPage = await workspace.get('screenshotWebPage')

    const source = await workspace.getAttribute({unit, name, attribute: 'source'})

    // todo how can we "discover" this function automatically?
    const {content: imageBlob} = await screenshotWebPage({html: source})

    return {
        content: new Uint8Array(await imageBlob.arrayBuffer()),
        type: imageBlob.type,
    }
}
