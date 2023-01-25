<script lang="ts">
  import { invalidateAll } from '$app/navigation'
  import { getUser, signOut } from '@lucia-auth/sveltekit/client'

  const user = getUser()

  const signOutAndInvalidate = async () => {
    await signOut()
    invalidateAll()
  }
</script>

<p>User id: {$user?.userId}</p>
<p>User name: {$user?.username}</p>

<slot />

<button on:click={signOutAndInvalidate}>Sign out</button>
