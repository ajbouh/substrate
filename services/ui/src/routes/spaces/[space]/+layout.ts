import { urls, fetchJSON } from '$lib/activities'


/** @type {import('./$types').LayoutServerLoad} */

export async function load({ params, fetch }) {
  const {
    owner,
    alias,
    created_at,
    forked_from,
  } = await fetchJSON(fetch, urls.api.space({ space: params.space }))

  return {
    owner,
    alias,
    created_at,
    forked_from,
    space: params.space,
  }
}
