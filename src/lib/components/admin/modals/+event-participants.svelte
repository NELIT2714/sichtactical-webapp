<script lang="ts">
	import { modal } from "$lib/context/js/store/modal.store";
	import { exportParticipantsCSV, slotStatus, adminSetAttendance } from "$lib/context/js/admin";
	import type { AdminEvent, AdminParticipant } from "$lib/context/js/admin";

	export let event: AdminEvent;
	export let participants: AdminParticipant[];

	$: ss = slotStatus(event.members, event.max_members);
	let updatingId: number | null = null;

	const setAttendance = async (p: AdminParticipant, attended: boolean) => {
		if (updatingId) return;
		updatingId = p.id_user;
		try {
			const ok = await adminSetAttendance(event.id_event, p.id_user, attended);
			if (ok) {
				participants = participants.map(x => x.id_user === p.id_user ? { ...x, attended } : x);
			}
		} finally {
			updatingId = null;
		}
	};
</script>

<div class="w-full max-w-lg bg-[#1a1a2e] border border-white/[0.08] rounded-t-3xl overflow-hidden max-h-[85vh] flex flex-col">
	<div class="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/[0.06]">
		<div>
			<h2 class="text-base font-bold">Участники</h2>
			<p class="text-xs text-white/40 mt-0.5">{event.name} · {event.event_date}</p>
		</div>
		<div class="flex items-center gap-2">
			<button on:click={() => exportParticipantsCSV(event.name, participants)}
				class="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-green-500/15 border border-green-500/25 text-green-400 rounded-lg text-xs font-semibold active:scale-[0.97] transition-all">
				<i class="bi bi-download text-xs"></i> CSV
			</button>
			<button on:click={() => modal.close()} aria-label="Закрыть" class="cursor-pointer w-8 h-8 bg-white/[0.06] rounded-full flex items-center justify-center active:scale-95 transition-all">
				<i class="bi bi-x-lg text-sm text-white/60"></i>
			</button>
		</div>
	</div>

	<div class="px-5 py-3 flex gap-4 border-b border-white/[0.05]">
		<div class="flex items-center gap-1.5">
			<div class="w-2 h-2 rounded-full slot-bg {ss}"></div>
			<span class="text-xs text-white/60 font-semibold">{event.members} / {event.max_members} мест</span>
		</div>
		<div class="text-xs text-white/35">·</div>
		<div class="text-xs text-white/40">{participants.length} записей</div>
	</div>

	<div class="overflow-y-auto flex-1">
		{#each participants as p (p.id_user)}
			<div class="px-4 py-3.5 border-b border-white/[0.04] last:border-0 flex items-start gap-3">
				<div class="w-9 h-9 bg-white/8 border border-white/10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm text-white">
					{(p.call_sign ?? p.name).charAt(0).toUpperCase()}
				</div>
				<div class="flex-1 min-w-0">
					<div class="flex items-center gap-1.5">
						<span class="text-sm font-medium text-white">{p.name}</span>
						{#if p.call_sign}<span class="text-xs text-white/40">«{p.call_sign}»</span>{/if}
					</div>
					<div class="text-xs text-white/40 mt-0.5">{p.telegram} · {p.phone}</div>
					<div class="text-[10px] text-white/25 mt-0.5">Записался: {p.registered_at} · {p.games} игр</div>
				</div>
				<div class="flex flex-col gap-1 items-end shrink-0">
					<span class="text-[10px] text-white/35">Явка</span>
					<div class="flex gap-1.5">
						<button on:click={() => setAttendance(p, true)} disabled={updatingId === p.id_user}
							class="cursor-pointer px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all
								{p.attended === true ? 'bg-green-500/20 border-green-500/30 text-green-300' : 'bg-white/[0.03] border-white/10 text-white/50 hover:text-white/80'}
								disabled:opacity-60 active:scale-95">
							{#if updatingId === p.id_user}
								<i class="bi bi-arrow-clockwise animate-spin"></i>
							{:else}
								Был
							{/if}
						</button>
						<button on:click={() => setAttendance(p, false)} disabled={updatingId === p.id_user}
							class="cursor-pointer px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all
								{p.attended === false ? 'bg-red-500/20 border-red-500/30 text-red-300' : 'bg-white/[0.03] border-white/10 text-white/50 hover:text-white/80'}
								disabled:opacity-60 active:scale-95">
							{#if updatingId === p.id_user}
								<i class="bi bi-arrow-clockwise animate-spin"></i>
							{:else}
								Не был
							{/if}
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
