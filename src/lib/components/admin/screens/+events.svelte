<script lang="ts">
	import { slide } from "svelte/transition";
	import { modal } from "$lib/context/js/store/modal.store";
	import { slotStatus, adminGetParticipants } from "$lib/context/js/admin";
	import type { AdminEvent } from "$lib/context/js/admin";

	import EventUpsert from "$lib/components/admin/modals/+event-upsert.svelte";
	import EventParticipants from "$lib/components/admin/modals/+event-participants.svelte";
	import EventDelete from "$lib/components/admin/modals/+event-delete.svelte";

	export let events: AdminEvent[];
	export let onRefresh: (() => void) | null = null;

	type FilterVal = "all" | "upcoming" | "active" | "finished";
	let eventFilter: FilterVal = "all";
	$: filteredEvents = eventFilter === "all" ? events : events.filter(e => e.status === eventFilter);

	const filterOptions: { val: FilterVal; label: string }[] = [
		{ val: "all", label: "Все" },
		{ val: "upcoming", label: "Предстоит" },
		{ val: "finished", label: "Завершён" },
	];

	const statusLabel: Record<string, string> = {
		upcoming: "Предстоит", active: "Активен", finished: "Завершён",
	};
	const statusClass: Record<string, string> = {
		upcoming: "bg-blue-500/15 text-blue-400 border-blue-500/30",
		active: "bg-green-500/15 text-green-400 border-green-500/30",
		finished: "bg-white/5 text-white/40 border-white/10",
	};

	const openCreate = () => {
		modal.openBottom(EventUpsert, { mode: "create", event: null, onSuccess: onRefresh });
	};

	const openEdit = (ev: AdminEvent) => {
		modal.openBottom(EventUpsert, { mode: "edit", event: ev, onSuccess: onRefresh });
	};

	const openDelete = (ev: AdminEvent) => {
		modal.openBottom(EventDelete, { event: ev, onSuccess: onRefresh });
	};

	const openParticipants = async (ev: AdminEvent) => {
		const participants = await adminGetParticipants(ev.id_event);
		modal.openBottom(EventParticipants, { event: ev, participants, onSuccess: onRefresh });
	};
</script>

<div class="px-4 pt-4 flex flex-col gap-3">
	<div class="flex items-center justify-between">
		<div class="text-sm text-white/50">{filteredEvents.length} ивентов</div>
		<button on:click={openCreate}
			class="cursor-pointer flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold active:scale-[0.97] transition-all">
			<i class="bi bi-plus-lg text-base leading-none"></i> Создать
		</button>
	</div>

	<div class="flex gap-1.5 flex-wrap">
		{#each filterOptions as opt}
			<button on:click={() => (eventFilter = opt.val)}
				class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer
					{eventFilter === opt.val ? 'bg-white/10 border-white/20 text-white' : 'bg-white/[0.03] border-white/5 text-white/40'}">
				{opt.label}
			</button>
		{/each}
	</div>

	{#each filteredEvents as ev (ev.id_event)}
		{@const ss = slotStatus(ev.members, ev.max_members)}
		<div class="bg-[#1a1a2e] rounded-2xl border border-white/[0.08] overflow-hidden" transition:slide={{ duration: 200 }}>
			<div class="p-4 flex flex-col gap-3">
				<div class="flex items-start justify-between gap-2">
					<div class="flex-1 min-w-0">
						<div class="font-semibold text-[15px] truncate">{ev.name}</div>
						<div class="text-xs text-white/40 mt-0.5">{ev.event_date} · {ev.start_time} - {ev.end_time}</div>
					</div>
					<span class="px-2 py-1 rounded-lg text-[10px] font-semibold border shrink-0 {statusClass[ev.status]}">{statusLabel[ev.status]}</span>
				</div>
				<div class="flex flex-col gap-1.5">
					<div class="flex items-center gap-2 text-xs text-white/50"><i class="bi bi-geo-alt-fill text-white/30"></i><span>{ev.location}</span></div>
					<div class="flex items-center gap-2 text-xs text-white/50"><i class="bi bi-credit-card-fill text-white/30"></i><span>{ev.cost}</span></div>
				</div>
				<div class="flex flex-col gap-1">
					<div class="flex justify-between items-center">
						<span class="text-[11px] text-white/40">Участники</span>
						<span class="text-[11px] font-semibold slot-text {ss}">{ev.members}/{ev.max_members}</span>
					</div>
					<div class="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
						<div class="h-full rounded-full slot-bg {ss}" style="width: {Math.min((ev.members / ev.max_members) * 100, 100)}%"></div>
					</div>
				</div>
				<div class="flex gap-2 pt-1 border-t border-white/[0.06]">
					<button on:click={() => openParticipants(ev)}
						class="cursor-pointer flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white/[0.06] hover:bg-white/10 text-white/70 rounded-xl text-xs font-semibold transition-all active:scale-[0.97]">
						<i class="bi bi-people-fill"></i> Участники ({ev.members})
					</button>
					<button on:click={() => openEdit(ev)} aria-label="Редактировать"
						class="cursor-pointer w-10 h-10 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl flex items-center justify-center transition-all active:scale-[0.97]">
						<i class="bi bi-pencil-fill text-blue-400 text-sm"></i>
					</button>
					<button on:click={() => openDelete(ev)} aria-label="Удалить"
						class="cursor-pointer w-10 h-10 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl flex items-center justify-center transition-all active:scale-[0.97]">
						<i class="bi bi-trash3-fill text-red-400 text-sm"></i>
					</button>
				</div>
			</div>
		</div>
	{/each}

	{#if filteredEvents.length === 0}
		<div class="py-16 text-center">
			<i class="bi bi-calendar-x text-4xl text-white/15 block mb-3"></i>
			<p class="text-white/40 text-sm">Ивентов нет</p>
		</div>
	{/if}
</div>

