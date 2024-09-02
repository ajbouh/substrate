function debug(s: string): string {
  console.log(s)
  return s
}

const screenshotService = "screenshot"

import { env as publicEnv } from '$env/dynamic/public'
import { base } from '$app/paths'

// import { browser } from '$app/environment'

const domOrigin = publicEnv.PUBLIC_EXTERNAL_ORIGIN
const fetchOrigin = publicEnv.PUBLIC_EXTERNAL_ORIGIN

export async function fetchJSONRaw<T=any> (fetch: any, url: string, options?: any): Promise<{url: string; body: T; headers: Headers; status: number}> {
  options = {...options}
  options.headers = { ...options.headers }
  // options.headers['accept'] = 'application/json'

  if (options.body) {
    if (!(options.body instanceof FormData)) {
      options.body = JSON.stringify(options.body)
      options.headers['content-type'] = 'application/json'
    }
  }
  // if (!options.credentials) {
  //   options.credentials = 'same-origin'
  // }

  const r = await fetch(url, options)
  if (r.status < 200 || r.status > 299) {
    throw new Error(`non-200 HTTP status ${r.status} from ${options.method || 'GET'} ${url} (${r.url}): ${await r.text()}`)
  }
  const text = await r.text()
  try {
    return {
      url: r.url,
      headers: r.headers,
      body: JSON.parse(text) as T,
      status: r.status,
    }
  } catch (e) {
    throw new Error(`error parsing: ${e}; ${text}`)
  }
}

export async function fetchJSON<T=any> (fetch: any, url: string, options?: any): Promise<T> {
  const { body } = await fetchJSONRaw<T>(fetch, url, options)
  return body
}

export function processSpaces(spaces: {spaces: any[]}) {
  return spaces?.spaces.map(space => ({space: space.space_id, created_at: new Date(Date.parse(space.created_at))})) || []
}

export function processServiceSpecs(servicespecs: any[]) {
  return servicespecs
}

export function processActivities(activities: any[]) {
  return activities.map(activity => ({...activity, created_at: new Date(Date.parse(activity.created_at))}))
}

export function processEvents(events: any[]) {
  events = events.map(event => ({...event, ts: new Date(Date.parse(event.ts))}))
  events.sort((a, b) => b.ts - a.ts)

  return events
}

export function processServices(services: Record<string, object>) {
  return Object.entries(services).map(([name, service]) => ({name, label: name, ...service}))
}

export const urls = {
  ui: {
    home: () => `${base}/`,
    spaces: () => `${base}/spaces`,
    events: () => `${base}/events`,
    user: ({ user }: {user: string}) => `${base}/@${user}`,
    userSpaces: ({ user }: {user: string}) => `${base}/@${user}/spaces`,
    userCollections: ({ user }: {user: string}) => `${base}/@${user}/collections`,
    collection: ({ owner, name }: {owner: string, name: string}) => `${base}/@${owner}/collections/${name}`,
    space: ({ space }: {space: string}) => `${base}/spaces/${space}`,
    service: ({ name }: {name: string}) => `${base}/services/${name}`,
    activity: ({ activityspec }: { activityspec: string }) => `${base}/activity/${activityspec}`,
  },
  gateway: {
    activity: ({ activityspec }: { activityspec: string }) => {
      return `${fetchOrigin}/${activityspec}`
    },
  },
  api: {
    activities: ({}: {}) => debug(`${fetchOrigin}/substrate/v1/activities`),
    space: ({ space }: { space: string}) => debug(`${fetchOrigin}/substrate/v1/spaces/${space}`),
    activity: ({ activityspec }: { activityspec: string }) => debug(`${fetchOrigin}/substrate/v1/activities/${activityspec}`),

    collectionSpaceMembership: ({ owner, name, space }: { owner: string; name: string; space?: string }) => debug(
      space
      ? `${fetchOrigin}/substrate/v1/collections/${owner}/${name}/spaces/${space}`
      : `${fetchOrigin}/substrate/v1/collections/${owner}/${name}/spaces`,
    ),
    collectionServiceMembership: ({ owner, name, servicespec }: { owner: string; name: string; servicespec?: string }) => debug(
      servicespec
      ? `${fetchOrigin}/substrate/v1/collections/${owner}/${name}/servicespecs/${servicespec}`
      : `${fetchOrigin}/substrate/v1/collections/${owner}/${name}/servicespecs`,
    ),
    collections: ({ owner }: { owner: string }) => debug(
      `${fetchOrigin}/substrate/v1/collections/${owner}`,
    ),
    collection: ({ owner, name }: { owner: string, name: string }) => debug(
      `${fetchOrigin}/substrate/v1/collections/${owner}/${name}`,
    ),
    spaces: ({ owner }: { owner?: string}) => debug([
      `${fetchOrigin}/substrate/v1/spaces?`,
      ...(owner? [`owner=${owner}`]:[]),
    ].join("")),
    events: ({ user }: { user?: string}) => debug([
      `${fetchOrigin}/substrate/v1/events?`,
      ...(user? [`user=${user}`]:[]),
    ].join("")),
    spawn: ({}: {}) => debug(`${fetchOrigin}/substrate/v1/activities`),
    screenshotServiceURL: ({}: {}) => `${domOrigin}/${screenshotService}/`, // TODO don't hardcode "screenshot"
    spaceExploreURL: ({ origin, space, previewFile }: { origin?: string; space: string; previewFile?: string }) => `${origin || domOrigin}/files%3Bdata=${space}/`,
    spacePreviewURL: ({ origin, space, previewFile }: { origin?: string; space: string; previewFile?: string }) => `${origin || domOrigin}/visualizer%3Bdata=${space}/`,
    activityPreviewURL: ({ origin, activity, previewFile }: { origin?: string; activity: string; previewFile?: string }) => `${origin || domOrigin}/${activity}/`,
    thumbnailPreviewURL: ({ space, activity, previewFile }: { activity: string; space: string; previewFile?: string }) =>
      space
      ? `${urls.api.screenshotServiceURL({})}?wait=networkIdle&url=${urls.api.spacePreviewURL({ space, origin: '$origin', previewFile })}`
      : activity
          ? `${urls.api.screenshotServiceURL({})}?wait=networkIdle&url=${urls.api.activityPreviewURL({ activity, origin: '$origin', previewFile })}`
          : undefined

  }
}
