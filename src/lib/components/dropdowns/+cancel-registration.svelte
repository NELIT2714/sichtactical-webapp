<script lang="ts">
	import { modal } from "$lib/context/js/store/modal.store";
	import LoadButton from "$lib/components/ui/+load-button.svelte";

	export let eventName : string;
	export let eventDate : Date;
	export let eventLocation : string;
	export let eventStartTime : string;
	export let onConfirm: () => Promise<void>;

	let loading = false;

	const handleConfirm = async () => {
		try {
			loading = true;
			await onConfirm();
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
		<div class="text-[17px] font-semibold text-white">Отменить запись?</div>
		<div class="text-sm text-white/50 leading-relaxed">
			Вы уверены, что хотите отменить запись на
			<span class="text-white/70 font-medium">«{eventName}»</span>?
			Ваше место может занять другой участник.
		</div>
	</div>
</div>

<div class="h-px bg-white/[0.06] mx-4"></div>

<div class="px-4 py-3 flex items-center gap-2.5">
	<div class="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center text-sm text-white/40">
		<i class="bi bi-calendar-event-fill"></i>
	</div>
	<div class="text-[13px] text-white/50">
		{eventDate.toLocaleDateString('ru-RU', {day: '2-digit', month: 'long' })} - {eventStartTime} · {eventLocation}
	</div>
</div>

<div class="h-px bg-white/[0.06] mx-4"></div>

<div class="p-4 flex flex-col gap-2">
	<LoadButton on:click={handleConfirm} {loading} styles="w-full py-3.5 bg-red-500 text-white rounded-xl text-[15px] font-semibold transition-all active:scale-[0.97] cursor-pointer flex items-center justify-center gap-2 disabled:bg-red-500/70 disabled:text-white/70 disabled:cursor-not-allowed">
		Да, отменить запись
	</LoadButton>

	<button on:click={() => modal.close()} class="w-full py-3 bg-white/[0.08] text-white rounded-xl text-[15px] font-semibold transition-all active:scale-[0.97] active:opacity-80 cursor-pointer">
		Назад
	</button>
</div>