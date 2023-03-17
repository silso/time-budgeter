<script lang="ts">
  import { activities } from '$lib/stores/store'
  import ActivityForm from '$lib/activities/ActivityForm.svelte'

  const resetDb = () => {}
  const addToCompoundActivites = async () => {
    const response = await fetch('/api/activities', {
      method: 'POST',
      body: JSON.stringify([
        { id: 0, name: 'hwoeiwoi', description: 'aweogogrhuog', activityComponents: [] },
      ]),
    })
  }
  const getActivities = async () => {
    console.log('activities are here', await (await fetch('/api/activities')).json())
  }
</script>

<!-- {#await activities.load()} -->
<p>Currently loading...</p>
<!-- {:then} -->
<button on:click={resetDb}>reset</button>
<button on:click={addToCompoundActivites}>add to compound activities</button>
<button on:click={getActivities}>get activities</button>
<!-- <ActivityForm bind:activity={$activities[0]} /> -->
<!-- {/await} -->
