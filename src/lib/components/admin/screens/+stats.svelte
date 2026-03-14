<script lang="ts">
	import type { AdminStats, AdminActivity } from "$lib/context/js/admin";

	export let stats: AdminStats;
	export let activity: AdminActivity[];
	export let onNavigate: (tab: "events" | "users" | "notifications") => void;
</script>

<div class="px-4 pt-4 flex flex-col gap-4">
	<!-- Stat cards -->
	<div class="grid grid-cols-2 gap-3">
		<div class="bg-[#1a1a2e] rounded-2xl p-4 border border-blue-500/15 flex flex-col gap-1">
			<div class="text-[11px] text-white/40 uppercase tracking-wide">Всего юзеров</div>
			<div class="text-3xl font-bold text-white">{stats.totalUsers}</div>
			<div class="text-xs text-blue-400 flex items-center gap-1"><i class="bi bi-arrow-up-right"></i>+12 за месяц</div>
		</div>
		<div class="bg-[#1a1a2e] rounded-2xl p-4 border border-green-500/15 flex flex-col gap-1">
			<div class="text-[11px] text-white/40 uppercase tracking-wide">Активных</div>
			<div class="text-3xl font-bold text-green-400">{stats.activeUsers}</div>
			<div class="text-xs text-white/40 flex items-center gap-1"><i class="bi bi-person-check"></i>за 30 дней</div>
		</div>
		<div class="bg-[#1a1a2e] rounded-2xl p-4 border border-purple-500/15 flex flex-col gap-1">
			<div class="text-[11px] text-white/40 uppercase tracking-wide">Всего ивентов</div>
			<div class="text-3xl font-bold text-purple-400">{stats.totalEvents}</div>
			<div class="text-xs text-white/40 flex items-center gap-1"><i class="bi bi-calendar3"></i>{stats.upcomingEvents} предстоит</div>
		</div>
		<div class="bg-[#1a1a2e] rounded-2xl p-4 border border-yellow-500/15 flex flex-col gap-1">
			<div class="text-[11px] text-white/40 uppercase tracking-wide">Сыграно</div>
			<div class="text-3xl font-bold text-yellow-400">{stats.totalGames}</div>
			<div class="text-xs text-white/40 flex items-center gap-1"><i class="bi bi-people"></i>~{stats.avgPlayers} чел./игра</div>
		</div>
	</div>

	<!-- Revenue -->
	<div class="bg-[#1a1a2e] rounded-2xl p-4 border border-white/5">
		<div class="text-[11px] text-white/40 uppercase tracking-wide mb-3">Выручка</div>
		<div class="flex items-end justify-between">
			<div>
				<div class="text-[11px] text-white/40 mb-0.5">За всё время</div>
				<div class="text-2xl font-bold text-white">{stats.totalRevenue}</div>
			</div>
			<div class="text-right">
				<div class="text-[11px] text-white/40 mb-0.5">Этот месяц</div>
				<div class="text-xl font-bold text-green-400">{stats.thisMonthRevenue}</div>
			</div>
		</div>
		<div class="mt-4 flex items-end gap-1.5 h-16">
			{#each [40, 65, 55, 80, 70, 90, 60, 75, 85, 95, 72, 88] as h, i}
				<div class="flex-1 rounded-sm" style="height: {h}%; background: {i === 11 ? 'rgb(59 130 246)' : 'rgba(255,255,255,0.08)'}"></div>
			{/each}
		</div>
		<div class="flex justify-between mt-1">
			{#each ["Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек","Янв","Фев","Мар"] as m}
				<div class="text-[9px] text-white/25">{m}</div>
			{/each}
		</div>
	</div>

	<!-- Recent activity -->
	<div class="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden">
		<div class="px-4 py-3 border-b border-white/5">
			<div class="text-[11px] text-white/40 uppercase tracking-wide">Последняя активность</div>
		</div>
		{#each activity as act}
			<div class="px-4 py-3 border-b border-white/[0.04] last:border-0 flex items-center gap-3">
				<div class="w-8 h-8 {act.color} rounded-lg flex items-center justify-center shrink-0">
					<i class="bi {act.icon} text-xs text-white"></i>
				</div>
				<div class="flex-1 min-w-0">
					<p class="text-xs text-white/80 truncate">{act.text}</p>
					<p class="text-[10px] text-white/35 mt-0.5">{act.time}</p>
				</div>
			</div>
		{/each}
	</div>

	<!-- Quick nav -->
	<div class="grid grid-cols-3 gap-2">
		<button on:click={() => onNavigate("events")}
			class="bg-[#1a1a2e] border border-white/5 rounded-2xl p-3 flex flex-col items-center gap-2 active:scale-[0.97] transition-all cursor-pointer">
			<div class="w-10 h-10 bg-blue-500/15 border border-blue-500/20 rounded-xl flex items-center justify-center"><i class="bi bi-calendar3 text-blue-400 text-base"></i></div>
			<span class="text-[10px] text-white/60 font-medium">Ивенты</span>
		</button>
		<button on:click={() => onNavigate("users")}
			class="bg-[#1a1a2e] border border-white/5 rounded-2xl p-3 flex flex-col items-center gap-2 active:scale-[0.97] transition-all cursor-pointer">
			<div class="w-10 h-10 bg-green-500/15 border border-green-500/20 rounded-xl flex items-center justify-center"><i class="bi bi-people-fill text-green-400 text-base"></i></div>
			<span class="text-[10px] text-white/60 font-medium">Юзеры</span>
		</button>
		<button on:click={() => onNavigate("notifications")}
			class="bg-[#1a1a2e] border border-white/5 rounded-2xl p-3 flex flex-col items-center gap-2 active:scale-[0.97] transition-all cursor-pointer">
			<div class="w-10 h-10 bg-orange-500/15 border border-orange-500/20 rounded-xl flex items-center justify-center"><i class="bi bi-megaphone-fill text-orange-400 text-base"></i></div>
			<span class="text-[10px] text-white/60 font-medium">Нотификации</span>
		</button>
	</div>
</div>
