// @ts-ignore
import { Buffer } from "../buffer.ts";
// @ts-ignore
import * as io from "../io.ts";
// @ts-ignore
import * as codec from "./mod.ts";

export class FrameCodec {
  codec: codec.Codec;

  constructor(codec: codec.Codec) {
    this.codec = codec;
  }

  encoder(w: io.Writer): codec.Encoder {
    return new FrameEncoder(w, this.codec);
  }

  decoder(r: io.Reader): codec.Decoder {
    return new FrameDecoder(r, this.codec.decoder(r));
  }
}


export class FrameEncoder {
  w: io.Writer;
  codec: codec.Codec;

  constructor(w: io.Writer, codec: codec.Codec) {
    this.w = w;
    this.codec = codec;
  }
  
  async encode(v: any) {
    const data = new Buffer();
    const enc = this.codec.encoder(data);
    await enc.encode(v);
    const lenPrefix = new DataView(new ArrayBuffer(4));
    lenPrefix.setUint32(0, data.length);
    const buf = new Uint8Array(data.length+4);
    buf.set(new Uint8Array(lenPrefix.buffer), 0);
    buf.set(data.bytes(), 4);
    let nwritten = 0;
    while (nwritten < buf.length) {
      nwritten += await this.w.write(buf.subarray(nwritten));
    }
  }
}
  

export class FrameDecoder {
  r: io.Reader;
  dec: codec.Decoder;

  constructor(r: io.Reader, dec: codec.Decoder) {
    this.r = r;
    this.dec = dec;
  }
  
  async decode(len?: number): Promise<any> {
    const prefix = new Uint8Array(4);
    const prefixn = await this.r.read(prefix);
    if (prefixn === null) {
      return null;
    }
    const prefixv = new DataView(prefix.buffer);
    const size = prefixv.getUint32(0);
    return await this.dec.decode(size);
  }

}
