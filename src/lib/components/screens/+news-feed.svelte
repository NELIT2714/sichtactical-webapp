<script lang="ts">
	interface News {
		id: number;
		title: string;
		description: string;
		type: "event" | "achievement" | "announcement";
		timestamp: string;
		icon: string;
		color: string;
	}

	const news: News[] = [
		{
			id: 1,
			title: "Новое событие",
			description: "Добавлена игра 22 февраля",
			type: "event",
			timestamp: "Сегодня",
			icon: "bi bi-star-fill",
			color: "from-blue-500 to-blue-600",
		},
		{
			id: 2,
			title: "Вы достигли уровня 8",
			description: "Получено 500 опыта за игру",
			type: "achievement",
			timestamp: "Вчера",
			icon: "bi bi-trophy-fill",
			color: "from-yellow-500 to-orange-500",
		},
		{
			id: 3,
			title: "Объявление",
			description: "Клуб будет закрыт 31 декабря",
			type: "announcement",
			timestamp: "3 дня назад",
			icon: "bi bi-megaphone-fill",
			color: "from-red-500 to-pink-500",
		},
	];
</script>

<section class="opacity-0 px-4">
	<h3 class="text-lg font-bold mb-3">Новости</h3>

	<div class="space-y-2">
		{#each news as item (item.id)}
			<div class="bg-[#1a1a2e] rounded-xl p-3.5 border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all cursor-pointer flex items-start gap-3">
				<div class="w-10 h-10 bg-gradient-to-br {item.color} rounded-lg flex items-center justify-center flex-shrink-0 text-white">
					<i class="{item.icon} text-sm"></i>
				</div>

				<div class="flex-1 min-w-0">
					<h4 class="font-semibold text-sm mb-0.5">{item.title}</h4>
					<p class="text-xs text-white/60 line-clamp-1">{item.description}</p>
					<span class="text-[11px] text-white/40 mt-1 inline-block">{item.timestamp}</span>
				</div>

				<div class="text-white/30 flex-shrink-0 mt-1">
					<i class="bi bi-chevron-right text-sm"></i>
				</div>
			</div>
		{/each}
	</div>

	<button class="w-full mt-3 py-2.5 text-sm text-blue-400 font-medium bg-white/[0.05] rounded-lg hover:bg-white/[0.08] transition-all">
		Все новости →
	</button>
</section>
