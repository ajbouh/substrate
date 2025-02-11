import * as duplex from "/msgtun/duplex.min.js";

export async function msgtun(o, {id}={}) {
    const socket = await duplex.connectWebSocket('/msgtun/ws', function onclose() { console.log('websocket closeddd')})
    const sess = new duplex.Session(socket);
    const peer = new duplex.Peer(sess, new duplex.CBORCodec());
    peer.respond(); // async while loop

    const index = {}

    for (const [k, {description, parameters={}, returns={}}] of Object.entries(o)) {
        index[k] = {
            description,
            meta: Object.fromEntries([
                ...Object.entries(parameters).map(([k, {description, type}]) => [
                    `#/data/parameters/${k}`,
                    {description, type}
                ]),
                ...Object.entries(returns).map(([k, {description, type}]) => [
                    `#/data/returns/${k}`,
                    {description, type}
                ]),
            ])
        }
    }

    peer.handle("reflect", {
        respondRPC(r/*: rpc.Responder*/, c/*: rpc.Call*/)/*: void*/ {
            console.log("peer handle reflect", r, c)
            r.return(index)
        },
    })

    peer.handle("run", {
        async respondRPC(r/*: rpc.Responder*/, c/*: rpc.Call*/)/*: void*/ {
            console.log("peer handle run", r, c)
            const received = await c.receive()
            const [name, parameters] = received
            console.log("peer handle run 2", {received, name, parameters})
            const result = await o[name].run(parameters)
            console.log("peer handle run 3", {result})
            r.return(result)
        },
    })

    const registration = await peer.call("tun.RegisterV1", {
        id,
        reflect: {selector: "reflect", args: undefined},
        run: {selector: "run", args: undefined},
    })
    console.log({registration})

    return registration.value
}
