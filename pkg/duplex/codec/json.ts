// @ts-ignore
import * as io from "../io.ts";
// @ts-ignore
import * as codec from "./mod.ts";

export class JSONCodec {
  debug: boolean;

  constructor(debug: boolean = false) {
    this.debug = debug;
  }

  encoder(w: io.Writer): codec.Encoder {
    return new JSONEncoder(w, this.debug);
  }

  decoder(r: io.Reader): codec.Decoder {
    return new JSONDecoder(r, this.debug);
  }
}

export class JSONEncoder {
  w: io.Writer;
  enc: TextEncoder;
  debug: boolean;

  constructor(w: io.Writer, debug: boolean = false) {
    this.w = w;
    this.enc = new TextEncoder();
    this.debug = debug;
  }
  
  async encode(v: any) {
    if (this.debug) {
      console.log("<<", v);
    }
    let buf = this.enc.encode(JSON.stringify(v));
    let nwritten = 0;
    while (nwritten < buf.length) {
      nwritten += await this.w.write(buf.subarray(nwritten));
    }
  }
}

export class JSONDecoder {
  r: io.Reader;
  dec: TextDecoder;
  debug: boolean;
  
  constructor(r: io.Reader, debug: boolean = false) {
    this.r = r;
    this.dec = new TextDecoder();
    this.debug = debug;
  }

  async decode(len: number): Promise<any> {
    const buf = new Uint8Array(len);
    const bufn = await this.r.read(buf);
    if (bufn === null) {
      return Promise.resolve(null);
    }
    let v = JSON.parse(this.dec.decode(buf));
    if (this.debug) {
      console.log(">>", v);
    }
    return Promise.resolve(v);
  }
}
