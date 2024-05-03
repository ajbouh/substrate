import { redirect } from '@sveltejs/kit'
import { urls } from '$lib/activities'

/** @type {import('./$types').PageServerLoad} */

export async function load({ params, url, fetch }) {
  redirect(302, urls.ui.events());
}
