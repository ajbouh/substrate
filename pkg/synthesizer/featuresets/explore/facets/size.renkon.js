const sizeFacet = (() => {
    const formatSize = (bytes, decimals) => {
        if (bytes == 0) return '0 bytes'
        const k = 1024,
            dm = decimals <= 0 ? 0 : decimals || 2,
            sizes = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    }

    return {
        label: 'Data Size',
        render: ({record}) => record.data_size !== undefined ? formatSize(record.data_size) : '',
    }
})()
