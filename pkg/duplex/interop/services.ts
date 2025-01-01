// @ts-ignore
import * as rpc from "../rpc/mod.ts";
// @ts-ignore
import * as io from "../io.ts";

export const interopService = {
  "Unary": rpc.HandlerFunc(async (r: rpc.Responder, c: rpc.Call): void => {
    const params = await c.receive();
    console.log("Unary", params);
    const resp = await c.caller.call("UnaryCallback", params);
    r.return(resp.value);
  }),
  "Stream": rpc.HandlerFunc(async (r: rpc.Responder, c: rpc.Call): void => {
    const params = await c.receive();
    console.log("Stream...");
    const callback = await c.caller.call("StreamCallback", params);
    const ch = await r.continue(callback.value);
    (async function() {
      while (true) {
        try {
          const v = await c.receive();
          if (!v) {
            break;
          }
          await callback.send(v);
        } catch (e: Error) {
          break;
        }
      }
      await callback.channel.closeWrite();
    })();

    while (true) {
      try {
        const v = await callback.receive();
        if (!v) {
          break;
        }
        await r.send(v);
      } catch (e: Error) {
        break;
      }
    }
    await callback.channel.close();
    await ch.close();
  }),
  "Bytes": rpc.HandlerFunc(async (r: rpc.Responder, c: rpc.Call): void => {
    const params = await c.receive();
    console.log("Bytes...");
    const stream = await c.caller.call("BytesCallback", params);
    const ch = await r.continue(stream.value);
    (async function() {
      await io.copy(stream.channel, c.channel);
      await stream.channel.closeWrite();
    })()

    await io.copy(ch, stream.channel);
    await ch.close();
  }),
  "Error": rpc.HandlerFunc(async (r: rpc.Responder, c: rpc.Call): void => {
    const param = await c.receive();
    console.log("Error", param);
    r.return(new Error(param));
  }),
}

export const callbackService = {
  "UnaryCallback": rpc.HandlerFunc(async (r: rpc.Responder, c: rpc.Call): void => {
    r.return(await c.receive());
  }),
  "StreamCallback": rpc.HandlerFunc(async (r: rpc.Responder, c: rpc.Call): void => {
    const ch = await r.continue(await c.receive());
    try {
      while (true) {
        const v = await c.receive();
        if (!v) {
          break;
        }
        r.send(v);
      }
    } finally {
      ch.close();
    }
  }),
  "BytesCallback": rpc.HandlerFunc(async (r: rpc.Responder, c: rpc.Call): void => {
    const ch = await r.continue(await c.receive());
    try {
      await io.copy(ch, c)
    } finally {
      ch.close();
    }
  }),
};

