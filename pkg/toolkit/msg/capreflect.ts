import { parseLinkHeader } from './http/linkheader.ts'
import { Caps, Env, MsgIndex } from './cap.ts'

interface Reflection {
  msgindex: MsgIndex
  links: Array<Record<string, string>> | null
}

type Link = Record<'url' | string, string>

class ReflectionWalk {
  reflections: Map<string, Promise<Reflection>>
  causes: Map<string, Map<string, Link>>

  constructor(private env: Env) {
    this.reflections = new Map()
    this.causes = new Map()
  }

  recordCause(url: string, causeURL: string, causedLink: Link) {
    let map = this.causes.get(url)
    if (!map) {
      map = new Map()
      this.causes.set(url, map)
    }
    map.set(causeURL, causedLink)
  }

  async reflect(url: string): Promise<Reflection> {
    if (this.reflections.has(url)) {
      return (await this.reflections.get(url))!
    }
  
    const r = this.reflect0(url).then(async reflection => {
      if (reflection.links) {
        await Promise.all(reflection.links.map(async link => {
          if (link.rel === 'reflect' && link.url) { // TODO is this right criteria?
            this.recordCause(link.url, url, link)
            await this.reflect(link.url)
          }
        }))
      }
  
      return reflection
    })

    this.reflections.set(url, r)
    return r
  }

  async reflect0(url: string): Promise<Reflection> {
    const {
      http: {
        response: {
          headers,
          url: responseURL,
          body: {
            commands: msgindex,
          },
        },
      },
    } = await this.env.apply(this.env, {
      cap: 'http',
      http: {
        request: {
          method: 'REFLECT',
          url,
        }
      }
    })

    // add base url to each returned msg
    for (const k in msgindex) {
      msgindex[k] = {
        cap: 'with-urlbase',
        urlbase: responseURL,
        msg: msgindex[k],
        pre: {
          '#/msg/data': '#/data',
        },
        ret: {
          '#': '#/msg'
        }
      }
    }
      
    return {
      links: parseLinkHeader(headers['Link']),
      msgindex,
    }
  }
}
  
export const CapReflect: Caps['reflect'] = async (env, msg) => {
  const walk = new ReflectionWalk(env)
  return {...msg, ...await walk.reflect(msg.url)}
}
