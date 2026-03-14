<script lang="ts">
	import { goto } from "$app/navigation";
	import { fadeUp } from "$lib/context/js/ui/fadeUp";
	import Header from "$lib/components/+header.svelte";

	export let data;

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
			admin_only: false,
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
			admin_only: false,
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
			admin_only: false,
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
			admin_only: false,
		},
		{
			id: "admin",
			href: "/admin",
			icon: "bi-shield-lock-fill",
			title: "Админ панель",
			description: "Управление пользователями и контентом",
			gradient: "from-red-500/20 to-rose-600/20",
			border: "border-red-500/25",
			iconBg: "bg-linear-to-br from-red-500 to-rose-600",
			active: true,
			admin_only: true,
		}
	];

	const handleClick = (item: typeof menuItems[0]) => {
		if (item.active && item.href) goto(item.href);
	};
</script>

<Header>
	<h1 class="text-xl font-bold mb-0.5 uppercase">Sich Tactical</h1>
	<p class="text-[13px] text-white/50">Дополнительно</p>
</Header>

<section class="md:container md:mx-auto px-4 py-4">

	{#await data.appData}
		<div class="grid gap-3">
			{#each Array(3) as _}
				<div class="bg-white/5 border border-white/10 rounded-2xl p-4 animate-pulse">
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 bg-white/10 rounded-xl"></div>
						<div class="flex-1 space-y-2">
							<div class="h-3 w-28 bg-white/10 rounded"></div>
							<div class="h-2.5 w-44 bg-white/5 rounded"></div>
						</div>
						<div class="w-4 h-4 bg-white/10 rounded-full"></div>
					</div>
				</div>
			{/each}
		</div>
	{:then appData}
		{@const user = appData.user}

		<div use:fadeUp={{ delayStep: 100 }}>
			<div class="opacity-0">
				{#each menuItems as item}
					{#if (user.admin_data) || (!item.admin_only)}
						<button type="button" on:click={() => handleClick(item)} disabled={!item.active} class="w-full text-left mb-3 bg-linear-to-br {item.gradient} rounded-2xl p-4 border {item.border} transition-all {item.active ? 'cursor-pointer hover:brightness-110 active:scale-[0.98]' : 'cursor-not-allowed opacity-50'}">
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
					{/if}
				{/each}
			</div>
		</div>
	{/await}
</section>
