 <script lang="ts">
	import type { EventItem } from "$lib/context/js/types/event";
	import { events } from "$lib/context/js/tests";

	// Get next 3 events for the week preview
	$: upcomingEvents = events.slice(0, 3);
</script>

<section class="px-4 py-4">
	<div class="flex items-center justify-between mb-3">
		<h3 class="text-lg font-bold">На этой неделе</h3>
		<a href="/events" class="text-sm text-blue-400 font-medium">Все →</a>
	</div>

	<div class="space-y-2">
		{#each upcomingEvents as event (event.id)}
			<div class="bg-white/[0.03] rounded-xl p-3 border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all cursor-pointer">
				<div class="flex items-start gap-3">
					<!-- Date Badge -->
					<div class="flex flex-col items-center justify-center bg-blue-500/20 rounded-lg px-2 py-1.5 flex-shrink-0">
						<span class="text-xs font-bold text-blue-400">15</span>
						<span class="text-[10px] text-blue-300">Фев</span>
					</div>

					<!-- Event Info -->
					<div class="flex-1 min-w-0">
						<h4 class="font-semibold text-sm truncate">{event.title}</h4>
						<div class="flex items-center gap-2 text-xs text-white/50 mt-1">
							<i class="bi bi-clock text-white/40"></i>
							<span>{event.time}</span>
							<span class="text-white/30">•</span>
							<i class="bi bi-people text-white/40"></i>
							<span>{event.members}/{event.max_members}</span>
						</div>
					</div>

					<!-- Arrow -->
					<i class="bi bi-chevron-right text-white/30 text-sm flex-shrink-0"></i>
				</div>
			</div>
		{/each}
	</div>
</section>
