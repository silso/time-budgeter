import { googleAuth } from '$lib/server/google-auth'
import { redirect, type Action } from '@sveltejs/kit'

const action: Action = async ({ locals }) => {
  const [authUrl, state] = googleAuth.getAuthorizationUrl()
  throw redirect(302, authUrl)
}
