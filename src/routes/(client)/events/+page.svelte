<script lang="ts">
	import { fadeUp } from "$lib/context/js/ui/fadeUp";

	import Event from "$lib/components/ui/+event.svelte"
	import Header from "$lib/components/+header.svelte";
	import NoEvents from "$lib/components/screens/+no-events.svelte";

	import SkeletonEvents from "$lib/components/skeletons/+events.svelte";

	export let data;
</script>

<Header>
	<h1 class="text-xl font-bold mb-0.5 uppercase">Sich Tactical</h1>
	<p class="text-[13px] text-white/50">Предстоящие игры</p>
</Header>

<section class="md:container md:mx-auto px-4 py-4">
	{#await data.appData}
		<SkeletonEvents />
	{:then appData}
		<div use:fadeUp={{ delayStep: 100 }}>
			<div class="opacity-0 flex flex-col gap-4">
				{#if appData.eventsResponse.events.length > 0}
					{#each appData.eventsResponse.events as e}
						<Event eventInfo={e}/>
					{/each}
				{:else}
					<NoEvents />
				{/if}
			</div>
		</div>
	{/await}
</section>