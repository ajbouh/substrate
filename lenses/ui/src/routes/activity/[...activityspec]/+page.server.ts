import { redirect } from '@sveltejs/kit'
import { urls, fetchJSON } from '$lib/activities'

export const actions = {
  default: async (event, fetch) => {
    const request = event.request
    const data = await request.formData()

    const r = await fetchJSON(event.fetch, urls.api.spawn({}), {
      method: 'post',
      body: {
        activityspec: data.get('activityspec'),
        force_spawn: true,
      },
    })

    console.log({ r, data })

    throw redirect(301, urls.ui.activity({
      activityspec: r.activityspec,
    }))
  }
};
