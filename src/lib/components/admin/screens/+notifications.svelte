<script lang="ts">
	import { modal } from "$lib/context/js/store/modal.store";
	import { CATEGORY_CONFIG } from "$lib/context/js/notifications";
	import type { AdminNotification } from "$lib/context/js/admin";
	import NotifCreate from "$lib/components/admin/modals/+notif-create.svelte";
	import NotifDelete from "$lib/components/admin/modals/+notif-delete.svelte";

	export let notifications: AdminNotification[];
	export let totalUsers: number;
	export let onRefresh: (() => void) | null = null;

	const categoryLabels: Record<string, string> = {
		EVENT: "Событие", SIGNUP: "Запись", ACHIEVEMENT: "Достижение", ANNOUNCEMENT: "Объявление", SYSTEM: "Система",
	};

	const openCreate = () => {
		modal.openBottom(NotifCreate, { totalUsers, onSuccess: onRefresh });
	};

	const openDelete = (n: AdminNotification) => {
		modal.openBottom(NotifDelete, { notification: n, onSuccess: onRefresh });
	};
</script>

<div class="px-4 pt-4 flex flex-col gap-3">
	<div class="flex items-center justify-between">
		<div class="text-sm text-white/50">{notifications.length} уведомлений</div>
		<button on:click={openCreate}
			class="cursor-pointer flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold active:scale-[0.97] transition-all">
			<i class="bi bi-plus-lg text-base leading-none"></i> Создать
		</button>
	</div>

	{#each notifications as n (n.id_notification)}
		{@const cfg = CATEGORY_CONFIG[n.category]}
		<div class="bg-[#1a1a2e] rounded-2xl border border-white/[0.08] overflow-hidden">
			<div class="p-4 flex gap-3 items-start">
				<div class="w-10 h-10 {cfg.bgClass} rounded-xl flex items-center justify-center shrink-0">
					<i class="bi {cfg.icon} text-sm text-white"></i>
				</div>
				<div class="flex-1 min-w-0">
					<div class="flex items-center gap-2 mb-0.5">
						<span class="text-sm font-semibold text-white truncate">{n.title}</span>
						<span class="px-2 py-0.5 rounded-md text-[9px] font-bold bg-white/5 text-white/40 border border-white/8 shrink-0">{categoryLabels[n.category]}</span>
					</div>
					<p class="text-xs text-white/55 leading-relaxed line-clamp-2">{n.description}</p>
					<div class="flex items-center gap-3 mt-2">
						<span class="text-[10px] text-white/30">{n.created_at}</span>
						<span class="text-[10px] text-white/30 flex items-center gap-1">
							<i class="bi bi-send-fill text-[9px]"></i>{n.sent_to} получателей
						</span>
					</div>
				</div>
			</div>
			<div class="h-px bg-white/[0.05] mx-4"></div>
			<div class="px-4 py-2.5 flex justify-end gap-2">
				<button on:click={() => openDelete(n)}
					class="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg text-xs font-semibold transition-all active:scale-[0.97]">
					<i class="bi bi-trash3-fill text-xs"></i> Удалить
				</button>
			</div>
		</div>
	{/each}

	{#if notifications.length === 0}
		<div class="py-16 text-center">
			<i class="bi bi-megaphone text-4xl text-white/15 block mb-3"></i>
			<p class="text-white/40 text-sm">Уведомлений нет</p>
		</div>
	{/if}
</div>
