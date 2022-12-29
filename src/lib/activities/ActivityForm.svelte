<script lang=ts>
    import type { Activity } from "../stores/store";
    import ActivityCard from "./ActivityCard.svelte";

    export let activity: Activity;
</script>

<ActivityCard bind:activity={activity}/>