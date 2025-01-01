// @ts-ignore
import * as io from "../../io.ts";
// @ts-ignore
import * as codec from "./mod.ts";

export class Encoder {
  w: io.Writer;

  constructor(w: io.Writer) {
    this.w = w;
  }

  async encode(m: codec.AnyMessage): Promise<number> {
    if (codec.debug.messages) {
      console.log("<<ENC", m);
    }
    const buf = Marshal(m);
    if (codec.debug.bytes) {
      console.log("<<ENC", buf);
    }
    let nwritten = 0;
    while (nwritten < buf.length) {
      nwritten += await this.w.write(buf.subarray(nwritten));
    }
    return nwritten;
  }
}

export function Marshal(obj: codec.AnyMessage): Uint8Array {
  if (obj.ID === codec.CloseID) {
    const m = obj as codec.CloseMessage;
    const data = new DataView(new ArrayBuffer(5));
    data.setUint8(0, m.ID);
    data.setUint32(1, m.channelID);
    return new Uint8Array(data.buffer);
  }
  if (obj.ID === codec.DataID) {
    const m = obj as codec.DataMessage;
    const data = new DataView(new ArrayBuffer(9));
    data.setUint8(0, m.ID);
    data.setUint32(1, m.channelID);
    data.setUint32(5, m.length);
    const buf = new Uint8Array(9 + m.length);
    buf.set(new Uint8Array(data.buffer), 0);
    buf.set(m.data, 9);
    return buf;
  }
  if (obj.ID === codec.EofID) {
    const m = obj as codec.EOFMessage;
    const data = new DataView(new ArrayBuffer(5));
    data.setUint8(0, m.ID);
    data.setUint32(1, m.channelID);
    return new Uint8Array(data.buffer);
  }
  if (obj.ID === codec.OpenID) {
    const m = obj as codec.OpenMessage;
    const data = new DataView(new ArrayBuffer(13));
    data.setUint8(0, m.ID);
    data.setUint32(1, m.senderID);
    data.setUint32(5, m.windowSize);
    data.setUint32(9, m.maxPacketSize);
    return new Uint8Array(data.buffer);
  }
  if (obj.ID === codec.OpenConfirmID) {
    const m = obj as codec.OpenConfirmMessage;
    const data = new DataView(new ArrayBuffer(17));
    data.setUint8(0, m.ID);
    data.setUint32(1, m.channelID);
    data.setUint32(5, m.senderID);
    data.setUint32(9, m.windowSize);
    data.setUint32(13, m.maxPacketSize);
    return new Uint8Array(data.buffer);
  }
  if (obj.ID === codec.OpenFailureID) {
    const m = obj as codec.OpenFailureMessage;
    const data = new DataView(new ArrayBuffer(5));
    data.setUint8(0, m.ID);
    data.setUint32(1, m.channelID);
    return new Uint8Array(data.buffer);
  }
  if (obj.ID === codec.WindowAdjustID) {
    const m = obj as codec.WindowAdjustMessage;
    const data = new DataView(new ArrayBuffer(9));
    data.setUint8(0, m.ID);
    data.setUint32(1, m.channelID);
    data.setUint32(5, m.additionalBytes);
    return new Uint8Array(data.buffer);
  }
  throw `marshal of unknown type: ${obj}`;
}
