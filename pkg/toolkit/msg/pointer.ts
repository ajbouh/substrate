import { mergeInPlace } from "./merge.ts"

export function parsePointer(p: Pointer) {
  if (p[0] !== "#" || (p.length > 1 && p[1] !== "/")) {
    throw new Error(`invalid pointer, must start with "#/", got: ${p}`)
  }
  return p.substring(2).split('/').map(s => s.replaceAll("~1", "/").replaceAll("~0", "~"))
}

export function formatPointer(p: Array<string>): Pointer {
  return `#/${p.map(s => s.replaceAll("~", "~0").replaceAll("/", "~1")).join("/")}`
}

export function get(o: any, path: Pointer) {
  const fragments = parsePointer(path)
  return getPath(o, fragments)
}

export function getPath(o: any, fragments: Array<string>) {
  const v = fragments.reduce(
    (acc, fragment) => fragment !== undefined
      ? acc && (Array.isArray(acc) ? acc[+fragment] : acc[fragment])
      : acc,
    o)
  return v
}
  
export function set(r: any, path: Pointer, v: any) {
  const fragments = parsePointer(path)
  return setPath(r, fragments, v)
}

export function setPath(r: any, fragments: Array<string>, v: any) {
  const last = fragments[fragments.length - 1]
  if (fragments.length === 1 && last === "")  {
    return mergeInPlace(r, v)
  }
  let o = r
  for (const fragment of fragments.slice(0, fragments.length - 1)) {
    if (o === undefined && v === undefined) { return } // early return for noop
    if (!(fragment in o)) {
      o[fragment] = (/^[0-9]/.test(fragment)) ? [] : {}
    }
    o = o[fragment]
  }
  // console.log("set", o, path, "<-", v)
  if (o === undefined && v === undefined) { return } // early return for noop
  
  const tv = typeof v
  if (v !== undefined) {
    const ol = o[last]
    if (ol != null && typeof ol === 'object' && tv === 'object') {
      mergeInPlace(ol, v)
    } else {
      o[last] = v
    }
  }
  return r
}

export type Pointer = `#/${string}` // jsonpointer
