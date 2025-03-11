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

    return merged;
}

export const sampleRecordQueries = [
    {},
    {view_criteria: {where: {type: [{compare: "=", value: "text"}]}}},
    {view_criteria: {where: {type: [{compare: "like", value: "image%"}]}}},
]

export const samplePanel = {
    fields: {
        type: "panel",
        query: {},
        block: "fields inspector",
    },
}

export const sampleRecords = [
    samplePanel,
    {
        fields: {type: "text", path: "/hello.txt"},
        data: "<b>hello</b>",
    },
    {
        fields: {type: "image", path: "/dots.png"},
        data: "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAE90lEQVR4nOza+1NU5R8HcNbvQS7iAl8xA3JlKzIHIhAhEEQY1CxYVkUcQlpRjCTQVYjJRMBGZ1Jau4loMK1EQWAIDSK35FJBgSE4yUUJCQxLqZGRAhQC+qn3u+kfOJ2Z8/np9ewcj358zuX5fJ4jzPebZ/J3OBt2w8keG+Hg1eVwzfmD8EMBk/DdG16w960HdFoQbN57AH4pdwcc21gGp8Rbwg/ae+EflH7wnS085xwTiYecgNghbC/rxODxsHTYXpkIJ+8pgNcv1cENFxfCWrtpOHru7zxnP/+Pgo0JcMaGGFjjlge3rY2Dw8eXwHHXtsDlI3/Akp8BOQGxQ2Gvc8dg805e69O2fCeE7eQ7ITz7W9jTJhb+X+kh+HttC9ykeBqOmLSAKzechu2z+Hephnm8v+IOPKk+DNevMcKSnwE5AbFD4ZO9GoPr3m6wR+SjPOi5UXiV+8vwgGM27G+SD+ty+mFDphnc9stZ2CpkM9xnw3tmwMsb9nwyAjZun89/9b6HQcnPgJyA2CEMbWUO1p634ewwAR5c8TXc2mcONy/mO2GboR3eVDUGh0Y5wH3xdvDeZZfhxikPOMF9Fl7Q3gb7nEmFox32w5KfATkBsUMoiRnCQFvWAb9/gTWofpcSzs/i87vjBO+NDyJ4Hl0Pawz94vuw2xOsE5Jao+Fyq0/hnuJjcFbIW/BNDye44KkqWPIzICcgdiimi9ljGbnUCA85sedTHWkFu7yogqcaeCKXpPOwNvRZ2GrkS7jSaiWsTGGPaM6wI6wv6IYP/ZQD77epgV+1XMc/+++MpBZyAmKH4oi2CYOkf6z19bXvwpev8HnsW8+a9ZUiUx6TyZ7P3agA+EQg6103I98z/hUDcMO5k3C0pSd8TG8POzzDNVW4Yjks+RmQExA7BM3t1zHw17AGdf5wGDYLDIGLgrj+uWfHGmCiRQ3XlRfDvTu4ForWpPGYZr5nYnub4ePneK3X5sbA6Xmsg3VjX8GSnwE5AbFD8f+j7PdnnOKeQH3Ha/BHhTNwxV72f1Kf57p8Ko37WXmD12Gj9QU4Tj0Cb7VYAQdVcu2kmvwT9kl4BJ55gb2j6nHW0JKfATkBsUN4r4N7W44z7NkfqPoRNuj4u2qCx68LYC91nvPP8Ok+1sRX8rnOKbl3FXat4Xugdoz9pdjScNjYUAv3FO2CnVrk/YH/Tkg+AcF1LevRWf0nsGKNL3xygHthcaoSuCtVA492sp/zTUoSHFHCwnlgLu+HbnUuXKBcBPtpv4AfU/Pd0pvDeya7knW55GdATkDsUNgrP8Ng4QSf64Ke+7K+xeNw0yIe3z/WCpcc4Rr9u2Z+g/Tb4Sl4Yz77oeY2XHf9msF1181bH8PTRZWw46lk2MXI/pLkZ0BOQOwQ0mf7MKgoZF9osJv3gG0oa4DwPfxmbtMb/F5ofSb3vFqiQuGkt1lbOze5wNMGXt+jS3hMaaIrHF9rCweG8X4zm10GS34G5ATEDoXdtmsYuJVyf3d5Na8/00T2K4Nj+Zw28a0Dj0byOra7yH6RhSYSLjwYAzdMcb1knsw6OLGL99tK62p4t5r9pfSz/O5I8jMgJyB2CJmTZzAw+E3An19lTWyqyoPfvOEP1wXwWyDb+8fhWVfWCV1efPbvU/IZb/kO9yXqV/G7o84o1tOeS/nsD7CO4u+XFsCSnwE5AbHjrwAAAP//P4x5B+X0uUIAAAAASUVORK5CYII=",
        encoding: 'base64',
    },
    {
        fields: {"somefield": "somevalue"},
        data: "somedata2",
    },
];
