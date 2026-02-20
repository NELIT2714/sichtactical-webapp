<script lang="ts">
	const quickInfo = [
		{
			id: 1,
			title: "Правила клуба",
			icon: "bi-book",
			color: "from-blue-500 to-cyan-500",
			action: () => {},
		},
		{
			id: 2,
			title: "Снаряжение",
			icon: "bi-backpack",
			color: "from-orange-500 to-red-500",
			action: () => {},
		},
		{
			id: 3,
			title: "Площадки",
			icon: "bi-map",
			color: "from-green-500 to-emerald-500",
			action: () => {},
		},
		{
			id: 4,
			title: "Поддержка",
			icon: "bi-headset",
			color: "from-pink-500 to-rose-500",
			action: () => {},
		},
	];
</script>

<section class="px-4 py-4">
	<h3 class="text-lg font-bold mb-3">Полезное</h3>

	<div class="grid grid-cols-2 gap-2">
		{#each quickInfo as item (item.id)}
			<button
				on:click={item.action}
				class="bg-gradient-to-br {item.color} rounded-xl p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all shadow-lg hover:shadow-xl"
			>
				<i class="bi {item.icon} text-2xl text-white"></i>
				<span class="text-xs font-semibold text-white text-center leading-tight">{item.title}</span>
			</button>
		{/each}
	</div>
</section>
