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

const sqliteLikeToRegExp = (likePattern, isCaseSensitive = false) => {
    const regexString = likePattern
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& inserts the matched character
        .replace(/%/g, '.*') // '%' becomes '.*' (match any character zero or more times)
        .replace(/_/g, '.'); // '_' becomes '.' (match any single character except newline)
    return new RegExp(`^${regexString}$`, isCaseSensitive ? '' : 'i');
}

const unknownCondition = condition => { throw new Error(`unknown condition: ${JSON.stringify(condition)}`) }
const conditions = {
    like: ({value}) => {
        const pattern = sqliteLikeToRegExp(value)
        return fieldval => fieldval.match(pattern)
    },
    "=": ({value}) => fieldval => value === fieldval,
    ">": ({value}) => fieldval => value > fieldval,
    ">=": ({value}) => fieldval => value >= fieldval,
    "<": ({value}) => fieldval => value < fieldval,
    "<=": ({value}) => fieldval => value <= fieldval,
}
const conditionMatcher = condition => (conditions[condition.compare] ?? unknownCondition(condition))(condition)
const fieldConditionsMatcher = (key, conditions) => {
    const matchers = conditions.map(condition => conditionMatcher(condition))
    return record => {
        const value = record.fields[key]
        return matchers.every(matcher => matcher(value))
    }
}
export const criteriaMatcher = criteria => {
    const fieldMatchers = Object.entries(criteria || {}).map(([key, conditions]) => fieldConditionsMatcher(key, conditions))
    return record => fieldMatchers.every(matcher => matcher(record))
}

const recordWriteFromDataURL = (fields, dataURL) => {
    function splitBase64(dataString) {
        const match = /^data:([^;]+);base64,/.exec(dataString);
        return match
            ? { type: match[1], data: dataString.slice(match[0].length) }
            : null;
    }
  
    const {type, data} = splitBase64(dataURL)
    return {
        fields: {
            type: type !== '*/*' ? type : undefined,
            ...fields,
        },
        data,
        encoding: 'base64',
    }
}
  
export const recordWriteFromFile = (fields, file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(recordWriteFromDataURL(fields, reader.result));
        reader.onerror = reject;
        // if we wanted an ArrayBuffer, we would use .readAsArrayBuffer(file);
        reader.readAsDataURL(file);
    })
