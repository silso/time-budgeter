import google from '@lucia-auth/oauth/google'
import { auth } from './lucia'

export const googleAuth = google(auth, {
  // env
  clientId: '',
  clientSecret: '',
  redirectUri: '',
})
