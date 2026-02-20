<script lang="ts">
	const achievements = [
		{
			id: 1,
			name: "Новичок",
			description: "Сыграл первую игру",
			icon: "bi-star",
			unlocked: true,
		},
		{
			id: 2,
			name: "Боец",
			description: "Сыграл 5 игр",
			icon: "bi-flame",
			unlocked: true,
		},
		{
			id: 3,
			name: "Ветеран",
			description: "Сыграл 20 игр",
			icon: "bi-trophy",
			unlocked: true,
		},
		{
			id: 4,
			name: "Легенда",
			description: "Достигнул уровня 10",
			icon: "bi-crown",
			unlocked: false,
		},
	];
</script>

<section class="px-4 py-4">
	<h3 class="text-lg font-bold mb-3">Ваши достижения</h3>

	<div class="grid grid-cols-4 gap-2">
		{#each achievements as achievement (achievement.id)}
			<div
				class="relative group"
			>
				<div
					class={`rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
						achievement.unlocked
							? 'bg-yellow-500/20 border border-yellow-500/40 hover:bg-yellow-500/30'
							: 'bg-white/5 border border-white/10 opacity-50'
					}`}
				>
					<i
						class="bi {achievement.icon} text-2xl {achievement.unlocked ? 'text-yellow-400' : 'text-white/30'}"
					></i>
					<span class="text-[10px] font-semibold text-center leading-tight {achievement.unlocked ? 'text-white' : 'text-white/40'}">
						{achievement.name}
					</span>
				</div>

				<!-- Tooltip -->
				<div
					class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
				>
					{achievement.description}
				</div>
			</div>
		{/each}
	</div>
</section>
