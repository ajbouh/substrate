// @ts-ignore
import {assertEquals} from "https://deno.land/std/testing/asserts.ts";
// @ts-ignore
import * as session from "./mod.ts";
// @ts-ignore
import * as io from "../../io.ts";
// @ts-ignore
import {Buffer} from "../../buffer.ts";
// @ts-ignore
import * as tcp from "../../transport/deno/tcp.ts";

export async function readAll(r: io.Reader): Promise<Uint8Array> {
  const buf = new Buffer();
  try {
    await buf.readFrom(r);
  } catch (e) {
    throw "wtf";
  }
  return buf.bytes();
}

interface Listener {
  accept(): Promise<io.ReadWriteCloser | null>;
  close(): Promise<void>;
}

async function startListener(listener: Listener) {
  const conn = await listener.accept();
  if (!conn) {
      throw new Error("accept failed")
  }
  const sess = new session.Session(conn);
  const ch = await sess.open();
  const b = await readAll(ch);
  await ch.close();

  const ch2 = await sess.accept();
  if (ch2 === null) {
      throw new Error("accept failed")
  }
  await ch2.write(b);
  await ch2.close();
  try {
      await sess.close();
      await listener.close();
  } catch (e) {
      console.log("listener:", e);
  }
}

async function testExchange(conn: io.ReadWriteCloser) {
  const sess = new session.Session(conn);
  const ch = await sess.accept();
  if (ch === null) {
      throw new Error("accept failed")
  }

  await ch.write(new TextEncoder().encode("Hello world"));
  await ch.closeWrite();
  await ch.close();
  

  const ch2 = await sess.open();
  const b = await readAll(ch2);
  await ch2.close();
  
  assertEquals(new TextEncoder().encode("Hello world"), b);

  await sess.close();
}

Deno.test("tcp", async () => {
  const listener = new tcp.Listener({ port: 0 });
  await Promise.all([
    startListener(listener),
    Deno.connect({ port: listener.port }).then(conn => {
      return testExchange(new tcp.Conn(conn));
    }),
  ]);
});

// Deno.test("websocket", async () => {
//   let endpoint = "ws://127.0.0.1:9999";
//   let listener = new websocket.Listener(9999);
//   await Promise.all([
//       startListener(listener),
//       websocket.connect(endpoint).then(conn => {
//           return testExchange(conn);
//       }),
//   ]);
// });


Deno.test("multiple pending reads", async () => {
  const listener = new tcp.Listener({ port: 0 });

  const conn2p = listener.accept();
  const conn1 = new tcp.Conn(await Deno.connect({ port: listener.port }));
  const conn2 = await conn2p;
  if (conn2 === null) {
    throw new Error("accept failed");
  }

  const sess1 = new session.Session(conn1);
  const sess2 = new session.Session(conn2);

  const ch1p = sess1.accept();
  const ch2 = await sess2.open();
  const ch1 = await ch1p;
  if (ch1 === null) {
      throw new Error("accept failed");
  }


  await ch2.write(new TextEncoder().encode("abc"));

  const a = new Uint8Array(1);
  await ch1.read(a);
  const bc = new Uint8Array(2);
  await ch1.read(bc);

  assertEquals(a, new TextEncoder().encode("a"))
  assertEquals(bc, new TextEncoder().encode("bc"))

  await ch2.closeWrite();
  await ch2.close();
  await sess2.close();

  await ch1.close();
  await sess1.close();

  listener.close();
});
