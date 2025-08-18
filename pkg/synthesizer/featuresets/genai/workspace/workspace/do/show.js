export default async ({unit, name, workspace, action}) => {
    const blobToDataURL = blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
        reader.readAsDataURL(blob)
    })

    const unitToDataURL = async unit => {
        const {source, type, content} = unit
        const mimeType = type.includes('/') ? type : "text/" + type
        return source ? `data:${mimeType};base64,${btoa(source)}` : (await blobToDataURL(new Blob([content], {mimeType})))
    }

    const makeImageDOMNode = async (unit, {style}={}) => {
        const src = await unitToDataURL(unit)
        const img = document.createElement('img')
        img.src = src
        if (style) {
            img.style = style
        }
        return img
    }

    const makeIframeDOMNode = async (unit, {style}={}) => {
        const src = await unitToDataURL(unit)
        const iframe = document.createElement('iframe')
        iframe.src = src
        if (style) {
            iframe.style = style
        }
        return iframe
    }

    const makeCodeDOMNode = (unit) => {
        const {source} = unit
        const pre = document.createElement('pre')
        container.appendChild(pre)
        const code = document.createElement('code')
        pre.appendChild(code)
        code.innerText = source

        // todo show other attributes too
        return container
    }

    const makeUnitContentDOMNode = async (unit) => {
        const type = unit?.type ?? ''
        if (type.startsWith('image')) {
            return makeImageDOMNode(unit)
        }
        if (type.startsWith('text/html') || type.startsWith('html')) {
            return makeIframeDOMNode(unit)
        }
        return await makeCodeDOMNode(unit)
    }

    const makeUnitDOMNode = async ({name, unit}) => {
        const container = document.createElement('div')
        if (name) {
            const heading = document.createElement('h6')
            heading.innerText = name
            container.appendChild(heading)
        }

        const content = await makeUnitContentDOMNode(unit)
        container.appendChild(content)

        return content
    }

    const elt = await makeUnitDOMNode({name, unit})
    document.body.appendChild(elt)
    return elt
}