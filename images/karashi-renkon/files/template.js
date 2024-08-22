const useChromestage = !!new URL(window.location.href).searchParams.get("useChromestage")

let ID = 0;

function defineChromestage({width, height}) {
    let id = ID++
    const chromestageURL = new URL(`/chromestage;id=${id};w=${width};h=${height}`, window.location.href).toString()
    console.log(`chromestage ${id}`, chromestageURL)

    const chromstageCommands = chromestageURL + "/commands"
    const chromstageVNC = chromestageURL + "/vnc/"
    const chromestageExports = chromestageURL + "/exports"

    const iframe = document.createElement('iframe')
    iframe.width = width
    iframe.height = height
    iframe.style.margin = '0'

    iframe.src = chromstageVNC

    return {
        width,
        height,
        element: iframe,
        run: async (command, parameters) => {
            console.log("running...", {command, parameters})
            const r = await fetch(chromstageCommands, {
                method: "POST",
                headers: {'Content-Type': "application/json"},
                body: JSON.stringify({
                    command,
                    parameters,
                }),
            })

            const t = await r.text()

            if (r.status !== 200) {
                throw new Error(`non-200 http status: ${t}`)
            }

            // console.log("result", JSON.parse(t))
            // console.log(t)
            const o = JSON.parse(t)
            console.log(`command ${command}`, {parameters, result: o})
            return o
        },
        exports: async function() {
            const resp = await fetch(chromestageExports, {headers: {"Accept": "application/json"}});
            const json = resp.json();
            return json;
        },
    }
}

function defineIframeStage({width, height}) {
    const iframe = document.createElement('iframe')
    iframe.width = width
    iframe.height = height
    iframe.style.margin = '0'

    let _url
    return {
        width,
        height,
        element: iframe,
        debuggingLinks: async function() {
            return {}
        },
        run: async (command, parameters) => {
            switch (command) {
                case "tab:navigate":
                    if (parameters.url === _url) {
                        return
                    }
                    
                    // console.log("setting src", parameters.url)
                    iframe.src = parameters.url
                    _url = parameters.url
                    break
                default:
                    throw new Error(`unknown command ${command}`)
            }
        },
        exports: async function() {
            return {ok: true}
        },
    }
}

export const defineWebstage = useChromestage ? defineChromestage : defineIframeStage;
