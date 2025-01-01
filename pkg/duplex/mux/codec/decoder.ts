// @ts-ignore
import * as codec from "./mod.ts";
// @ts-ignore
import * as io from "../../io.ts";
// @ts-ignore
import * as util from "../util.ts";

export class Decoder {
  r: io.Reader;

  constructor(r: io.Reader) {
    this.r = r;
  }

  async decode(): Promise<codec.Message | null> {
    const packet = await readPacket(this.r);
    if (packet === null) {
      return Promise.resolve(null);
    }
    if (codec.debug.bytes) {
      console.log(">>DEC", packet);
    }
    const msg = Unmarshal(packet);
    if (codec.debug.messages) {
      console.log(">>DEC", msg);
    }
    return msg;
  }
}

async function readPacket(r: io.Reader): Promise<Uint8Array | null> {
  const head = new Uint8Array(1);
  const headn = await r.read(head);
  if (headn === null) {
    return Promise.resolve(null);
  }
  const msgID = head[0];

  const size = codec.payloadSizes.get(msgID);
  if (size === undefined || msgID < codec.OpenID || msgID > codec.CloseID) {
    return Promise.reject(`bad packet: ${msgID}`);
  }

  const rest = new Uint8Array(size);
  const restn = await r.read(rest);
  if (restn === null) {
    return Promise.reject("unexpected EOF reading packet");
  }

  if (msgID === codec.DataID) {
    const view = new DataView(rest.buffer);
    const datasize = view.getUint32(4);
    let dataread = 0;
    const chunks = [];
    while (dataread < datasize) {
      const chunk = new Uint8Array(datasize-dataread);
      const chunkread = await r.read(chunk);
      if (chunkread === null) {
        return Promise.reject(`unexpected EOF reading data chunk`);
      }
      dataread += chunkread;
      chunks.push(chunk.slice(0, chunkread));
    }
    return util.concat([head, rest, ...chunks], 1 + rest.length + datasize);
  }

  return util.concat([head, rest], rest.length + 1);
}

export function Unmarshal(packet: Uint8Array): codec.Message {
  const data = new DataView(packet.buffer);
  switch (packet[0]) {
    case codec.CloseID:
      return {
        ID: packet[0],
        channelID: data.getUint32(1)
      } as codec.CloseMessage;
    case codec.DataID:
      let dataLength = data.getUint32(5);
      let rest = new Uint8Array(packet.buffer.slice(9));
      return {
        ID: packet[0],
        channelID: data.getUint32(1),
        length: dataLength,
        data: rest,
      } as codec.DataMessage;
    case codec.EofID:
      return {
        ID: packet[0],
        channelID: data.getUint32(1)
      } as codec.EOFMessage;
    case codec.OpenID:
      return {
        ID: packet[0],
        senderID: data.getUint32(1),
        windowSize: data.getUint32(5),
        maxPacketSize: data.getUint32(9),
      } as codec.OpenMessage;
    case codec.OpenConfirmID:
      return {
        ID: packet[0],
        channelID: data.getUint32(1),
        senderID: data.getUint32(5),
        windowSize: data.getUint32(9),
        maxPacketSize: data.getUint32(13),
      } as codec.OpenConfirmMessage;
    case codec.OpenFailureID:
      return {
        ID: packet[0],
        channelID: data.getUint32(1),
      } as codec.OpenFailureMessage;
    case codec.WindowAdjustID:
      return {
        ID: packet[0],
        channelID: data.getUint32(1),
        additionalBytes: data.getUint32(5),
      } as codec.WindowAdjustMessage;
    default:
      throw `unmarshal of unknown type: ${packet[0]}`;
  }
}
