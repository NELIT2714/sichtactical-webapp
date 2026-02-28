<script lang="ts">
	import { fadeUp } from "$lib/context/js/ui/fadeUp";
	import Header from "$lib/components/+header.svelte";
	import SkeletonLeaderboard from "$lib/components/skeletons/+leaderboard.svelte";
	import type { LeaderboardEntry } from "$lib/context/js/types/referral";

	export let data;

	const MEDAL_COLORS = ["text-yellow-400", "text-slate-300", "text-amber-600"];
	const MEDAL_ICONS = ["bi-trophy-fill", "bi-trophy-fill", "bi-trophy-fill"];
	const TOP_RING = ["border-yellow-400/40", "border-slate-300/40", "border-amber-600/40"];

	const getName = (entry: LeaderboardEntry) =>
		entry.call_sign ?? `${entry.telegram_data.first_name}${entry.telegram_data.last_name ? ` ${entry.telegram_data.last_name}` : ""}`;

	const getInitial = (entry: LeaderboardEntry) =>
		getName(entry).charAt(0).toUpperCase();

	const gamesWord = (n: number) => {
		const mod10 = n % 10;
		const mod100 = n % 100;
		if (mod10 === 1 && mod100 !== 11) return "игра";
		if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "игры";
		return "игр";
	};
</script>

<Header>
	<div class="flex items-center gap-3">
		<button
			on:click={() => history.back()}
			class="cursor-pointer w-9 h-9 bg-white/10 rounded-full flex items-center justify-center active:scale-95 transition-all"
			aria-label="Назад"
		>
			<i class="bi bi-chevron-left text-lg"></i>
		</button>
		<div>
			<h1 class="text-lg font-bold">Лидерборд</h1>
			<p class="text-[12px] text-white/50">Топ по числу сыгранных игр</p>
		</div>
	</div>
</Header>

<section class="md:container md:mx-auto px-4 py-4">
	{#await data.appData}
		<SkeletonLeaderboard />
	{:then appData}
		{@const board = (appData as any).leaderboard}

		{#if board}
			<div use:fadeUp={{ delayStep: 80 }}>

				<!-- Perks banner -->
				<div class="opacity-0 bg-linear-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 border border-yellow-500/30 mb-3">
					<div class="flex items-start gap-3">
						<div class="w-10 h-10 bg-linear-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shrink-0">
							<i class="bi bi-crown-fill text-white text-base"></i>
						</div>
						<div>
							<h2 class="font-bold text-sm mb-1">Привилегии лидеров</h2>
							<div class="space-y-1">
								<p class="text-xs text-white/65 flex items-center gap-1.5">
									<i class="bi bi-percent text-yellow-400 text-[11px]"></i>
									Постоянные скидки на участие в играх
								</p>
								<p class="text-xs text-white/65 flex items-center gap-1.5">
									<i class="bi bi-lock-fill text-yellow-400 text-[11px]"></i>
									Доступ к приватным ивентам и закрытым играм
								</p>
								<p class="text-xs text-white/65 flex items-center gap-1.5">
									<i class="bi bi-star-fill text-yellow-400 text-[11px]"></i>
									Специальный статус и значок в профиле
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- My rank chip (if available) -->
				{#if board.my_rank !== null}
					<div class="opacity-0 bg-blue-600/20 border border-blue-500/30 rounded-xl px-4 py-2.5 mb-3 flex items-center justify-between">
						<span class="text-sm text-white/70">Ваше место</span>
						<span class="text-base font-bold text-blue-400">#{board.my_rank}</span>
					</div>
				{/if}

				<!-- Leaderboard list -->
				<div class="opacity-0 bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden">
					{#each board.entries as entry (entry.id_user)}
						{@const isTop3 = entry.rank <= 3}
						{@const idx = entry.rank - 1}

						<div class="px-4 py-3 flex items-center gap-3 border-b border-white/4 last:border-0 {isTop3 ? 'bg-white/2' : ''}">
							<!-- Rank -->
							<div class="w-7 shrink-0 text-center">
								{#if isTop3}
									<i class="bi {MEDAL_ICONS[idx]} text-base {MEDAL_COLORS[idx]}"></i>
								{:else}
									<span class="text-xs text-white/35 font-semibold">#{entry.rank}</span>
								{/if}
							</div>

							<!-- Avatar -->
							<div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm border-2
								{isTop3 ? TOP_RING[idx] : 'border-white/10'}
								{isTop3 ? 'bg-linear-to-br from-white/20 to-white/5' : 'bg-white/8'}">
								{getInitial(entry)}
							</div>

							<!-- Name -->
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium truncate {isTop3 ? 'text-white' : 'text-white/85'}">{getName(entry)}</p>
								<p class="text-xs text-white/40">{entry.xp_total} XP</p>
							</div>

							<!-- Games -->
							<div class="text-right shrink-0">
								<p class="text-sm font-bold {isTop3 ? MEDAL_COLORS[idx] : 'text-white/70'}">{entry.games_played}</p>
								<p class="text-[10px] text-white/35">{gamesWord(entry.games_played)}</p>
							</div>
						</div>
					{/each}

					{#if board.entries.length === 0}
						<div class="py-12 text-center">
							<i class="bi bi-trophy text-3xl text-white/20 mb-2 block"></i>
							<p class="text-sm text-white/40">Лидерборд пока пуст</p>
						</div>
					{/if}
				</div>

			</div>
		{:else}
			<div class="text-center py-16">
				<i class="bi bi-exclamation-circle text-3xl text-white/20 mb-3 block"></i>
				<p class="text-white/40 text-sm">Не удалось загрузить лидерборд</p>
			</div>
		{/if}
	{/await}
</section>

