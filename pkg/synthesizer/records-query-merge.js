function mergeInPlace(dst, src, mergeFn, keypath = () => []) {
    if (src !== undefined) {
      if (typeof src !== `object`) {
        if (dst === src) {
            return dst
        }
        throw new Error(`cannot merge keypath=${JSON.stringify([...keypath()])} dst=${JSON.stringify(dst)}; src=${JSON.stringify(src)}`)
      }
    
      for (let [key, srcVal] of Object.entries(src)) {
        const dstVal = dst[key]
        if (dstVal !== undefined) {
          srcVal = mergeFn(dstVal, srcVal, mergeFn, () => [...keypath(), key])
        }
        dst[key] = srcVal
      }
    }
    return dst
}

// grandchildren of "where" are concatenated. everything else is blended and duplicates are not tolerated.
export function mergeRecordQueries(...queries) {
    if (queries.length < 2) {
        return queries[0]
    }

    queries = structuredClone(queries);
    const merged = queries.reduce(
        (acc, query) =>
            query
                ? mergeInPlace(
                    acc,
                    query,
                    (a, b, mergeFn, keypathFn) => {
                        const keypath = keypathFn()
                        if (keypath[keypath.length - 2] === "where") {
                            return [...a, ...b]
                        }
                        return mergeInPlace(a, b, mergeFn, keypathFn)
                    },
                )
                : acc, {});
    // console.log("mergeRecordQueries", {merged, queries})
    return merged;
}

export function mergeRecordQuerysets(...querysets) {
    const v = mergeRecordQueries(...querysets)
    // console.log("mergeRecordQuerysets", {querysets, v})
    return v
}
