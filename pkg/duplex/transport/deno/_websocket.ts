import { StandardWebSocketClient, WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.2/mod.ts";

// THIS NEEDS TO BE REWRITTEN.
// w/websocket may be broken as i run into way too many unhandled/unhandlable errors.
// perhaps std/ws is what should be used...

// @ts-ignore
import * as util from "../../mux/util.ts";

export class Listener {
  wss: WebSocketServer
  q: util.queue<Conn>

  constructor(port: number) {
    this.q = new util.queue();
    this.wss = new WebSocketServer(port);
    this.wss.on("connection", (ws: WebSocketClient) => {
      this.q.push(new Conn(ws));
    })
    this.wss.on("error", (err) => {
      console.log("wss:", err);
    })
  }

  accept(): Promise<Conn | null> {
    return this.q.shift();
  }

  async close(): Promise<void> {
    await this.wss.close();
    this.q.close();
  }
}

export function connect(endpoint: string): Promise<Conn> {
  let ws = new StandardWebSocketClient(endpoint);
  return new Promise<Conn>((resolve) => {
    // TODO errors?
    ws.on("open", function () {
      resolve(new Conn(ws));
    });
  })
}

export class Conn {
  socket: WebSocketClient
  buf: util.ReadBuffer
  isClosed: boolean

  constructor(socket: WebSocketClient) {
    this.isClosed = false;
    this.socket = socket;
    this.buf = new util.ReadBuffer();
    this.socket.on("message", (event: MessageEvent<Blob> | Uint8Array) => {
      if (event instanceof Uint8Array) {
        this.buf.write(event);
        return;
      }
      event.data.arrayBuffer().then((data) => {
        const buf = new Uint8Array(data);
        this.buf.write(buf);
      });
    });
    this.socket.on("close", () => {
      this.isClosed = true;
      this.buf.close();
    });
    //this.socket.onerror = (err) => console.error("qtalk", err);
  }

  read(p: Uint8Array): Promise<number | null> {
    return this.buf.read(p);
  }

  write(p: Uint8Array): Promise<number> {
    this.socket.send(p);
    return Promise.resolve(p.length);
  }

  async close(): Promise<void> {
    if (this.isClosed) {
      return;
    }
    this.isClosed = true;
    this.buf.close();
    if (!this.socket.isClosed) {
      console.log("closing ws socket")
      try {
        await this.socket.closeForce(); //close(1000); // Code 1000: Normal Closure
      } catch (e) {
        console.log("wtf", e)
      }
      console.log("closed ws socket")  
    }
  }
}
