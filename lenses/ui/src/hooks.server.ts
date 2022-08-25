import { parse, serialize } from 'cookie'; 
import { env as publicEnv } from '$env/dynamic/public'

/** @type {import('@sveltejs/kit').HandleFetch} */
export function handleFetch({ event, request, fetch }) {
  console.log({'request.url': request.url})
  if (request.url.startsWith(publicEnv.PUBLIC_EXTERNAL_ORIGIN)) {
    const cookie = event.request.headers.get('cookie')
    request.headers.set('cookie', cookie);
  }

  return fetch(request);
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  event.locals.user = event.request.headers.get('substrate-github-username');

  const response = await resolve(event);

  return response;
}