// @ts-ignore
import {assertEquals} from "https://deno.land/std/testing/asserts.ts";
// @ts-ignore
import * as codec from "./mod.ts";
// @ts-ignore
import {Buffer} from "../buffer.ts";

Deno.test("frame+json codec", async () => {
    const jc = new codec.JSONCodec();
    const framer = new codec.FrameCodec(jc);
    const buf = new Buffer();

    const msg1 = {foo: 1, bar: 2};
    const msg2 = {baz: 3, qux: 4};
    const enc = framer.encoder(buf);
    await enc.encode(msg1);
    await enc.encode(msg2);

    const dec = framer.decoder(buf);
    const ret1 = await dec.decode();
    const ret2 = await dec.decode();

    assertEquals(ret1, msg1);
    assertEquals(ret2, msg2);
});


Deno.test("frame+cbor codec", async () => {
    const cc = new codec.CBORCodec();
    const framer = new codec.FrameCodec(cc);
    const buf = new Buffer();

    const msg1 = {foo: 1, bar: 2};
    const msg2 = {baz: 3, qux: 4};
    const enc = framer.encoder(buf);
    await enc.encode(msg1);
    await enc.encode(msg2);

    const dec = framer.decoder(buf);
    const ret1 = await dec.decode();
    const ret2 = await dec.decode();

    assertEquals(ret1, msg1);
    assertEquals(ret2, msg2);
});

Deno.test("frame+cbor codec toJSON", async () => {
    class Foobar {
        data?: Array<any>;
    
        toJSON(key?: any): any {
            return this.data;
        }

        static fromJSON(obj: any): Foobar {
            const o = new Foobar();
            o.data = obj;
            return o;
        }
    }

    const cc = new codec.CBORCodec(false, [{
        Class: Foobar,
        tag: 40501,
        encode(instance: any, encode: any) {
            if (instance["toJSON"]) {
          encode(instance.toJSON());
          return;
        }
            encode(instance);
        },
        decode(data: any) {
            return data;
        }
    }]);
    const framer = new codec.FrameCodec(cc);
    const buf = new Buffer();

    const obj = new Foobar();
    obj.data = [1,2,3];
    const enc = framer.encoder(buf);
    await enc.encode(obj);

    const dec = framer.decoder(buf);
    const ret = await dec.decode();

    const retObj = Foobar.fromJSON(ret);
    assertEquals(retObj, obj);
});
