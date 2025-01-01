
export function connect(addr: string, onclose?: () => void): Promise<Conn> {
  return new Promise((resolve) => {
      const socket = new WebSocket(addr);
      socket.onopen = () => resolve(new Conn(socket));
      //socket.onerror = (err) => console.error("qtalk", err);
      if (onclose) socket.onclose = onclose;
  })
}

export class Conn {
  ws: WebSocket
  waiters: Array<() => void>
  chunks: Array<Uint8Array>;
  isClosed: boolean

  constructor(ws: WebSocket) {
    this.isClosed = false;
    this.waiters = [];
    this.chunks = [];
    this.ws = ws;
    this.ws.binaryType = "arraybuffer";
    this.ws.onmessage = (event) => {
      const chunk = new Uint8Array(event.data);
      this.chunks.push(chunk);
      if (this.waiters.length > 0) {
        const waiter = this.waiters.shift();
        if (waiter) waiter();
      }
    };
    const onclose = this.ws.onclose;
    this.ws.onclose = (e: CloseEvent) => {
      if (onclose) onclose.bind(this.ws)(e);
      this.close();
    }
  }

  read(p: Uint8Array): Promise<number | null> {
    return new Promise((resolve) => {
      var tryRead = () => {
        if (this.isClosed) {
          resolve(null);
          return;
        }
        if (this.chunks.length === 0) {
          this.waiters.push(tryRead);
          return;
        }
        let written = 0;
        while (written < p.length) {
          const chunk = this.chunks.shift();
          if (chunk === null || chunk === undefined) {
            resolve(written);
            return;
          }
          const buf = chunk.slice(0, p.length-written);
          p.set(buf, written)
          written += buf.length;
          if (chunk.length > buf.length) {
            const restchunk = chunk.slice(buf.length);
            this.chunks.unshift(restchunk);
          }
        }
        resolve(written);
        return;
      }
      tryRead();
    });
  }

  write(p: Uint8Array): Promise<number> {
    this.ws.send(p);
    return Promise.resolve(p.byteLength);
  }

  close() {
    if (this.isClosed) return;
    this.isClosed = true;
    this.waiters.forEach(waiter => waiter());
    this.ws.close();
  }
}
