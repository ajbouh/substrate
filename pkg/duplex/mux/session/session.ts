// @ts-ignore
import * as codec from "../codec/mod.ts";
// @ts-ignore
import * as util from "../util.ts";
// @ts-ignore
import * as io from "../../io.ts";
// @ts-ignore
import * as session from "./mod.ts";

export const minPacketLength = 9;
export const maxPacketLength = Number.MAX_VALUE;


export class Session {
    conn: io.ReadWriteCloser;
    channels: Array<session.Channel>;
    incoming: util.queue<session.Channel>;
    enc: codec.Encoder;
    dec: codec.Decoder;
    done: Promise<void>;
    closed: boolean;

    constructor(conn: io.ReadWriteCloser) {
        this.conn = conn;
        this.enc = new codec.Encoder(conn as io.Writer);
        this.dec = new codec.Decoder(conn as io.Reader);
        this.channels = [];
        this.incoming = new util.queue();
        this.done = this.loop();
        this.closed = false;
    }

    async open(): Promise<session.Channel> {
        const ch = this.newChannel();
        ch.maxIncomingPayload = session.channelMaxPacket;
        await this.enc.encode({
            ID: codec.OpenID,
            windowSize: ch.myWindow,
            maxPacketSize: ch.maxIncomingPayload,
            senderID: ch.localId
        });
        if (await ch.ready.shift()) {
            return ch;
        }
        throw "failed to open";
    }

    accept(): Promise<session.Channel | null> {
        return this.incoming.shift();
    }

    async close(): Promise<void> {
        for (const ids of Object.keys(this.channels)) {
            const id = parseInt(ids);
            if (this.channels[id] !== undefined) {
                this.channels[id].shutdown();
            }
        }
        this.conn.close();
        this.closed = true;
        await this.done;
    }

    async loop() {
        try {
            while (true) {
                const msg = await this.dec.decode();
                if (msg === null) {
                    this.close();
                    return;
                }
                if (msg.ID === codec.OpenID) {
                    await this.handleOpen(msg as codec.OpenMessage);
                    continue;
                }
                
                const cmsg: codec.ChannelMessage = msg as codec.ChannelMessage;

                const ch = this.getCh(cmsg.channelID);
                if (ch === undefined) {
                    if (this.closed) {
                        return;
                    }
                    console.warn(`invalid channel (${cmsg.channelID}) on op ${cmsg.ID}`);
                    continue;
                }
                await ch.handle(cmsg);
            }
        } catch (e) {
            if (e.message && e.message.contains && e.message.contains("Connection reset by peer")) {
                return;
            }
            throw e;
        }
    }

    async handleOpen(msg: codec.OpenMessage) {
        if (msg.maxPacketSize < minPacketLength || msg.maxPacketSize > maxPacketLength) {
            await this.enc.encode({
                ID: codec.OpenFailureID,
                channelID: msg.senderID
            });
            return;
        }
        const c = this.newChannel();
        c.remoteId = msg.senderID;
        c.maxRemotePayload = msg.maxPacketSize;
        c.remoteWin = msg.windowSize;
        c.maxIncomingPayload = session.channelMaxPacket;
        this.incoming.push(c);
        await this.enc.encode({
            ID: codec.OpenConfirmID,
            channelID: c.remoteId,
            senderID: c.localId,
            windowSize: c.myWindow,
            maxPacketSize: c.maxIncomingPayload
        });
    }

    newChannel(): session.Channel {
        const ch = new session.Channel(this);
        ch.remoteWin = 0;
        ch.myWindow = session.channelWindowSize;
        ch.localId = this.addCh(ch);
        return ch;
    }

    getCh(id: number): session.Channel {
        const ch = this.channels[id];
        if (ch && ch.localId !== id) {
            console.log("bad ids:", id, ch.localId, ch.remoteId);
        }
        return ch;
    }

    addCh(ch: session.Channel): number {
        this.channels.forEach((v, i) => {
            if (v === undefined) {
                this.channels[i] = ch;
                return i;
            }
        });
        this.channels.push(ch);
        return this.channels.length - 1;
    }

    rmCh(id: number): void {
        delete this.channels[id];
    }

}

