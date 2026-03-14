<script lang="ts">
	import { modal } from "$lib/context/js/store/modal.store";
	import { adminSetAdmin, adminBanUser } from "$lib/context/js/admin";
	import type { AdminUser } from "$lib/context/js/admin";

	export let user: AdminUser;
	export let onSuccess: (() => void) | null = null;

	let loadingRole = false;
	let loadingBan = false;

	const handleToggleAdmin = async () => {
		loadingRole = true;
		try {
			const ok = await adminSetAdmin(user.id_user, !user.is_admin);
			if (ok) {
				onSuccess?.();
				modal.close();
			}
		} catch (e) {
			console.error(e);
		} finally {
			loadingRole = false;
		}
	};

	const handleBan = async () => {
		loadingBan = true;
		try {
			const ok = await adminBanUser(user.id_user);
			if (ok) {
				onSuccess?.();
				modal.close();
			}
		} catch (e) {
			console.error(e);
		} finally {
			loadingBan = false;
		}
	};
</script>

<div class="w-full max-w-lg bg-[#1a1a2e] border border-white/[0.08] rounded-t-3xl overflow-hidden max-h-[80vh] flex flex-col">
	<div class="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/[0.06]">
		<div class="flex items-center gap-3">
			<div class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2
				{user.is_admin ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-white/8 border-white/15 text-white'}">
				{(user.call_sign ?? user.name).charAt(0).toUpperCase()}
			</div>
			<div>
				<div class="flex items-center gap-2">
					<h2 class="text-base font-bold">{user.call_sign ?? user.name}</h2>
					{#if user.is_admin}
						<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/15 text-red-400 border border-red-500/25">ADMIN</span>
					{/if}
				</div>
				<p class="text-xs text-white/40">{user.name}</p>
			</div>
		</div>
		<button on:click={() => modal.close()} aria-label="Закрыть" class="cursor-pointer w-8 h-8 bg-white/[0.06] rounded-full flex items-center justify-center active:scale-95 transition-all">
			<i class="bi bi-x-lg text-sm text-white/60"></i>
		</button>
	</div>

	<div class="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-3">
		<div class="grid grid-cols-3 gap-2">
			<div class="bg-blue-500/10 rounded-xl p-3 border border-blue-500/15 text-center">
				<div class="text-[10px] text-white/40 uppercase tracking-wide">Уровень</div>
				<div class="text-xl font-bold text-blue-400 mt-0.5">{Math.floor(user.xp / 200) + 1}</div>
			</div>
			<div class="bg-green-500/10 rounded-xl p-3 border border-green-500/15 text-center">
				<div class="text-[10px] text-white/40 uppercase tracking-wide">Игры</div>
				<div class="text-xl font-bold text-green-400 mt-0.5">{user.games}</div>
			</div>
			<div class="bg-purple-500/10 rounded-xl p-3 border border-purple-500/15 text-center">
				<div class="text-[10px] text-white/40 uppercase tracking-wide">XP</div>
				<div class="text-xl font-bold text-purple-400 mt-0.5">{user.xp}</div>
			</div>
		</div>

		<div class="bg-white/[0.03] rounded-2xl border border-white/[0.06] overflow-hidden">
			{#each [
				{ icon: "bi-telegram", label: "Telegram", value: user.telegram },
				{ icon: "bi-telephone-fill", label: "Телефон", value: user.phone },
				{ icon: "bi-wallet2", label: "Баланс", value: user.balance },
				{ icon: "bi-calendar-check-fill", label: "Дата входа", value: user.joined },
				{ icon: "bi-person-badge-fill", label: "ID", value: `#${user.id_user}` },
			] as row}
				<div class="px-4 py-3 flex items-center gap-3 border-b border-white/[0.04] last:border-0">
					<div class="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
						<i class="bi {row.icon} text-xs text-white/40"></i>
					</div>
					<div class="flex-1">
						<div class="text-[10px] text-white/30 uppercase tracking-wide">{row.label}</div>
						<div class="text-sm text-white/80">{row.value}</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="flex flex-col gap-2 mt-1">
			<button on:click={handleToggleAdmin} disabled={loadingRole}
				class="cursor-pointer w-full py-3 bg-white/[0.06] text-white/60 rounded-xl text-sm font-semibold active:scale-[0.97] active:opacity-80 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
				{#if loadingRole}<i class="bi bi-arrow-clockwise animate-spin"></i>{:else}<i class="bi bi-shield-fill-check text-sm"></i>{/if}
				{user.is_admin ? "Снять права администратора" : "Назначить администратором"}
			</button>
			<button on:click={handleBan} disabled={loadingBan}
				class="cursor-pointer w-full py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-semibold active:scale-[0.97] active:opacity-80 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
				{#if loadingBan}<i class="bi bi-arrow-clockwise animate-spin"></i>{:else}<i class="bi bi-ban text-sm"></i>{/if}
				Заблокировать пользователя
			</button>
		</div>
	</div>
</div>
