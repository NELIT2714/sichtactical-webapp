<script lang="ts">
	import { modal } from "$lib/context/js/store/modal.store";
	import type { AdminUser } from "$lib/context/js/admin";
	import UserDetail from "$lib/components/admin/modals/+user-detail.svelte";

	export let users: AdminUser[];
	export let onRefresh: (() => void) | null = null;

	let userSearch = "";
	$: filteredUsers = users.filter(u =>
		u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
		(u.call_sign ?? "").toLowerCase().includes(userSearch.toLowerCase()) ||
		u.telegram.toLowerCase().includes(userSearch.toLowerCase())
	);

	const openUserDetail = (u: AdminUser) => {
		modal.openBottom(UserDetail, { user: u, onSuccess: onRefresh });
	};
</script>

<div class="px-4 pt-4 flex flex-col gap-3">
	<div class="relative">
		<i class="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm"></i>
		<input bind:value={userSearch} type="text" placeholder="Поиск по имени, позывному, Telegram..."
			class="w-full bg-[#1a1a2e] border border-white/[0.08] rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-blue-500/50 transition-all"/>
	</div>
	<div class="text-[11px] text-white/35 uppercase tracking-wide">{filteredUsers.length} пользователей</div>

	<div class="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden">
		{#each filteredUsers as u (u.id_user)}
			<button on:click={() => openUserDetail(u)}
				class="w-full px-4 py-3.5 flex items-center gap-3 border-b border-white/[0.04] last:border-0 active:bg-white/5 transition-all cursor-pointer text-left">
				<div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm border-2
					{u.is_admin ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-white/8 border-white/10 text-white'}">
					{(u.call_sign ?? u.name).charAt(0).toUpperCase()}
				</div>
				<div class="flex-1 min-w-0">
					<div class="flex items-center gap-1.5">
						<span class="text-sm font-medium text-white truncate">{u.call_sign ?? u.name}</span>
						{#if u.is_admin}
							<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/15 text-red-400 border border-red-500/25 shrink-0">ADMIN</span>
						{/if}
					</div>
					<div class="text-xs text-white/40 truncate">{u.telegram} · {u.games} игр · {u.xp} XP</div>
				</div>
				<i class="bi bi-chevron-right text-white/20 text-sm shrink-0"></i>
			</button>
		{/each}
		{#if filteredUsers.length === 0}
			<div class="py-12 text-center">
				<i class="bi bi-search text-3xl text-white/15 block mb-2"></i>
				<p class="text-sm text-white/40">Ничего не найдено</p>
			</div>
		{/if}
	</div>
</div>
