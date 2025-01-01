// @ts-ignore
import * as io from "../io.ts";
// @ts-ignore
import * as codec from "./mod.ts";

import { decode, encode, addExtension } from "../vnd/cbor-x-1.4.1/index.js";

export class CBORCodec {
  debug: boolean;

  constructor(debug: boolean = false, extensions?: any[]) {
    this.debug = debug;
    if (extensions) {
      extensions.forEach(addExtension);
    }
  }

  encoder(w: io.Writer): codec.Encoder {
    return new CBOREncoder(w, this.debug);
  }

  decoder(r: io.Reader): codec.Decoder {
    return new CBORDecoder(r, this.debug);
  }
}

export class CBOREncoder {
  w: io.Writer;
  debug: boolean;

  constructor(w: io.Writer, debug: boolean = false) {
    this.w = w;
    this.debug = debug;
  }
  
  async encode(v: any) {
    if (this.debug) {
      console.log("<<", v);
    }
    let buf = encode(v);
    let nwritten = 0;
    while (nwritten < buf.length) {
      nwritten += await this.w.write(buf.subarray(nwritten));
    }
  }
}

export class CBORDecoder {
  r: io.Reader;
  debug: boolean;
  
  constructor(r: io.Reader, debug: boolean = false) {
    this.r = r;
    this.debug = debug;
  }

  async decode(len: number): Promise<any> {
    const buf = new Uint8Array(len);
    let bufread = 0;
    while (bufread < len) {
      const n = await this.r.read(buf.subarray(bufread));
      if (n === null) {
        return Promise.resolve(null);
      }
      bufread += n;
    }
    let v = decode(buf);
    if (this.debug) {
      console.log(">>", v);
    }
    return Promise.resolve(v);
  }
}
