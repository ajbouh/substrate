
export interface ServiceActivity {
  activity: string
  label: string
  description?: string
  image?: string
  priority?: number

  request?: {
    interactive?: boolean
    path: string
    method?: string

    schema: RequestSchema
  }

  response?: {
    schema: ResponseSchema
  }
}

type ResponseSchema = Record<string, ResponseFieldDef>
type RequestSchema = Record<string, RequestParameterDef>
type ServiceSpawnSchema = Record<string, ServiceSpawnParameterDef>

interface ResponseFieldDef {
  type: "space" // "collection" | "file", and what else?
  from: string
  path: string[]
}

interface RunContext {
  fetch: any
}

interface RequestParameterDef {
  type: string
  body: string[] | string[][]
  query: string | string[]
  path: string | string[]
  default: string
  optional?: boolean
}

interface ServiceSpawnParameterDef {
  type: "space" | "spaces" // should it be collection instead of spaces?
  optional?: boolean
  description?: string
  default: string
}

interface ServiceSpawn {
  jamsocket: {
    service: string
    env: Record<string, string>
  }
  schema: ServiceSpawnSchema
}

export interface Service {
  name: string
  spawn: ServiceSpawn
  activities: Record<string, ServiceActivity>
}

interface ActivityCommand {
  activity: ServiceActivity
  spawn: ServiceSpawn
  serviceName: string

  parameterSelectionBindings? : Record<string, Selection>
  unusedSelections? : Selection[]

  serviceParameters: Record<string, (rc: RunContext) => Promise<string>>
  requestParameters: Record<string, (rc: RunContext) => Promise<string>>
  freeParameterNames: string[]
}

type SpaceView = { space: { space: string } } | { spaces: { space: string }[] }

export interface CommandSelection {
  user: string
  space?: {
    space: string
    owner: string
    memberships?: Membership[]
  }
  service?: {
    name: string
    label: string
    memberships?: Membership[]
  }
  activity?: {
    id: string
    activity: string
    service: string
    views: Record<string, SpaceView>
    schema: {
      spawn: ServiceSpawnSchema
    }
  }
  collection?: {
    owner: string
    name: string
    label: string
  }
  optional?: Record<'space' | 'service' | 'spaces', boolean>
}

export interface Command {
  id: string
  title: string

  // image?: string
  children ?: Command[]

  handler?:  () => Promise<unknown>

  keywords?: string
  section?: string
  hotkey?: string

  response: () => Promise<Record<string, unknown>>
  request ?: {
    href?: () => Promise<string>

    run: () => Promise<unknown>
  }
}

interface CommandSet {
  context?: string
  commands: Command[]
}

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

export function processSpaces(spaces: any[]) {
  return spaces.map(space => ({...space, created_at: new Date(Date.parse(space.created_at))}))
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
    services: ({}: {}) => debug(`${fetchOrigin}/substrate/v1/services`),
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

function activityHasLabel() {
  return (a: ActivityCommand) => !!a.activity.label
}

function activityHasAnyPrefix(...prefixes: string[]) {
  return (a: ActivityCommand) => prefixes.some(prefix => a.activity.activity.startsWith(prefix))
}

function* everyPossibleActivity(services: Service[]): Generator<ActivityCommand> {
  for (const { name, spawn, activities } of services) {
    for (const activity of Object.values(activities || {})) {
      yield {
        activity,
        spawn,
        serviceName: name,
        freeParameterNames: [
          ...(spawn.schema ? Object.keys(spawn.schema) : []),
          ...(activity.request?.schema ? Object.keys(activity.request?.schema) : []),
        ],
        serviceParameters: {},
        requestParameters: {},
      }
    }
  }
}

interface Selection {
  type: "space" | "spaces"
  value: (rc: RunContext) => Promise<string>
}

function* everyPossibleActivityUsingAllSelections0(activity: ActivityCommand): Generator<ActivityCommand> {
  // return a list of activities that can POSSIBLY fit selections, *with known values*
  //  IFF spawn schema can be completely satisfied by selections
  // return 

  yield activity
  
  // If we don't have any selections or free parameters left, then yield the activity we have. That's the best we'll do!
  const freeParameters = activity.freeParameterNames
  const unusedSelections = activity.unusedSelections || []

  if (unusedSelections.length === 0 || freeParameters.length === 0) {
    return
  }

  // Once activities have request schemas, we'll want to include those too.
  const firstFree = freeParameters[0]
  const firstFreeSpawnDef = activity.spawn.schema && activity.spawn.schema[firstFree]
  const firstFreeRequestDef = activity.activity.request?.schema && activity.activity.request?.schema[firstFree]
  const restFree = freeParameters.slice(1)

  // For every selection, yield enumerate all activities applying it to the *first* free parameter, if it matches.
  for (let i = 0; i<unusedSelections.length; ++i) {
    const selection = unusedSelections[i]

    if (!firstFreeSpawnDef && !firstFreeRequestDef) {
      console.log(`internal error: no spawn parameter or request parameter with name ${firstFree}`)
      continue
    }

    let useAsSpawnParameter = false
    if (firstFreeSpawnDef) {
      if (firstFreeSpawnDef.type === selection.type) {
        useAsSpawnParameter = true
        console.log(`using ${JSON.stringify(selection)} as ${JSON.stringify(firstFreeSpawnDef)}`)
      } else {
        console.log(`can't use ${JSON.stringify(selection)} as ${JSON.stringify(firstFreeSpawnDef)}`)
      }
    }

    let useAsRequestParameter = false
    if (firstFreeRequestDef) {
      if (firstFreeRequestDef.type === selection.type) {
        useAsRequestParameter = true
        console.log(`using ${JSON.stringify(selection)} as ${JSON.stringify(firstFreeRequestDef)}`)
      } else {
        console.log(`can't use ${JSON.stringify(selection)} as ${JSON.stringify(firstFreeRequestDef)}`)
      }
    }

    if (!useAsRequestParameter && !useAsSpawnParameter) {
      continue
    }

    for (const a of everyPossibleActivityUsingAllSelections0({
      ...activity,
      unusedSelections: unusedSelections.filter((_, j) => j !== i),
      freeParameterNames: restFree,
      parameterSelectionBindings: {
        ...activity.parameterSelectionBindings,
        [firstFree]: selection,
      },
      serviceParameters: useAsSpawnParameter
        ? {
          ...activity.serviceParameters,
          [firstFree]: selection.value,
        }
        : activity.serviceParameters,
      requestParameters: useAsRequestParameter
        ? {
          ...activity.requestParameters,
          [firstFree]: selection.value,
        }
        : activity.requestParameters,
    })) {
      yield a
    }
  }
}

function everyPossibleActivityForSelections(...selections: Selection[]) {
  return function(activity: ActivityCommand): Generator<ActivityCommand> {
    return everyPossibleActivityUsingAllSelections0(
      {
        ...activity,
        unusedSelections: selections,
        parameterSelectionBindings: {},
      },
    )
  }
}

function *matchingActivityCommands(
  services: Record<string, Service>,
  enumerators: Array<(services: Service[]) => Generator<ActivityCommand>>,
  qualifiers: Array<(activity: ActivityCommand) => boolean>,
  hypothesizers: Array<(activity: ActivityCommand) => Generator<ActivityCommand>>,
  filter: (activity: ActivityCommand) => boolean,
): Generator<ActivityCommand> {
  const serviceList = Object.values(services)
  for (const enumerator of enumerators) {
    baseActivity:
    for (const baseActivity of enumerator(serviceList)) {
      for (const qualifier of qualifiers) {
        if (!qualifier(baseActivity)) {
          // console.log("disqualifying", baseActivity, "due to", qualifier)
          continue baseActivity
        }
      }
      // console.log("qualified", baseActivity)

      for (const hypothesizer of hypothesizers) {
        // console.log("hypothesizing", baseActivity, "with", hypothesizer)
        for (const activity of hypothesizer(baseActivity))  {
          // console.log("hypothesized", activity)
          if (filter(activity)) {
            // console.log("keeping", activity)
            yield activity
          }
        }
      }
    }
  }
}

function matchingActivityCommandList(
  services: Record<string, Service>,
  enumerators: Array<(services: Service[]) => Generator<ActivityCommand>>,
  qualifiers: Array<(activity: ActivityCommand) => boolean>,
  hypothesizers: Array<(activity: ActivityCommand) => Generator<ActivityCommand>>,
  filter: (activity: ActivityCommand) => boolean,
  ttl: number,
): Command[] {
  if (ttl === 0) {
    return []
  }

  const activities: ActivityCommand[] = []
  for (const activity of matchingActivityCommands(services, enumerators, qualifiers, hypothesizers, filter)) {
    activities.push(activity)
  }

  activities.sort((a, b) => (b.activity.priority || 0) - (a.activity.priority || 0))

  const commands = activities.map(ac => {
    const request = activityRequestToCommandRequest(ac)

    let cachedRunP: undefined | Promise<unknown>
    const cachedRun = async (rc: RunContext): Promise<unknown> => {
      if (!cachedRunP) {
        const runP = request.run(rc)
        cachedRunP = runP
        cachedRunP.then(undefined, () => {
          if (cachedRunP === runP) {
            cachedRunP = undefined
          }
        })
      }

      return await cachedRunP
    }

    const responseSchema = ac.activity.response?.schema
    const response = async (rc: RunContext): Promise<Record<string, unknown>> => {
      if (!responseSchema) {
        return {}
      }

      const raw = await cachedRun(rc) as any
      const o: Record<string, unknown> = {}

      for (const [k, v] of Object.entries(responseSchema)) {
        switch (v.from) {
          case 'body': {
            o[k] = v.path.reduce((acc, p) => acc[p], raw.body)
            break
          }
          case 'header': {
            // TODO
            break
          }
        }
      }

      console.log({raw, response: o})

      return o
    }

    const children = activityRequestToSubcommands(services, responseSchema, response, ttl)

    return {
      id: ac.activity.label,
      title: ac.activity.label,
      // image: ac.activity.image,
      // description: ac.activity.description,
      children,

      priority: ac.activity.priority,
      request,
      response,
    }
  })

  console.log({ commands, ttl, activities })

  return commands
}

function renderServiceParameters(views: Record<string, SpaceView>): Record<string, string> {
  const serviceParameters: Record<string, string> = {}
  for (const [k, v] of Object.entries(views)) {
    if ('single' in v && v.single) {
      serviceParameters[k] = v.single.space
    } else if ('multi' in v && v.multi) {
      serviceParameters[k] = "," + v.multi.map(o => o.space).join(",")
    }
  }

  return serviceParameters
}

function renderActivitySpecFor(serviceName: string, serviceParameters: Record<string, string>, path: string, query: URLSearchParams): string {
  const serviceParameterEntries = Object.entries(serviceParameters).map(([k, v]) => `${k}=${v}`).join(";")
  let s: string
  if (serviceParameterEntries) {
    s = `${serviceName}[${serviceParameterEntries}]`
  } else {
    s = serviceName
  }

  if (path) {
    s = s + path
  }

  if (query) {
    s = s + "?" + query.toString()
  }

  return s
}

function svgImageURL(src: string): string {
  return `data:image/svg+xml;utf8,${src.replace(/\n/g, '')}`
}

const starredCollectionImage = svgImageURL(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
  <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clip-rule="evenodd" />
</svg>`)

const addToCollectionImage = svgImageURL(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
  <path d="M5.127 3.502L5.25 3.5h9.5c.041 0 .082 0 .123.002A2.251 2.251 0 0012.75 2h-5.5a2.25 2.25 0 00-2.123 1.502zM1 10.25A2.25 2.25 0 013.25 8h13.5A2.25 2.25 0 0119 10.25v5.5A2.25 2.25 0 0116.75 18H3.25A2.25 2.25 0 011 15.75v-5.5zM3.25 6.5c-.04 0-.082 0-.123.002A2.25 2.25 0 015.25 5h9.5c.98 0 1.814.627 2.123 1.502a3.819 3.819 0 00-.123-.002H3.25z" />
</svg>
`)

interface DefaultCollection {
  label: string
  name: string
  image: string
}

interface Membership {
  collection_owner: string
  collection_name: string
  collection_label: string
}

function activityRequestToSubcommands(
  services: Record<string, Service>,
  schema: ResponseSchema | undefined,
  responseThunk: (rc: RunContext) => Promise<Record<string, unknown>>,
  ttl: number,
): Command[] | undefined {
  if (!schema) {
    return undefined
  }

  const subcommands: Command[] = []
  for (const [k, out] of Object.entries(schema)) {
    for (const command of matchingActivityCommandList(services,
      [everyPossibleActivity],
      [activityHasLabel(), activityHasAnyPrefix("user:")],
      [everyPossibleActivityForSelections({
        type: out.type,
        value: async (rc: RunContext) => (await responseThunk(rc))[k] as string
      })],
      mustUseRequiredSelectionsAndSpecifyAllRequiredParameters(),
      ttl - 1,
    )) {
      subcommands.push(command)
    }
  }

  return subcommands
}

function activityRequestToCommandRequest(ac: ActivityCommand) {
  const activityRequest = ac.activity.request || {
    path: '/',
    method: 'get',
    schema: {},
  }

  const viewspec = async (rc: RunContext, path: string, query: URLSearchParams) => {
    // TODO need to switch viewspec to a promise
    const serviceParameters: Record<string, string> = {}
    for (const [k, v] of Object.entries(ac.serviceParameters)) {
      serviceParameters[k] = await v(rc)
    }

    return renderActivitySpecFor(ac.serviceName, serviceParameters, path, query)
  }

  const method = activityRequest.method

  let hasBody = Object.entries(activityRequest.schema || {}).some(([k, v]) => v.body)

  const prepare = async (rc: RunContext) => {
    let body = undefined

    const requestParameters: Record<string, string> = {}
    for (const [k, v] of Object.entries(ac.requestParameters)) {
      requestParameters[k] = await v(rc)
    }

    const query = new URLSearchParams()
    let path = activityRequest.path

    if (activityRequest.schema) {
      for (const [k, schema] of Object.entries(activityRequest.schema)) {
        const parameter = requestParameters[k] || schema.default
        if (schema.body) {
          if (Array.isArray(schema.body)) {
            let bodyFields: string[][] = []
            if (Array.isArray(schema.body[0])) {
              bodyFields = schema.body as string[][]
            } else {
              bodyFields = [schema.body] as string[][]
            }
            if (!body) {
              body = {} as Record<string, any>
            }
            for (const bodyField of bodyFields) {
              let o = body
              for (const f of bodyField.slice(0, -1)) {
                if (!(f in o)) {
                  o[f] = {}
                }
                o = o[f]
              }
              o[bodyField[bodyField.length - 1]] = parameter
            }
          }
        }

        if (schema.path) {
          let schemaPaths: string[] = []
          if (typeof schema.path === 'string') {
            schemaPaths = [schema.path]
          } else if (Array.isArray(schema.path)) {
            schemaPaths = schema.path
          }
          for (const schemaPath of schemaPaths) {
            path = path.replace(schemaPath, parameter)
          }
        }

        if (schema.query) {
          query.set(k, parameter)
        }
      }
    }

    if (!body && method && method.toLowerCase() === 'post') {
      body = new FormData()
    }

    return {
      activityspec: await viewspec(rc, path, query),
      body,
    }
  }

  const run = async (rc: RunContext) => {
    const { body, activityspec } = await prepare(rc)
    const url = urls.gateway.activity({ activityspec })
    console.log("run", {activityRequest, activityspec, body, url})

    return await fetchJSONRaw(rc.fetch,
      url,
      { method, body })
  }

  return {
    ...(activityRequest?.interactive
      ? {
          href: (!method || method.toLowerCase() === "get" && !hasBody)
            ? async () => {
              const { activityspec } = await prepare({fetch: (a: any, b?: any) => globalThis.fetch(a, b)})
                return urls.gateway.activity({ activityspec })
              }
            : async () => {
              const { headers } = await run({ fetch: (a: any, b?: any) => globalThis.fetch(a, b) })
                return headers.get('location')
              },
        }
      : {}
    ),
    run,
  }
}

const defaultSpaceCollections: DefaultCollection[] = [
  // TODO also include discovered list of existing collections.
  {
    label: "Starred",
    name: "user:starred",
    image: starredCollectionImage,
  },
]

export function getCommandSet(services: Record<string, Service>, { user, space, service, collection, activity, optional }: CommandSelection): CommandSet {
  console.log("getCommandSet({ user, space, service, activity, collection }", { user, space, service, activity, collection })

  if (!user) {
    return {
      commands: []
    }
  }
  
  type CollectionMembershipOrAttachment = Record<string, {
    member: boolean
    collection: {
      owner: string
      name: string
      label: string
      image?: string
    }
  }>

  let collectionMemberships: CollectionMembershipOrAttachment | undefined;

  let collectionAttachments: CollectionMembershipOrAttachment | undefined;

  const includeDefaultMemberships = (user: string, c: NonNullable<typeof collectionMemberships>, defaults: DefaultCollection[]) => {
    for (const defaultCollection of defaults) {
      const key = `${user}/${defaultCollection.name}`
      c[key] = {
        member: false,
        collection: {
          owner: user,
          name: defaultCollection.name,
          label: defaultCollection.label,
          image: defaultCollection.image,
        }
      }
    }
  }

  const includeMemberships = (user: string, c: NonNullable<typeof collectionMemberships>, memberships: Membership[]) => {
    for (const membership of memberships) {
      if (membership.collection_owner !== user) {
        continue
      }
      const key = `${membership.collection_owner}/${membership.collection_name}`
      if (key in c) {
        c[key].member = true
      } else {
        c[key] = {
          member: true,
          collection: {
            owner: membership.collection_owner,
            name: membership.collection_name,
            label: membership.collection_label,
          }
        }
      }
    }
  }

  if (collection) {
    return {
      context: `Collection ${collection.label}`,
      // Offer to remove any service already attached
      // Offer to add periodic

      commands: [
        ...matchingActivityCommandList(services,
          [everyPossibleActivity],
          [activityHasLabel(), activityHasAnyPrefix("user:")],
          [
            everyPossibleActivityForSelections(
              {
                type: "spaces",
                value: async ({fetch}: RunContext) => {
                  const spaces = await fetchJSON(fetch, urls.api.collectionSpaceMembership({ owner: collection.owner, name: collection.name }))
                  return ["", ...processSpaces(spaces).map(space => space.space)].join(",")
                }
              },
            ),
          ],
          mustUseRequiredSelectionsAndSpecifyAllRequiredParameters(optional),
          2,
        ),
      ],
    }
  }

  if (service) {
    if (user) {
      collectionAttachments = {}
      includeDefaultMemberships(user, collectionAttachments, defaultSpaceCollections)
    }

    if (collectionAttachments && service.memberships) {
      includeMemberships(user, collectionAttachments, service.memberships)
    }

    // Find all activities *for this service* that accept a single `type: "spaces"` value.
    // These can get attached to a collection.

    

    // What about other fields they need?
    // Define an activity that sets some field on a space.
    // Mark a space as being used as a particular parameter.

    return {
      context: `Service ${service}`,
      // If service can be run against N spaces
      commands: [
        ...(collectionAttachments
          ? Object.values(collectionAttachments).map(
            ({ member, collection }) => member
            ? {
                id: `Detach from ${collection.label}`,
                title: `Detach from ${collection.label}`,
                request: {
                  async run(): Promise<unknown> {
                    return await fetchJSON(
                      fetch,
                      urls.api.collectionServiceMembership({ owner: user, name: collection.name, servicespec: service.name }),
                      {
                        method: 'DELETE',
                      },
                    )
                  },
                },
              }
            : {
              id: `Attach to ${collection.label}`,
              title: `Attach to ${collection.label}`,
              image: collection.image ? collection.image : svgImageURL(addToCollectionImage),
              request: {
                async run(): Promise<unknown> {
                  return await fetchJSON(
                    fetch,
                    urls.api.collectionServiceMembership({ owner: user, name: collection.name }),
                    {
                      method: 'POST',
                      body: { servicespec: service.name },
                    },
                  )
                },
              },
            })
          : []),
      ],
    }
  }

  if (activity) {
    collectionAttachments = {}

    // if (collectionAttachments && activity.memberships) {
    //   includeMemberships(user, collectionAttachments, activity.memberships)
    // }

    // Find all activities *for this service* that accept a single *additional* `type: "spaces"` value.
    // These can be attached to an existing collection.
    const freeSet = new Set(Object.keys(activity.schema?.spawn || {}))
    for (const set of Object.keys(activity.views)) {
      freeSet.delete(set)
    }

    let activitySpec: string | undefined
    let freeKey: string | undefined
    let serviceParameters: Record<string, string> | undefined
    let serviceActivity: ServiceActivity | undefined

    const service = services[activity.service]
    if (service && service.spawn.schema && freeSet.size === 1) {
      freeKey = [...freeSet][0]
      const freeSchema = service.spawn.schema[freeKey]
      if (freeSchema.type === "spaces") {
        serviceParameters = renderServiceParameters(activity.views)
        serviceParameters[freeKey] = "."
        serviceActivity = service.activities[activity.id]
        activitySpec = renderActivitySpecFor(activity.service, serviceParameters, null, null)
        includeDefaultMemberships(user, collectionAttachments, defaultSpaceCollections)
        // includeDefaultMemberships(user, collectionAttachments, defaultSpaceCollections)
      }
    }

    console.log({ activitySpec, serviceParameters, serviceActivity })

    return {
      context: `Activity ${service}`,
      // If service can be run against N spaces
      commands: [
        ...(collectionAttachments && activitySpec
          ? Object.values(collectionAttachments).map(
            ({ member, collection }) => member
              ? {
                id: `Detach from ${collection.label}`,
                title: `Detach from ${collection.label}`,
                request: {
                  async run(): Promise<unknown> {
                    return await fetchJSON(fetch, urls.api.collectionServiceMembership({ owner: user, name: collection.name, servicespec: activitySpec }), {
                      method: 'DELETE',
                    })
                  },
                },
              }
              : {
                id: `Attach to ${collection.label}`,
                title: `Attach to ${collection.label}`,
                image: collection.image ? collection.image : svgImageURL(addToCollectionImage),
                request: {
                  async run(): Promise<unknown> {
                    return await fetchJSON(fetch, urls.api.collectionServiceMembership({ owner: user, name: collection.name }), {
                      method: 'POST',
                      body: { servicespec: activitySpec },
                    })
                  },
                },
              })
          : []),

        ...((activitySpec && serviceParameters && serviceActivity)
          ? defaultSpaceCollections.map(c => activityRequestToCommandRequest({
            activity: {
              ...serviceActivity!,
              label: `Launch with ${c.label} as ${freeKey}`,
            },
            freeParameterNames: [],
            serviceName: activity.service,
            serviceParameters: {
              ...Object.fromEntries(Object.entries(serviceParameters!).map(([k, v]) => [k, async (rc: RunContext) => v])),
              [freeKey!]: async ({fetch}: RunContext) => {
                const r = await fetchJSON(fetch, urls.api.collectionSpaceMembership({name: c.name, owner: c.name}))
                console.log({ r, c })
                // collection.join(",")
                return ","
              },
            },
            spawn: service.spawn,
            requestParameters: {},
            unusedSelections: [],
          }))
          : []),
        ...matchingActivityCommandList(services,
          [everyPossibleActivity],
          [activityHasLabel(), activityHasAnyPrefix("user:")],
          [
            everyPossibleActivityForSelections(),
          ],
          mustUseRequiredSelectionsAndSpecifyAllRequiredParameters({}),
          2,
        ),
      ],
    }
  }

  if (space) {
    collectionMemberships = {}
    includeDefaultMemberships(user, collectionMemberships, defaultSpaceCollections)

    if (space.memberships) {
      includeMemberships(user, collectionMemberships, space.memberships)
    }

    console.log({ collectionMemberships, space })

    // TODO find all activities that accept a space *and* a collection.
    // 

    // TODO define api-based activities for:
    // - "Remove from collection"[collectionOwner, collectionName, space]
    // - "Add to collection"[collectionOwner, collectionName, space]

    return {
      context: `Space ${space.space}`,
      commands: [
        ...(collectionMemberships
          ? Object.values(collectionMemberships).map(
            ({member, collection}) => member
            ? {
                id: `Remove from ${collection.label}`,
                title: `Remove from ${collection.label}`,
                request: {
                  async run(): Promise<unknown> {
                    return await fetchJSON(fetch, urls.api.collectionSpaceMembership({ owner: user, name: collection.name, space: space.space }), {
                      method: 'DELETE',
                    })
                  },
                },
              }
            : {
              id: `Add to ${collection.label}`,
              title: `Add to ${collection.label}`,
              image: collection.image ? collection.image : svgImageURL(addToCollectionImage),
              request: {
                async run(): Promise<unknown> {
                  return await fetchJSON(fetch, urls.api.collectionSpaceMembership({ owner: user, name: collection.name }), {
                    method: 'POST',
                    body: {space: space.space},
                  })
                },
              },
              })
          : []),
        ...matchingActivityCommandList(services,
          [everyPossibleActivity],
          [activityHasLabel(), activityHasAnyPrefix("user:")],
          [
            everyPossibleActivityForSelections(
              {
                type: "space",
                value: () => Promise.resolve(space.space),
              },
              {
                type: "spaces",
                value: async () => {
                  return ","
                },
              },
            )
          ],
          mustUseRequiredSelectionsAndSpecifyAllRequiredParameters({spaces: true}),
          2,
        ),
      ],
    }
  }

  return {
    commands: [
      ...matchingActivityCommandList(services,
        [everyPossibleActivity],
        [activityHasLabel(), activityHasAnyPrefix("user:")],
        [
          everyPossibleActivityForSelections( // include an empty list
            {
              type: "spaces",
              value: async () => {
                return ","
              },
            },
          )
        ],
        mustUseRequiredSelectionsAndSpecifyAllRequiredParameters({spaces: true}),
        2,
      ),
    ],
  }
}

function mustUseRequiredSelectionsAndSpecifyAllRequiredParameters(optionalSelection?: Record<string, boolean>): (ac: ActivityCommand) => boolean {
  return ({freeParameterNames, activity, spawn, unusedSelections}) => {
    const allRequiredParametersAreSet = freeParameterNames.length === 0 ||
      freeParameterNames.every(name => {
        const schema = (
          (spawn?.schema && spawn?.schema[name]) ||
          (activity.request && activity.request?.schema[name])
        )
        return schema.optional || schema.default
      });

    const onlyOptionalSelectionsUnused = unusedSelections == null ||
      unusedSelections.length === 0 ||
      (optionalSelection
        ? unusedSelections.every(selection => optionalSelection[selection.type])
        : false
      );

    return allRequiredParametersAreSet && onlyOptionalSelectionsUnused
  }
}