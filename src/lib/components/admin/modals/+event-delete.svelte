<script lang="ts">
	import { modal } from "$lib/context/js/store/modal.store";
	import { adminDeleteEvent } from "$lib/context/js/admin";
	import type { AdminEvent } from "$lib/context/js/admin";

	export let event: AdminEvent;
	export let onSuccess: (() => void) | null = null;

	let loading = false;

	const handleDelete = async () => {
		loading = true;
		try {
			const ok = await adminDeleteEvent(event.id_event);
			if (ok) {
				onSuccess?.();
				modal.close();
			}
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	};
</script>

<div class="flex flex-col items-center pt-7 pb-5 px-6 gap-4">
	<div class="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-2xl text-red-400">
		<i class="bi bi-calendar-x-fill"></i>
	</div>
	<div class="text-center flex flex-col gap-1.5">
		<div class="text-[17px] font-semibold text-white">Удалить ивент?</div>
		<div class="text-sm text-white/50 leading-relaxed">
			Вы уверены, что хотите удалить
			<span class="text-white/70 font-medium">«{event.name}»</span>?
			Все записи участников будут отменены.
		</div>
	</div>
</div>

<div class="h-px bg-white/[0.06] mx-4"></div>

<div class="px-4 py-3 flex items-center gap-2 text-xs text-white/40">
	<i class="bi bi-calendar-event-fill text-white/25"></i>
	{event.event_date} · {event.location}
</div>

<div class="h-px bg-white/[0.06] mx-4"></div>

<div class="p-4 flex flex-col gap-2">
	<button on:click={handleDelete} disabled={loading}
		class="cursor-pointer w-full py-3.5 bg-red-500 text-white rounded-xl text-[15px] font-semibold transition-all active:scale-[0.97] disabled:opacity-60">
		{#if loading}<i class="bi bi-arrow-clockwise animate-spin mr-2"></i>{/if}
		Да, удалить
	</button>
	<button on:click={() => modal.close()}
		class="cursor-pointer w-full py-3 bg-white/[0.08] text-white rounded-xl text-[15px] font-semibold transition-all active:scale-[0.97] active:opacity-80">
		Назад
	</button>
</div>
