export class SubstrateBackend {
  //   auth;
  //   index;
  //   files;
  
  constructor(eventsBaseURL) {
    this.auth = null;
    this.files = new EventFSStore(eventsBaseURL);
    if (window.MiniSearch) {
      this.index = new SearchIndex_MiniSearch();
    } else {
      this.index = new SearchIndex_Dumb();
    }
  }
}

export class SearchIndex_MiniSearch {
  indexer; // MiniSearch

  constructor() {
    this.indexer = new MiniSearch({
      idField: "ID",
      fields: ['ID', 'Name', 'Value', 'Value.markdown'], // fields to index for full-text search
      storeFields: ['ID'], // fields to return with search results
      extractField: (document, fieldName) => {
        return fieldName.split('.').reduce((doc, key) => doc && doc[key], document);
      }
    });
  }

  index(node) {
    if (this.indexer.has(node.ID)) {
      this.indexer.replace(node);  
    } else {
      this.indexer.add(node);
    }
  }

  remove(id) {
    try {
      this.indexer.discard(id);
    } catch {}
  }

  search(query) {
    const suggested = this.indexer.autoSuggest(query);
    if (suggested.length === 0) return [];
    return this.indexer.search(suggested[0].suggestion, {
      prefix: true,
      combineWith: 'AND',
    }).map(doc => doc.ID);
  }
}


export class SearchIndex_Dumb {
  constructor() {
    this.nodes = {};
  }

  index(node) {
    this.nodes[node.ID] = node.Name;
  }

  remove(id) {
    delete this.nodes[id];
  }

  search(query) {
    const results = [];
    for (const id in this.nodes) {
      if (this.nodes[id].includes(query)) {
        results.push(id);
      }
    }
    return results;
  }
}

async function demandResponseIsOK(response) {
  if (!response.ok) {
    throw new Error(`response is not ok; status="${response.status} ${response.statusText}"; url=${response.url}; body=${JSON.stringify(await response.text())}`)
  }

  return response
}

async function sha256HexDigest(data) {
  const bytes = new TextEncoder().encode(data);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hashBuffer), (b) => b.toString(16).padStart(2, "0")).join("");
}
  
export class EventFSStore {
    constructor(eventsBaseURL) {
        this.eventsBaseURL = eventsBaseURL
        this.fileDigests = {}
    }

    async _readFile(path) {
      const r = await fetch(`${this.eventsBaseURL}/tree/data/${path}`)
      if (r.status === 404) {
        return null
      }
      await demandResponseIsOK(r)
      return await r.text()
    }

    async _writeFile(path, contents) {
      console.log({path, contents})
      const r = await demandResponseIsOK(await fetch(`${this.eventsBaseURL}/tree/data/${path}`, {
          method: "PUT",
          body: contents
      }))
    }

    async _readAllFiles(pathPrefix) {
      const r = await fetch(`${this.eventsBaseURL}/tree/events/${pathPrefix}`)
      if (r.status === 404) {
        return null
      }

      const {events} = await (await demandResponseIsOK(r)).json()
      console.log({events})
      const files = {}
      for (const {event, data} of events) {
        const path = event.fields.path
        files[path] = data
        this.fileDigests[path] = event.data_sha256
      }

      console.log({files, events, 'this.fileDigests': this.fileDigests})

      return files
    }

  
    async _writeAllFiles(files) {
      const writeEvents = []
      const writeDataDigests = []

      await Promise.all(
        Object.entries(files).map(async ([path, data]) => {
          const hexdigest = await sha256HexDigest(data)
          if (this.fileDigests[path] !== hexdigest) {
            writeEvents.push({
              fields: {path},
              data,
            })
            writeDataDigests.push({path, hexdigest})
          }
        })
      )

      console.log({files, writeEvents, writeDataDigests})

      if (writeEvents.length === 0) {
        return
      }

      await demandResponseIsOK(await fetch(`${this.eventsBaseURL}/`, {
        method: "POST",
        body: JSON.stringify({
          command: "events:write",
          parameters: {
            events: writeEvents,
          },
        }),
      }))

      for (const {path, hexdigest} of writeDataDigests) {
        this.fileDigests[path] = hexdigest
      }
    }

    async _readWorkspace() {
      const prefix = 'workspace/'
      const nodePrefixLen = prefix.length + 'nodes/'.length
      const files = await this._readAllFiles(prefix)
      if (files == null) {
        return null
      }

      const {
        [prefix + 'config']: config,
        ...nodeFiles
      } = files

      console.log({nodeFiles, config})

      return JSON.stringify({
        nodes: Object.values(nodeFiles).map(nodeFile => JSON.parse(nodeFile)),
        ...JSON.parse(config)
      })
    }

    async _writeWorkspace({nodes, ...config}) {
      const prefix = 'workspace/'
      const nodePrefix = prefix + 'nodes/'
      const files = {
        [prefix + 'config']: JSON.stringify(config),
      }

      for (const node of nodes) {
        files[nodePrefix + node.ID] = JSON.stringify(node)
      }
      
      await this._writeAllFiles(files)
    }

    async writeFile(path, contents) {
      console.log("writeFile", path)
      if (path === 'workspace.json') {
        return await this._writeWorkspace(JSON.parse(contents))
      }

      return await this._writeFile(path, contents)
    }

    async readFile(path) {
      console.log("readFile", path)
      if (path === 'workspace.json') {
        return await this._readWorkspace()
      }

      return await this._readFile(path)
    }
  }
  