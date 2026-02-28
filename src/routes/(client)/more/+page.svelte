<script lang="ts">
	import { goto } from "$app/navigation";
	import { fadeUp } from "$lib/context/js/ui/fadeUp";
	import Header from "$lib/components/+header.svelte";

	const menuItems = [
		{
			id: "referral",
			href: "/more/referral",
			icon: "bi-people-fill",
			title: "Реферальная программа",
			description: "Приглашайте друзей и зарабатывайте вместе",
			gradient: "from-purple-500/20 to-pink-500/20",
			border: "border-purple-500/25",
			iconBg: "bg-linear-to-br from-purple-500 to-pink-500",
			active: true,
		},
		{
			id: "leaderboard",
			href: "/more/leaderboard",
			icon: "bi-trophy-fill",
			title: "Лидерборд",
			description: "Топ игроков по числу сыгранных игр",
			gradient: "from-yellow-500/20 to-orange-500/20",
			border: "border-yellow-500/25",
			iconBg: "bg-linear-to-br from-yellow-500 to-orange-500",
			active: true,
		},
		{
			id: "achievements",
			href: null,
			icon: "bi-patch-check-fill",
			title: "Достижения",
			description: "Ваши награды и прогресс",
			gradient: "from-blue-500/20 to-cyan-500/20",
			border: "border-blue-500/25",
			iconBg: "bg-linear-to-br from-blue-500 to-cyan-500",
			active: false,
		},
		{
			id: "settings",
			href: null,
			icon: "bi-gear-fill",
			title: "Настройки",
			description: "Профиль и параметры приложения",
			gradient: "from-slate-500/20 to-slate-600/20",
			border: "border-slate-500/25",
			iconBg: "bg-slate-600",
			active: false,
		},
	];

	const handleClick = (item: typeof menuItems[0]) => {
		if (item.active && item.href) goto(item.href);
	};
</script>

<Header>
	<h1 class="text-xl font-bold mb-0.5 uppercase">Sich Tactical</h1>
	<p class="text-[13px] text-white/50">Дополнительно</p>
</Header>

<section use:fadeUp={{ delayStep: 100 }} class="md:container md:mx-auto px-4 py-4">
	<div class="opacity-0">
		{#each menuItems as item}
			<button
				type="button"
				on:click={() => handleClick(item)}
				disabled={!item.active}
				class="w-full text-left mb-3 bg-linear-to-br {item.gradient} rounded-2xl p-4 border {item.border} transition-all
					{item.active ? 'cursor-pointer hover:brightness-110 active:scale-[0.98]' : 'cursor-not-allowed opacity-50'}"
			>
				<div class="flex items-center gap-4">
					<div class="w-12 h-12 {item.iconBg} rounded-xl flex items-center justify-center shrink-0 shadow-lg">
						<i class="bi {item.icon} text-xl text-white"></i>
					</div>
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2">
							<h3 class="font-semibold text-sm">{item.title}</h3>
							{#if !item.active}
								<span class="text-[10px] font-semibold text-white/40 bg-white/8 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Скоро</span>
							{/if}
						</div>
						<p class="text-xs text-white/55 mt-0.5">{item.description}</p>
					</div>
					{#if item.active}
						<i class="bi bi-chevron-right text-sm text-white/30 shrink-0"></i>
					{/if}
				</div>
			</button>
		{/each}
	</div>
</section>

