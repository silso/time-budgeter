<script lang=ts>
	import type {Activity} from "./activities";
    import ActivityCard from "./ActivityCard.svelte";

    export let activity: Activity;
</script>

<ActivityCard bind:activity={activity}/>