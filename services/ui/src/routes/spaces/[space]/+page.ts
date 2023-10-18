import { urls, fetchJSON } from '$lib/activities'

export async function load({ params, url, fetch }) {
  console.log({ params })

  const {
    owner,
    alias,
    created_at,
    forked_from,
  } = await fetchJSON(fetch, urls.api.space({ space: params.space }))

  return {
    space: params.space,

    owner,
    alias,
    created_at,
    forked_from,
  }
}
