<script lang="ts">
	import { modal } from "$lib/context/js/store/modal.store";
	import ModalLayout from "$lib/components/ui/+modal-layout.svelte";
	import { exportParticipantsCSV, slotStatus } from "$lib/context/js/admin";
	import type { AdminEvent, AdminParticipant } from "$lib/context/js/admin";

	export let event: AdminEvent;
	export let participants: AdminParticipant[];

	$: ss = slotStatus(event.members, event.max_members);

	const formatRegisteredAt = (dateStr?: string | null) => {
		if (!dateStr) return "—";
		const d = new Date(dateStr);
		if (isNaN(d.getTime())) return dateStr;
		return d.toLocaleString('ru-RU', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).replace(/\u00A0/g, ' ');
	};

	const recordsLabel = (count: number) => {
		const n = Math.abs(count) % 100;
		const n1 = n % 10;
		if (n > 10 && n < 20) return `${count} записей`;
		if (n1 === 1) return `${count} запись`;
		if (n1 >= 2 && n1 <= 4) return `${count} записи`;
		return `${count} записей`;
	};
</script>

<ModalLayout
	on:close={() => modal.close()}
	roundedClass="rounded-3xl"
	maxHeightClass="max-h-[85vh]"
	bodyClass="overflow-y-auto flex-1"
>
	<svelte:fragment slot="header">
		<div>
			<h2 class="text-base font-bold">Участники</h2>
			<p class="text-xs text-white/40 mt-0.5">{event.event_data?.ru?.name || event.name} <br> {event.event_date}</p>
		</div>
	</svelte:fragment>

	<svelte:fragment slot="headerActions">
		<button on:click={() => exportParticipantsCSV(event.event_data?.ru?.name || event.name, participants)}
			class="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-green-500/15 border border-green-500/25 text-green-400 rounded-lg text-xs font-semibold active:scale-[0.97] transition-all">
			<i class="bi bi-download text-xs"></i> CSV
		</button>
	</svelte:fragment>

	<div class="px-5 py-3 flex gap-4 border-b border-white/[0.05]">
		<div class="flex items-center gap-1.5">
			<div class="w-2 h-2 rounded-full slot-bg {ss}"></div>
			<span class="text-xs text-white/60 font-semibold">{event.members} / {event.max_members} мест</span>
		</div>
		<div class="text-xs text-white/35">·</div>
		<div class="text-xs text-white/40">{recordsLabel(participants.length)}</div>
	</div>

	<div>
		{#each participants as p (p.id_event_member)}
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
					<div class="text-[10px] text-white/25 mt-0.5">Записался: {formatRegisteredAt(p.registered_at)}</div>
				</div>
			</div>
		{/each}
	</div>
</ModalLayout>
