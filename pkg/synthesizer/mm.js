// mm = mux map
export const mmNew = (elseFn = (id) => {}) => {
    return {
        elseFn,
        map: new Map(),
        get(key) {
            return this.map.get(key) ?? this.elseFn(key)
        },
        has(key) {
            return this.map.has(key)
        },
        keys() {
            return this.map.keys()
        },
        set(key, val) {
            return this.update(map => map.set(key, val))
        },
        update(f) {
            f(this.map)
            return {...this}
        },
    }
}

export const mmUpdater = (muxValKeyFn, updater) => 
    (muxNow, muxVal) => {
        const key = muxValKeyFn(muxVal)
        const val = updater(muxNow.get(key), muxVal, muxNow) ?? muxNow.elseFn()
        return muxNow.set(key, val)
    }


export const mmBulkUpdater = (muxValEntriesFn, updater, updated) => 
    (muxNow, muxVal) => {
        let valEntries = muxValEntriesFn(muxVal)
        const entries = valEntries.map(
            ([k, v]) => {
                const vNow = muxNow.get(k)
                const vNext = updater(vNow, v, k, muxNow) ?? muxNow.elseFn()
                return vNow !== vNext ? [k, vNext] : undefined
            }
        ).filter(d => d)

        if (entries.length === 0) {
            return muxNow
        }

        if (updated) {
            updated(entries)
        }

        return muxNow.update(map => entries.forEach(([k, v]) => map.set(k, v)))
    }

