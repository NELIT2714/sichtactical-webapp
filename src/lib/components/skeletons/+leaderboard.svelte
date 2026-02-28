<div class="flex flex-col gap-4 animate-pulse">
	<!-- header info -->
	<div class="bg-[#1a1a2e] rounded-2xl p-4 border border-yellow-500/15">
		<div class="h-4 w-48 bg-slate-700 rounded mb-2"></div>
		<div class="h-3 w-64 bg-slate-700/60 rounded"></div>
	</div>

	<!-- list -->
	<div class="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden">
		{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as i}
			<div class="px-4 py-3 flex items-center gap-3 border-b border-white/4 last:border-0">
				<div class="w-7 h-5 bg-slate-700/60 rounded shrink-0"></div>
				<div class="w-9 h-9 bg-slate-700 rounded-full shrink-0"></div>
				<div class="flex-1 flex flex-col gap-1.5">
					<div class="h-3.5 {i % 3 === 0 ? 'w-32' : i % 3 === 1 ? 'w-24' : 'w-36'} bg-slate-700 rounded"></div>
					<div class="h-3 w-16 bg-slate-700/60 rounded"></div>
				</div>
				<div class="h-4 w-10 bg-slate-700/50 rounded"></div>
			</div>
		{/each}
	</div>
</div>


