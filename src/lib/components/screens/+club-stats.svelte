<script lang="ts">
	const clubStats = [
		{
			id: 1,
			label: "Игроков",
			value: "247",
			icon: "bi-people-fill",
			color: "from-blue-500 to-blue-600",
		},
		{
			id: 2,
			label: "Событий месяц",
			value: "12",
			icon: "bi-calendar-event",
			color: "from-green-500 to-teal-600",
		},
		{
			id: 3,
			label: "Игр сыграно",
			value: "89",
			icon: "bi-gamepad2",
			color: "from-purple-500 to-pink-600",
		},
		{
			id: 4,
			label: "Команд",
			value: "18",
			icon: "bi-shield-check",
			color: "from-orange-500 to-red-600",
		},
	];
</script>

<section class="px-4 py-4">
	<h3 class="text-lg font-bold mb-3">Статистика клуба</h3>

	<div class="grid grid-cols-2 gap-3">
		{#each clubStats as stat (stat.id)}
			<div class="bg-gradient-to-br {stat.color} rounded-2xl p-4 shadow-lg border border-white/10">
				<div class="flex items-start justify-between mb-2">
					<div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
						<i class="bi {stat.icon} text-white text-lg"></i>
					</div>
				</div>
				<div class="text-2xl font-bold text-white mb-1">{stat.value}</div>
				<div class="text-xs text-white/70 font-medium">{stat.label}</div>
			</div>
		{/each}
	</div>
</section>
