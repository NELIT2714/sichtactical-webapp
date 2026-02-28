<div class="flex flex-col gap-4 animate-pulse">
	<!-- referral code card -->
	<div class="bg-[#1a1a2e] rounded-2xl p-5 border border-purple-500/20">
		<div class="flex items-center gap-3 mb-4">
			<div class="w-12 h-12 bg-slate-700 rounded-xl"></div>
			<div class="flex flex-col gap-2">
				<div class="h-4 w-36 bg-slate-700 rounded"></div>
				<div class="h-3 w-24 bg-slate-700/60 rounded"></div>
			</div>
		</div>
		<div class="h-12 bg-slate-700/40 rounded-xl mb-3"></div>
		<div class="h-10 bg-slate-700/30 rounded-lg"></div>
	</div>

	<!-- stats grid -->
	<div class="grid grid-cols-2 gap-2.5">
		{#each [0, 1, 2, 3] as _}
			<div class="bg-[#1a1a2e] rounded-xl p-3.5 border border-white/5 flex flex-col gap-2">
				<div class="h-3 w-16 bg-slate-700/60 rounded"></div>
				<div class="h-7 w-12 bg-slate-700 rounded"></div>
			</div>
		{/each}
	</div>

	<!-- friends list -->
	<div class="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden">
		<div class="px-4 py-3 border-b border-white/5">
			<div class="h-4 w-32 bg-slate-700 rounded"></div>
		</div>
		{#each [0, 1, 2] as _}
			<div class="px-4 py-3 flex items-center gap-3 border-b border-white/4 last:border-0">
				<div class="w-10 h-10 bg-slate-700 rounded-full shrink-0"></div>
				<div class="flex-1 flex flex-col gap-1.5">
					<div class="h-3.5 w-28 bg-slate-700 rounded"></div>
					<div class="h-3 w-20 bg-slate-700/60 rounded"></div>
				</div>
				<div class="h-4 w-12 bg-slate-700/50 rounded"></div>
			</div>
		{/each}
	</div>
</div>


