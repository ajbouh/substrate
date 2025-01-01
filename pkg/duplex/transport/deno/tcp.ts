
export class Listener {
  l: Deno.Listener;

  constructor(opts: Deno.ListenOptions) {
    this.l = Deno.listen(opts);
  }

  get port(): number {
    return (this.l.addr as Deno.NetAddr).port;
  }

  async accept(): Promise<Conn | null> {
    return new Conn(await this.l.accept());
  }

  close(): Promise<void> {
    this.l.close();
    return Promise.resolve()
  }
}

export class Conn {
  conn: Deno.Conn;

  constructor(conn: Deno.Conn) {
      this.conn = conn;
  }

  async read(p: Uint8Array): Promise<number | null> {
      let n: number | null;
      try {
          n = await this.conn.read(p);
      } catch (e) {
          if (e instanceof Deno.errors.Interrupted || e instanceof Deno.errors.BadResource) {
              return null;
          }
          throw e;
      }
      return n;
  }

  write(buffer: Uint8Array): Promise<number> {
      return this.conn.write(buffer)
  }

  close() {
      try {
          this.conn.close();
      } catch (e) {
          if (!(e instanceof Deno.errors.BadResource)) {
              throw e;
          }
      }
      return;
  }
}
