
export interface Reader {
  /** Reads up to `p.byteLength` bytes into `p`. It resolves to the number of
   * bytes read (`0` < `n` <= `p.byteLength`) and rejects if any error
   * encountered. Even if `read()` resolves to `n` < `p.byteLength`, it may
   * use all of `p` as scratch space during the call. If some data is
   * available but not `p.byteLength` bytes, `read()` conventionally resolves
   * to what is available instead of waiting for more.
   *
   * When `read()` encounters end-of-file condition, it resolves to EOF
   * (`null`).
   *
   * When `read()` encounters an error, it rejects with an error.
   *
   * Callers should always process the `n` > `0` bytes returned before
   * considering the EOF (`null`). Doing so correctly handles I/O errors that
   * happen after reading some bytes and also both of the allowed EOF
   * behaviors.
   *
   * Implementations should not retain a reference to `p`.
   *
   * Use iter() from https://deno.land/std/io/util.ts to turn a Reader into an
   * AsyncIterator.
   */
  read(p: Uint8Array): Promise<number | null>;
}

export interface Writer {
  /** Writes `p.byteLength` bytes from `p` to the underlying data stream. It
   * resolves to the number of bytes written from `p` (`0` <= `n` <=
   * `p.byteLength`) or reject with the error encountered that caused the
   * write to stop early. `write()` must reject with a non-null error if
   * would resolve to `n` < `p.byteLength`. `write()` must not modify the
   * slice data, even temporarily.
   *
   * Implementations should not retain a reference to `p`.
   */
  write(p: Uint8Array): Promise<number>;
}

export interface Closer {
  close(): void;
}

export interface ReadWriter extends Reader, Writer {}
export interface ReadWriteCloser extends ReadWriter, Closer {}

export interface WriterSync {
  writeSync(p: Uint8Array): number;
}

export interface ReaderSync {
  readSync(p: Uint8Array): number | null;
}

export const EOF = null;

// TODO: use deno implementation, https://deno.land/std@0.192.0/streams/copy.ts?s=copy
export async function copy(dst: Writer, src: Reader): Promise<number> {
  const buf = new Uint8Array(32 * 1024);
  let written: number = 0;
  while (true) {
    const n = await src.read(buf);
    if (n === EOF) {
      break;
    }
    written += await dst.write(buf.subarray(0, n));
  }
  return written;
}