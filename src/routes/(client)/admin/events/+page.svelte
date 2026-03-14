<script lang="ts">
	import { fade } from "svelte/transition";
	import EventsScreen from "$lib/components/admin/screens/+events.svelte";
	import EventsSkeleton from "$lib/components/skeletons/+events.svelte";
	import { adminGetEvents } from "$lib/context/js/admin";

	export let data;

	let eventsPromise = data.adminData.then(d => d.events);

	const refresh = async () => {
		eventsPromise = adminGetEvents();
	};
</script>

{#await eventsPromise}
	<div transition:fade={{ duration: 180 }}>
		<EventsSkeleton />
	</div>
{:then events}
	<div transition:fade={{ duration: 180 }}>
		<EventsScreen events={events} onRefresh={refresh} />
	</div>
{/await}
