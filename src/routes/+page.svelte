<script lang=ts>
	import { activities } from '$lib/stores/store';
    import ActivityForm from '../lib/activities/ActivityForm.svelte';
</script>

<ActivityForm bind:activity={$activities[0]}/>