<script lang="ts">
	import { fadeUp } from "$lib/context/js/ui/fadeUp";
	import Header from "$lib/components/+header.svelte";
	import SkeletonReferral from "$lib/components/skeletons/+referral.svelte";
	import type { ReferralFriend } from "$lib/context/js/types/referral";
	import Referral from "$lib/components/screens/+referral.svelte";
	import { goto } from "$app/navigation";

	export let data;

	let copied = false;

	const copyCode = (code: string) => {
		navigator.clipboard.writeText(code);
		copied = true;
		setTimeout(() => (copied = false), 3000);
	};

	const shareLink = (code: string) => {
		const url = `https://t.me/SichTacticalBot?start=${code}`;
		if (navigator.share) {
			navigator.share({ title: "Sich Tactical", url });
		} else {
			navigator.clipboard.writeText(url);
		}
	};

	const getFriendName = (friend: ReferralFriend) =>
		friend.call_sign ?? `${friend.telegram_data.first_name}${friend.telegram_data.last_name ? ` ${friend.telegram_data.last_name}` : ""}`;

	const getInitial = (friend: ReferralFriend) =>
		getFriendName(friend).charAt(0).toUpperCase();
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
			<h1 class="text-lg font-bold">Реферальная программа</h1>
			<p class="text-[12px] text-white/50">Приглашайте — зарабатывайте вместе</p>
		</div>
	</div>
</Header>

<section class="md:container md:mx-auto px-4 py-4">
	{#await data.appData}
		<SkeletonReferral />
	{:then appData}
		{@const stats = appData.referralStats}
		{@const user = appData?.user}

		<div use:fadeUp={{ delayStep: 100 }}>
			<div class="opacity-0 flex flex-col gap-3">
				<div class="bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-5 border border-purple-500/30">
					<div class="bg-white/5 rounded-lg p-3 mb-3 border border-white/10">
						<div class="text-xs text-white/50 mb-1">Ваш код приглашения</div>
						<div class="flex items-center justify-between gap-2">
							<code class="text-md font-mono font-bold text-purple-300">{user.referral_code}</code>
						</div>
					</div>

					<div class="flex">
						<button on:click={() => copyCode("123")} class="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2">
							<i class="bi bi-copy"></i>
							{copied ? "Скопировано!" : "Копировать"}
						</button>
					</div>
				</div>

				<!-- Rewards info -->
				<div class="bg-[#1a1a2e] rounded-2xl p-4 border border-white/5">
					<h3 class="text-sm font-semibold text-white/70 uppercase tracking-wide mb-3">Что вы получаете</h3>
					<div class="space-y-2.5">
						<div class="flex items-start gap-3">
							<div class="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center shrink-0">
								<i class="bi bi-star-fill text-purple-400 text-sm"></i>
							</div>
							<div>
								<p class="text-sm font-medium">500 XP + 15 zł</p>
								<p class="text-xs text-white/50">За первую игру вашего друга</p>
							</div>
						</div>
						<div class="flex items-start gap-3">
							<div class="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center shrink-0">
								<i class="bi bi-gift-fill text-pink-400 text-sm"></i>
							</div>
							<div>
								<p class="text-sm font-medium">Друг получает 200 XP + 20 zł</p>
								<p class="text-xs text-white/50">После двух первых сыгранных игр</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Stats grid -->
				<div class="flex flex-col gap-2.5">
					<div class="grid grid-cols-2 gap-2.5">
						<div class="bg-[#1a1a2e] rounded-xl p-3.5 border border-white/5 text-center">
							<div class="text-xs text-white/50 uppercase tracking-wide mb-1">Приглашено</div>
							<div class="text-2xl font-bold">{stats?.total_invited}</div>
						</div>
						<div class="bg-[#1a1a2e] rounded-xl p-3.5 border border-white/5 text-center">
							<div class="text-xs text-white/50 uppercase tracking-wide mb-1">Игр сыграно</div>
							<div class="text-2xl font-bold">{stats?.total_games_by_friends}</div>
						</div>
					</div>

					<div class="bg-[#1a1a2e] rounded-xl p-3.5 border border-white/5 text-center">
						<div class="text-xs text-white/50 uppercase tracking-wide mb-1">Баланс с рефералов</div>
						<div class="text-2xl font-bold">{stats?.total_balance_earned.toFixed(2)} <span class="text-base">zł</span></div>
					</div>
				</div>

				<!-- Friends list -->
				<div class="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden">
					<div class="px-4 py-3 border-b border-white/5 flex items-center justify-between">
						<h3 class="text-sm font-semibold">Приглашённые друзья</h3>
						<span class="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{stats?.friends.length}</span>
					</div>

					{#if (stats?.friends.length || 0) > 0}
						{#each stats?.friends as friend (friend.id_user)}
							<div class="px-4 py-3 flex items-center gap-3 border-b border-white/4 last:border-0">
								<div class="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm">
									{getInitial(friend)}
								</div>
								<div class="flex-1 min-w-0">
									<p class="text-sm font-medium truncate">{getFriendName(friend)}</p>
									<p class="text-xs text-white/45">{friend.games_played} {friend.games_played === 1 ? 'игра' : friend.games_played < 5 ? 'игры' : 'игр'} · {friend.xp_total} XP</p>
								</div>
								<div class="text-right shrink-0">
									<p class="text-xs font-semibold text-green-400">+{friend.games_played * 15} zł</p>
								</div>
							</div>
						{/each}
					{:else}
						<div class="py-10 text-center">
							<i class="bi bi-people text-3xl text-white/20 mb-2 block"></i>
							<p class="text-sm text-white/40">Вы ещё никого не пригласили</p>
							<p class="text-xs text-white/25 mt-1">Поделитесь кодом с друзьями</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/await}
</section>

