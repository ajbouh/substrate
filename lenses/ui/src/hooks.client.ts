import { env as publicEnv } from '$env/dynamic/public'

/** @type {import('@sveltejs/kit').HandleFetch} */
export function handleFetch({ event, request, fetch }) {
  if (request.url.startsWith(publicEnv.PUBLIC_EXTERNAL_ORIGIN)) {
    request.headers.set('cookie', event.request.headers.get('cookie'));
  }
  console.log(`${request.url}`)

  return fetch(request);
}
