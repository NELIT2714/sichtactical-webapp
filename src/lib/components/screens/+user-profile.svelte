<script lang="ts">
	import type { User } from "$lib/types/user";
	import { progressForXP } from "$lib/context/js/xp";
	import { fadeUp } from "$lib/context/js/ui/fadeUp";

	export let user: User;
	export let topUpEnabled: boolean = false;

	$: ({ level, experience, experienceToNextLevel, levelProgress } = progressForXP(user.xp_total));
</script>

<section class="px-4 opacity-0">
	<div class="md:container md:mx-auto bg-[#1a1a2e] rounded-2xl p-4 border border-blue-500/15 shadow-xl space-y-3">
		<div class="space-y-1">
			<h2 class="text-2xl font-bold">
				{user.call_sign || `${user.telegram_data.first_name}${user.telegram_data.last_name ? ` ${user.telegram_data.last_name}` : ""}`}
			</h2>

			<div class="space-y-1.5">
				<div class="flex justify-between items-center">
					<span class="text-xs text-white/50">Опыт до следующего уровня</span>
					<span class="text-xs font-semibold text-white/70">{experience} / {experienceToNextLevel} XP</span>
				</div>
				<div class="h-2 bg-white/[0.08] rounded-full overflow-hidden">
					<div class="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-700 transition-all duration-500" style="width: {levelProgress}%;"></div>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-2.5">
			<div class="bg-blue-500/10 rounded-lg p-2.5 border border-blue-500/20 text-center">
				<div class="text-xs text-white/50 uppercase tracking-wide">Уровень</div>
				<div class="text-lg font-bold text-blue-400">{level}</div>
			</div>

			<div class="bg-green-500/10 rounded-lg p-2.5 border border-green-500/20 text-center">
				<div class="text-xs text-white/50 uppercase tracking-wide">Игры</div>
				<div class="text-lg font-bold text-green-400">{user.games_played || 0}</div>
			</div>

<!--			<div class="bg-purple-500/10 rounded-lg p-2.5 border border-purple-500/20 text-center">-->
<!--				<div class="text-xs text-white/50 uppercase tracking-wide">XP</div>-->
<!--				<div class="text-lg font-bold text-purple-400">{user.xp_total}</div>-->
<!--			</div>-->
		</div>

<!--		<div class="border-t border-white/10 pt-3">-->
<!--			<div class="mb-3 p-2 rounded-md bg-red-600/50 border border-red-500/50 text-sm text-white/90 flex items-start gap-2">-->
<!--				<i class="bi bi-exclamation-circle-fill text-base flex-shrink-0 opacity-90"></i>-->
<!--				<div class="space-y-0.5">-->
<!--					<div class="font-semibold">Пополнение временно отключено</div>-->
<!--					<div class="text-xs opacity-85">Средства можно получить только с реферальной системы. В скором времени включим пополнения</div>-->
<!--				</div>-->
<!--			</div>-->

<!--			<div class="flex items-center justify-between">-->
<!--				<div class="space-y-0.5">-->
<!--					<div class="text-xs text-white/50 uppercase tracking-wide">Баланс</div>-->
<!--					<div class="text-2xl font-bold text-white">{user.balance.toFixed(2)} zł</div>-->
<!--				</div>-->

<!--				<button title="Пополнение" disabled={!topUpEnabled} class={topUpEnabled-->
<!--					? "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm border border-transparent bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400"-->
<!--					: "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm border border-white/10 bg-white/8 text-white/60 opacity-80 cursor-not-allowed ring-1 ring-white/6 pointer-events-none"}>-->
<!--					<i class="bi bi-plus-lg text-sm"></i>-->
<!--				</button>-->
<!--			</div>-->
<!--		</div>-->
	</div>
</section>
