<script lang="ts">
	import { modal } from "$lib/context/js/store/modal.store";
	import ModalLayout from "$lib/components/ui/+modal-layout.svelte";
	import { adminSetAttendance, exportParticipantsCSV, isAttendanceEditable, slotStatus } from "$lib/context/js/admin";
	import type { AdminEvent, AdminParticipant } from "$lib/context/js/admin";

	export let event: AdminEvent;
	export let participants: AdminParticipant[];
	export let onSuccess: (() => void) | null = null;

	$: ss = slotStatus(event.members, event.max_members);
	$: attendanceEditable = isAttendanceEditable(event.event_date, event.start_time);

	let savingAttendanceId: number | null = null;

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

	const attendanceLabel = (value: boolean | null) => {
		if (value === true) return "Был";
		if (value === false) return "Не был";
		return "Не отмечено";
	};

	const attendanceClass = (value: boolean | null) => {
		if (value === true) return "bg-green-500/15 border-green-500/25 text-green-300";
		if (value === false) return "bg-red-500/15 border-red-500/25 text-red-300";
		return "bg-white/[0.04] border-white/[0.08] text-white/45";
	};

	const setAttendance = async (participant: AdminParticipant, attended: boolean) => {
		if (!attendanceEditable || savingAttendanceId !== null) return;
		savingAttendanceId = participant.id_event_member;
		try {
			const ok = await adminSetAttendance(event.id_event, participant.id_event_member, attended);
			if (!ok) return;

			participants = participants.map((item) =>
				item.id_event_member === participant.id_event_member
					? { ...item, attended }
					: item
			);

			onSuccess?.();
		} catch (e) {
			console.error(e);
		} finally {
			savingAttendanceId = null;
		}
	};
</script>

<ModalLayout
	on:close={() => modal.close()}
	roundedClass="rounded-3xl"
	maxHeightClass="max-h-[85vh]"
	bodyClass="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4 pb-6"
>
	<svelte:fragment slot="header">
		<div class="min-w-0">
			<h2 class="text-base font-bold">Участники</h2>
			<p class="text-xs text-white/40 mt-0.5 truncate">{event.event_data?.ru?.name || event.name}</p>
			<p class="text-[11px] text-white/30 mt-0.5">{event.event_date} · {event.start_time}–{event.end_time}</p>
		</div>
	</svelte:fragment>

	<svelte:fragment slot="headerActions">
		<button on:click={() => exportParticipantsCSV(event.event_data?.ru?.name || event.name, participants)}
		        class="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-green-500/15 border border-green-500/25 text-green-400 rounded-lg text-xs font-semibold active:scale-[0.97] transition-all">
			<i class="bi bi-download text-xs"></i> CSV
		</button>
	</svelte:fragment>

	<div class="flex flex-col gap-2 rounded-xl border border-white/6 bg-white/3 p-3">
		<div class="flex flex-wrap items-center gap-3">
			<div class="flex items-center gap-1.5">
				<div class={`w-2 h-2 rounded-full slot-bg ${ss}`}></div>
				<span class="text-xs text-white/60 font-semibold">{event.members} / {event.max_members} мест</span>
			</div>
			<div class="text-xs text-white/35">·</div>
			<div class="text-xs text-white/40">{recordsLabel(participants.length)}</div>
		</div>
		<div class={`px-3 py-2 rounded-lg border text-xs leading-relaxed ${attendanceEditable ? 'bg-green-500/10 border-green-500/15 text-green-300' : 'bg-amber-500/10 border-amber-500/15 text-amber-200'}`}>
			{#if attendanceEditable}
				Изменение явки открыто. Можно отметить каждого участника как «Был» или «Не был».
			{:else}
				Изменение явки закрыто. Оно доступно только с 30 минут до начала и до конца дня по варшавскому времени.
			{/if}
		</div>
	</div>

	<div class="bg-white/3 rounded-2xl border border-white/6 overflow-hidden flex flex-col" style="max-height: min(60vh, 520px)">
		{#if participants.length === 0}
			<div class="px-4 py-8 text-center text-sm text-white/35">Участников пока нет</div>
		{:else}
			<div class="overflow-y-auto overscroll-contain divide-y divide-white/4">
				{#each participants as p (p.id_event_member)}
					<div class="px-4 py-3.5 flex items-start gap-3">
						<div class="w-9 h-9 bg-white/8 border border-white/10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm text-white">
							{(p.call_sign ?? p.name).charAt(0).toUpperCase()}
						</div>
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-1.5 flex-wrap">
								<span class="text-sm font-medium text-white">{p.name}</span>
								{#if p.call_sign}<span class="text-xs text-white/40">«{p.call_sign}»</span>{/if}
							</div>
							<div class="text-xs text-white/40 mt-0.5">{p.telegram} · {p.phone}</div>
							<div class="text-[10px] text-white/25 mt-0.5">Записался: {formatRegisteredAt(p.registered_at)}</div>

							<div class="mt-3 flex flex-wrap items-center gap-2">
								<span class={`px-2 py-1 rounded-lg text-[10px] font-semibold border ${attendanceClass(p.attended)}`}>
									{attendanceLabel(p.attended)}
								</span>
								<div class="ml-auto flex gap-2">
									<button
										type="button"
										on:click={() => setAttendance(p, true)}
										disabled={!attendanceEditable || savingAttendanceId === p.id_event_member}
										class={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:cursor-not-allowed disabled:opacity-50 ${p.attended === true ? 'bg-green-500/20 border-green-500/25 text-green-300' : 'bg-white/4 border-white/8 text-white/60 hover:bg-white/8'}`}>
										{#if savingAttendanceId === p.id_event_member}<i class="bi bi-arrow-clockwise animate-spin text-[10px]"></i>{:else}Был{/if}
									</button>
									<button
										type="button"
										on:click={() => setAttendance(p, false)}
										disabled={!attendanceEditable || savingAttendanceId === p.id_event_member}
										class={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:cursor-not-allowed disabled:opacity-50 ${p.attended === false ? 'bg-red-500/20 border-red-500/25 text-red-300' : 'bg-white/4 border-white/8 text-white/60 hover:bg-white/8'}`}>
										Не был
									</button>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</ModalLayout>