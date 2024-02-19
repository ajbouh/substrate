import { fetchJSON, urls } from '$lib/activities'
import type { Service } from '$lib/activities'

/** @type {import('./$types').LayoutServerLoad} */

export async function load({ params, locals, fetch }) {
  let services: Record<string, Service> = {}
  try {
    services = await fetchJSON<Record<string, Service>>(fetch, urls.api.services({}))
  } catch (e) {
    console.error(e)
  }

  return {
    user: locals.user,
    services,
  }
}
