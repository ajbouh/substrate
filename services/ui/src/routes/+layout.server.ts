import { fetchJSON, urls } from '$lib/activities'
import type { Lens } from '$lib/activities'

/** @type {import('./$types').LayoutServerLoad} */

export async function load({ params, locals, fetch }) {
  let lenses: Record<string, Lens> = {}
  try {
    lenses = await fetchJSON<Record<string, Lens>>(fetch, urls.api.lenses({}))
  } catch (e) {
    console.error(e)
  }

  return {
    user: locals.user,
    lenses,
  }
}
