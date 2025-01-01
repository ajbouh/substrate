// @ts-ignore
import * as util from "../util.ts";
// @ts-ignore
import * as codec from "../codec/mod.ts";
// @ts-ignore
import * as session from "./mod.ts";

export const channelMaxPacket = 1 << 24; // ~16MB, arbitrary
export const channelWindowSize = 64 * channelMaxPacket;

// channel represents a virtual muxed connection
export class Channel {
  localId: number;
  remoteId: number;
  maxIncomingPayload: number;
  maxRemotePayload: number;
  session: session.Session;
  ready: util.queue<boolean>;
  sentEOF: boolean;
  sentClose: boolean;
  remoteWin: number;
  myWindow: number;
  readBuf: util.ReadBuffer;
  writers: Array<() => void>;

  constructor(sess: session.Session) {
    this.localId = 0;
    this.remoteId = 0;
    this.maxIncomingPayload = 0;
    this.maxRemotePayload = 0;
    this.sentEOF = false;
    this.sentClose = false;
    this.remoteWin = 0;
    this.myWindow = 0;
    this.ready = new util.queue();
    this.session = sess;
    this.writers = [];
    this.readBuf = new util.ReadBuffer();
  }

  ident(): number {
    return this.localId;
  }

  async read(p: Uint8Array): Promise<number | null> {
    let n = await this.readBuf.read(p);
    if (n !== null) {
      try {
        await this.adjustWindow(n)
      } catch (e) {
        if (e !== "EOF" && e.name !== "BadResource") {
          throw e;
        }
      }
    }
    return n;
  }

  write(p: Uint8Array): Promise<number> {
    if (this.sentEOF) {
      return Promise.reject("EOF");
    }

    return new Promise((resolve, reject) => {
      let n = 0;
      const tryWrite = () => {
        if (this.sentEOF || this.sentClose) {
          reject("EOF");
          return;
        }
        if (p.byteLength == 0) {
          resolve(n);
          return;
        }
        const space = Math.min(this.maxRemotePayload, p.length);
        const reserved = this.reserveWindow(space);
        if (reserved == 0) {
          this.writers.push(tryWrite);
          return;
        }

        const toSend = p.slice(0, reserved);

        this.send({
          ID: codec.DataID,
          channelID: this.remoteId,
          length: toSend.length,
          data: toSend,
        }).then(() => {
          n += toSend.length;
          p = p.slice(toSend.length);
          if (p.length == 0) {
            resolve(n);
            return;
          }
          this.writers.push(tryWrite);
        })
      }
      tryWrite();
    })
  }

  reserveWindow(win: number): number {
    if (this.remoteWin < win) {
      win = this.remoteWin;
    }
    this.remoteWin -= win;
    return win;
  }

  addWindow(win: number) {
    this.remoteWin += win;
    while (this.remoteWin > 0) {
      const writer = this.writers.shift();
      if (!writer) break;
      writer();
    }
  }

  async closeWrite() {
    this.sentEOF = true;
    await this.send({
      ID: codec.EofID,
      channelID: this.remoteId
    });
    this.writers.forEach(writer => writer());
    this.writers = [];
  }

  async close() {
    this.readBuf.eof();
    if (!this.sentClose) {
      await this.send({
        ID: codec.CloseID,
        channelID: this.remoteId
      });
      this.sentClose = true;
      while (await this.ready.shift() !== null) { }
      return;
    }
    this.shutdown();
  }

  shutdown(): void {
    this.readBuf.close();
    this.writers.forEach(writer => writer());
    this.ready.close();
    this.session.rmCh(this.localId);
  }

  async adjustWindow(n: number) {
    // Since myWindow is managed on our side, and can never exceed
    // the initial window setting, we don't worry about overflow.
    this.myWindow += n;
    await this.send({
      ID: codec.WindowAdjustID,
      channelID: this.remoteId,
      additionalBytes: n,
    })
  }

  send(msg: codec.ChannelMessage): Promise<number> {
    if (this.sentClose) {
      throw "EOF";
    }

    this.sentClose = (msg.ID === codec.CloseID);

    return this.session.enc.encode(msg);
  }

  handle(msg: codec.ChannelMessage): void {
    if (msg.ID === codec.DataID) {
      this.handleData(msg as codec.DataMessage);
      return;
    }
    if (msg.ID === codec.CloseID) {
      this.close();
      return;
    }
    if (msg.ID === codec.EofID) {
      this.readBuf.eof();
    }
    if (msg.ID === codec.OpenFailureID) {
      this.session.rmCh(msg.channelID);
      this.ready.push(false);
      return;
    }
    if (msg.ID === codec.OpenConfirmID) {
      if (msg.maxPacketSize < session.minPacketLength || msg.maxPacketSize > session.maxPacketLength) {
        throw "invalid max packet size";
      }
      this.remoteId = msg.senderID;
      this.maxRemotePayload = msg.maxPacketSize;
      this.addWindow(msg.windowSize);
      this.ready.push(true);
      return;
    }
    if (msg.ID === codec.WindowAdjustID) {
      this.addWindow(msg.additionalBytes);
    }
  }

  handleData(msg: codec.DataMessage) {
    if (msg.length > this.maxIncomingPayload) {
      throw "incoming packet exceeds maximum payload size";
    }

    // TODO: check packet length
    if (this.myWindow < msg.length) {
      throw "remote side wrote too much";
    }

    this.myWindow -= msg.length;

    this.readBuf.write(msg.data)
  }

}

