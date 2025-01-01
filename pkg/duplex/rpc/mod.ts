// @ts-ignore
export * from "./client.ts";
// @ts-ignore
export * from "./handler.ts";
// @ts-ignore
export * from "./responder.ts";

// @ts-ignore
import * as mux from "../mux/mod.ts";
// @ts-ignore
import * as codec from "../codec/mod.ts";

export interface Caller {
  call(selector: string, params: any): Promise<Response>;
}

export interface Responder {
  header: ResponseHeader;
  send(v: any): Promise<void>;
  return(v: any): Promise<void>;
  continue(v: any): Promise<mux.Channel>;
}

export class Call {
  selector: string;
  channel: mux.Channel;
  caller: Caller|undefined;
  decoder: codec.Decoder;

  constructor(selector: string, channel: mux.Channel, decoder: codec.Decoder) {
    this.selector = selector;
    this.channel = channel;
    this.decoder = decoder;
  }

  receive(): Promise<any> {
    return this.decoder.decode();
  }

}

export class ResponseHeader {
  E: string|undefined; // error
  C: boolean; // continue; after parsing response, keep stream open 

  constructor() {
    this.E = undefined;
    this.C = false;
  }
}

export class Response {
  error: string|undefined;
  continue: boolean;
  value: any;
  channel: mux.Channel;
  codec: codec.Codec;

  constructor(channel: mux.Channel, codec: codec.Codec) {
    this.channel = channel;
    this.codec = codec;
    this.error = undefined;
    this.continue = false;
  }

  send(v: any): Promise<void> {
    return this.codec.encoder(this.channel).encode(v);
  }

  receive(): Promise<any> {
    return this.codec.decoder(this.channel).decode();
  }

}
