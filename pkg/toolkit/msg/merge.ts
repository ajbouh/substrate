export function mergeInPlace(dst: any, src: any, keypath: () => string[] = () => []) {
  if (src !== undefined) {
    if (typeof src !== `object`) {
      throw new Error(`cannot merge keypath=${JSON.stringify([...keypath()])} dst=${JSON.stringify(dst)}; src=${JSON.stringify(src)}`)
    }
  
    for (let [key, srcVal] of Object.entries(src)) {
      const dstVal = dst[key]
      if (dstVal !== undefined) {
        srcVal = mergeInPlace(dstVal, srcVal, () => [...keypath(), key])
      }
      dst[key] = srcVal
    }
  }
  return dst
}

export function merge<D extends any, Y extends D>(dst: D, src: any): Y {
  return mergeInPlace(dst ? clone(dst) : {}, src)
}

export function clone(o: any) {
  return structuredClone(o)
}
