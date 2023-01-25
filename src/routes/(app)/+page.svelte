<script lang="ts">
  import { activities } from '$lib/stores/store'
  import ActivityForm from '$lib/activities/ActivityForm.svelte'
</script>

{#await activities.load()}
  <p>Currently loading...</p>
{:then}
  <ActivityForm bind:activity={$activities[0]} />
{/await}
