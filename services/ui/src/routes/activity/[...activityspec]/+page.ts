import { urls, fetchJSON } from '$lib/activities'

export async function load({ params, fetch }) {
  console.log({ params })

  const resume = await fetchJSON(fetch, urls.api.spawn({}), {
    method: 'post',
    body: {
      activityspec: params.activityspec,
      force_spawn: false,
    },
  })

  console.log({ params, resume })

  return {
    resume,
  }
}
