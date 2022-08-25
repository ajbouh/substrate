import { urls, fetchJSON } from '$lib/activities'


/** @type {import('./$types').LayoutServerLoad} */

export async function load({ params, fetch }) {
  const [activityspec, _] = params.activityspec.split(/\//, 2)
  const { spaces } = await fetchJSON(fetch, urls.api.activity({ activityspec }))

  return {
    view: spaces,
  }
}
