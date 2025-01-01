// @ts-ignore
import * as io from "../io.ts";
// @ts-ignore
export * from "./json.ts"
// @ts-ignore
export * from "./cbor.ts"
// @ts-ignore
export * from "./frame.ts"

export interface Encoder {
    encode(v: any): Promise<void>;
}

export interface Decoder {
    decode(len?: number): Promise<any>;
}

export interface Codec {
    encoder(w: io.Writer): Encoder;
    decoder(r: io.Reader): Decoder;
}