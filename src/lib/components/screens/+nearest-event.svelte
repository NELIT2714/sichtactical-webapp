<script lang="ts">
	import type { EventItem } from "$lib/types/event";
	import { goto } from "$app/navigation";

	import Event from "$lib/components/ui/+event.svelte"

	export let eventInfo: EventItem;

	$: if (eventInfo) {
		percentSlots = (eventInfo.members / eventInfo.max_members) * 100;
		slotStatus = percentSlots >= 100 ? "full" : percentSlots >= 70 ? "few" : "available";
	}

	let percentSlots = 0;
	let slotStatus: "available" | "few" | "full" = "available";
</script>

<section class="px-4 opacity-0 ">
	<div class="flex items-center justify-between mb-3">
		<h3 class="text-lg font-bold">Ближайшая игра</h3>
		<button on:click={() => goto("/events")} class="cursor-pointer text-sm text-blue-400 font-medium">Все игры →</button>
	</div>

	<Event eventInfo={eventInfo} />
</section>
