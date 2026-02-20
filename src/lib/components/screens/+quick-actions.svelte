<script lang="ts">
	import { goto } from "$app/navigation";

	const quickActions = [
		{
			id: 1,
			title: "Все игры",
			icon: "bi-calendar3",
			color: "from-blue-500 to-blue-600",
			action: () => goto("/events"),
		},
		{
			id: 2,
			title: "Команды",
			icon: "bi-people",
			color: "from-green-500 to-green-600",
			action: () => goto("/teams"),
		},
		{
			id: 3,
			title: "Друзья",
			icon: "bi-heart",
			color: "from-pink-500 to-pink-600",
			action: () => goto("/friends"),
		},
		{
			id: 4,
			title: "Рейтинг",
			icon: "bi-trophy",
			color: "from-orange-500 to-yellow-500",
			action: () => goto("/leaderboard"),
		},
	];
</script>

<section class="px-4 py-3">
	<div class="grid grid-cols-4 gap-2">
		{#each quickActions as action (action.id)}
			<button on:click={action.action}
							class="bg-gradient-to-br {action.color} rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 active:scale-[0.95] transition-all shadow-lg hover:shadow-xl">
				<i class="bi {action.icon} text-xl text-white"></i>
				<span class="text-[11px] font-semibold text-white text-center">{action.title}</span>
			</button>
		{/each}
	</div>
</section>
