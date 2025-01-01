// @ts-ignore
import {assertEquals} from "https://deno.land/std/testing/asserts.ts";
// @ts-ignore
import * as codec from "./mod.ts";
// @ts-ignore
import * as message from "./message.ts";
// @ts-ignore
import {Buffer} from "../../buffer.ts";

Deno.test("encode/decode", async () => {
  const openMsg = {
    ID: message.OpenID,
    senderID: 200,
    windowSize: 300,
    maxPacketSize: 400,
  } as message.AnyMessage;
  const buf = new Buffer();
  
  const enc = new codec.Encoder(buf);
  await enc.encode(openMsg);
  
  const dec = new codec.Decoder(buf);
  const ret = await dec.decode();

  assertEquals(ret, openMsg);
});
