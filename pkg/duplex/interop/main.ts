import * as tcp from "../transport/deno/tcp.ts";
import * as peer from "../peer/mod.ts";
import * as rpc from "../rpc/mod.ts";
import * as fn from "../fn/handler.ts";
import * as codec from "../codec/mod.ts";
import * as interop from "./services.ts";

// TODO: this should be done over STDIO but added support to run duplex check against tcp endpoints for now

const listener = Deno.listen({ port: 8181 });
const service = fn.handlerFrom(interop.interopService);
console.log("listening on 0.0.0.0:8181");
for await (const conn of listener) {
  const p = peer.open(new tcp.Conn(conn), new codec.CBORCodec());
  p.handle("/", service)
  p.respond();
}