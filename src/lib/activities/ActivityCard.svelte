<script lang=ts>
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import IconButton, { Icon } from '@smui/icon-button';
	import Card from '@smui/card';
	import LayoutGrid, { Cell, InnerGrid } from '@smui/layout-grid';
	import Slider from '@smui/slider';
	import TextField from '@smui/textfield';
	import { activities, type Activity } from "../stores/store";

	export let activity: Activity;
	let sliderNum = 0;

	let panelOpen = activity.components !== undefined;

	function addActivity() {
		activities.update(activities => {
			if (activity.fundamental) {
				activity = {
					...activity,
					fundamental: false,
					components: [],
				}
			}
			activity.components = [
				...activity.components,
				{
					weight: 1,
					activityId: activities.length,
				}
			];
			panelOpen = true;
			return [
				...activities,
				{
					id: activities.length,
					fundamental: true,
					name: 'new activity',
					value: 0,
					description: '',
					components: undefined,
				}
			];
		});
	}
</script>

<Card class="activity-card" variant="outlined">
	<LayoutGrid align="left">
		<Cell span={6} align="middle">
			<TextField class="name__text-field" label="name" bind:value={activity.name} variant="outlined"></TextField>
		</Cell>
		<Cell span={6}>
			<slot name="weight"></slot>
		</Cell>
		<Cell span={3}>
			<TextField type="number" label="value" bind:value={activity.value} variant="outlined"></TextField>
		</Cell>
		<Cell span={9}>
			<TextField style="width: 100%;" textarea label="description" bind:value={activity.description}></TextField>
		</Cell>
		<Cell span={12}>
			<Accordion>
				<Panel class="no-padding" variant="outlined" bind:open={panelOpen}>
					<Header>
						Component activities
						<span slot="icon">
							<span on:click|stopPropagation={addActivity} on:keypress|stopPropagation={addActivity}>
								<IconButton>
									<Icon class="material-icons">add</Icon>
								</IconButton>
							</span>
							<IconButton slot="icon" toggle pressed={panelOpen}>
								<Icon class="material-icons" on>expand_less</Icon>
								<Icon class="material-icons">expand_more</Icon>
							</IconButton>
						</span>
					</Header>
					<Content>
						<LayoutGrid align="left">
							{#if activity.components !== undefined}
							{#each activity.components as activityComponent}
								<Cell span={12}>
									<svelte:self bind:activity={$activities[activityComponent.activityId]}>
										<span slot="weight">
											<InnerGrid>
												<Cell span={4}>
													<TextField type="number" label="weight" input$step="0.01" bind:value={activityComponent.weight} variant="outlined"></TextField>
												</Cell>
												<Cell span={8}>
													<Slider min={0.01} max={2} step={0.01} bind:value={activityComponent.weight} />
												</Cell>
											</InnerGrid>
										</span>
									</svelte:self>
								</Cell>
							{/each}
							{/if}
						</LayoutGrid>
					</Content>
				</Panel>
			</Accordion>
		</Cell>
	</LayoutGrid>
	<div class="activity-card">
		blahblah
	</div>
</Card>

<style lang="scss">
	@use "@material/card";
	@use "@material/typography";

	:global {
		.name__text-field {
			width: 100%;
			input {
				@include typography.typography('headline5');
			}
		}

		.activity-card .no-padding .smui-paper__content {
			padding: 0 !important;
		}
	}

	:global(.activity-card) {
		@include card.fill-color('primary');
	}
</style>