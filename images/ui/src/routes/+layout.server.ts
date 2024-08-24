/** @type {import('./$types').LayoutServerLoad} */

export async function load({ params, locals, fetch }) {
  return {
    user: locals.user,
  }
}
