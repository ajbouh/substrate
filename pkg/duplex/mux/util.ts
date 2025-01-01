
export function concat(list: Uint8Array[], totalLength: number): Uint8Array {
  const buf = new Uint8Array(totalLength);
  let offset = 0;
  list.forEach((el) => {
    buf.set(el, offset);
    offset += el.length;
  });
  return buf;
}

// queue primitive for incoming connections and
// signaling channel ready state.
export class queue<ValueType> {
  q: Array<ValueType>
  waiters: Array<(a: ValueType | null) => void>
  closed: boolean

  constructor() {
    this.q = [];
    this.waiters = [];
    this.closed = false;
  }

  push(obj: ValueType) {
    if (this.closed) throw "closed queue";
    if (this.waiters.length > 0) {
      const waiter = this.waiters.shift()
      if (waiter) waiter(obj);
      return;
    }
    this.q.push(obj);
  }

  shift(): Promise<ValueType | null> {
    if (this.closed) return Promise.resolve(null);
    return new Promise(resolve => {
      if (this.q.length > 0) {
        resolve(this.q.shift() || null);
        return;
      }
      this.waiters.push(resolve);
    })
  }

  close() {
    if (this.closed) return;
    this.closed = true;
    this.waiters.forEach(waiter => {
      waiter(null);
    });
  }
}

export class ReadBuffer {
  gotEOF: boolean;
  readBuf: Uint8Array | undefined;
  readers: Array<() => void>;

  constructor() {
    this.readBuf = new Uint8Array(0);
    this.gotEOF = false;
    this.readers = [];
  }

  read(p: Uint8Array): Promise<number | null> {
    return new Promise(resolve => {
      let tryRead = () => {
        if (this.readBuf === undefined) {
          // received a close or EOF already resolved
          resolve(null);
          return;
        }
        if (this.readBuf.length == 0) {
          if (this.gotEOF) {
            this.readBuf = undefined;
            resolve(null);
            return;
          }
          this.readers.push(tryRead);
          return;
        }
        const data = this.readBuf.slice(0, p.length);
        this.readBuf = this.readBuf.slice(data.length);
        if (this.readBuf.length == 0 && this.gotEOF) {
          this.readBuf = undefined;
        }
        p.set(data);
        resolve(data.length);
      }
      tryRead();
    });
  }

  write(p: Uint8Array): Promise<number> {
    if (this.readBuf) {
      this.readBuf = concat([this.readBuf, p], this.readBuf.length + p.length);
    }

    while (!this.readBuf || this.readBuf.length > 0) {
      let reader = this.readers.shift();
      if (!reader) break;
      reader();
    }

    return Promise.resolve(p.length);
  }

  eof() {
    this.gotEOF = true;
    this.flushReaders();
  }

  close() {
    this.readBuf = undefined;
    this.flushReaders();
  }

  protected flushReaders() {
    while (true) {
      const reader = this.readers.shift();
      if (!reader) return;
      reader();
    }
  }
}
