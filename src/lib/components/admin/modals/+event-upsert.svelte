<script lang="ts">
	import { modal } from "$lib/context/js/store/modal.store";
	import type { AdminEvent, AdminEventForm } from "$lib/context/js/admin";
	import { adminCreateEvent, adminUpdateEvent } from "$lib/context/js/admin";

	export let mode: "create" | "edit" = "create";
	export let event: AdminEvent | null = null;
	export let onSuccess: (() => void) | null = null;

	let form: AdminEventForm = event
		? {
				name: event.name,
				date: event.event_date,
				start_time: event.start_time,
				end_time: event.end_time,
				location: event.location,
				address: event.address,
				cost: event.cost.replace(" zł", ""),
				max_members: String(event.max_members),
				short_description: event.short_description,
		  }
		: { name: "", date: "", start_time: "", end_time: "", location: "", address: "", cost: "", max_members: "", short_description: "" };

	let loading = false;

	const handleSubmit = async () => {
		loading = true;
		try {
			const ok = mode === "create"
				? await adminCreateEvent(form)
				: await adminUpdateEvent(event!.id_event, form);
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

<div class="w-full max-w-lg bg-[#1a1a2e] border border-white/[0.08] rounded-t-3xl overflow-hidden max-h-[90vh] flex flex-col">
	<div class="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/[0.06]">
		<div>
			<h2 class="text-base font-bold">{mode === "create" ? "Создать ивент" : "Редактировать ивент"}</h2>
			<p class="text-xs text-white/40 mt-0.5">{mode === "create" ? "Заполните данные нового ивента" : event?.name}</p>
		</div>
		<button on:click={() => modal.close()} aria-label="Закрыть" class="cursor-pointer w-8 h-8 bg-white/[0.06] rounded-full flex items-center justify-center active:scale-95 transition-all">
			<i class="bi bi-x-lg text-sm text-white/60"></i>
		</button>
	</div>

	<div class="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">
		<div class="flex flex-col gap-1.5">
			<span class="text-[11px] text-white/40 uppercase tracking-wide">Название</span>
			<input bind:value={form.name} type="text" placeholder="Assault #13"
				class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-all"/>
		</div>
		<div class="grid grid-cols-2 gap-3">
			<div class="flex flex-col gap-1.5">
				<span class="text-[11px] text-white/40 uppercase tracking-wide">Дата</span>
				<input bind:value={form.date} type="date" class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white outline-none transition-all [color-scheme:dark]"/>
			</div>
			<div class="flex flex-col gap-1.5">
				<span class="text-[11px] text-white/40 uppercase tracking-wide">Цена</span>
				<div class="relative">
					<input bind:value={form.cost} type="number" placeholder="100"
						class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 pr-10 text-sm text-white placeholder:text-white/25 outline-none transition-all"/>
					<span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-white/30">zł</span>
				</div>
			</div>
		</div>
		<div class="grid grid-cols-2 gap-3">
			<div class="flex flex-col gap-1.5">
				<span class="text-[11px] text-white/40 uppercase tracking-wide">Начало</span>
				<input bind:value={form.start_time} type="time" class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white outline-none transition-all [color-scheme:dark]"/>
			</div>
			<div class="flex flex-col gap-1.5">
				<span class="text-[11px] text-white/40 uppercase tracking-wide">Конец</span>
				<input bind:value={form.end_time} type="time" class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white outline-none transition-all [color-scheme:dark]"/>
			</div>
		</div>
		<div class="flex flex-col gap-1.5">
			<span class="text-[11px] text-white/40 uppercase tracking-wide">Локация</span>
			<input bind:value={form.location} type="text" placeholder="Polygon Wschód"
				class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-all"/>
		</div>
		<div class="flex flex-col gap-1.5">
			<span class="text-[11px] text-white/40 uppercase tracking-wide">Адрес</span>
			<input bind:value={form.address} type="text" placeholder="ul. Strzelecka 1, Warszawa"
				class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-all"/>
		</div>
		<div class="flex flex-col gap-1.5">
			<span class="text-[11px] text-white/40 uppercase tracking-wide">Макс. участников</span>
			<input bind:value={form.max_members} type="number" placeholder="20"
				class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-all"/>
		</div>
		<div class="flex flex-col gap-1.5">
			<span class="text-[11px] text-white/40 uppercase tracking-wide">Краткое описание (RU)</span>
			<textarea bind:value={form.short_description} rows="3" placeholder="Городская тактическая игра..."
				class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-all resize-none"></textarea>
		</div>
	</div>

	<div class="px-5 py-4 border-t border-white/[0.06] flex flex-col gap-2">
		<button on:click={handleSubmit} disabled={loading}
			class="cursor-pointer w-full py-3.5 bg-blue-600 text-white rounded-xl text-[15px] font-semibold active:scale-[0.97] active:opacity-80 transition-all disabled:opacity-60">
			{#if loading}
				<i class="bi bi-arrow-clockwise animate-spin mr-2"></i>
			{/if}
			{mode === "create" ? "Создать ивент" : "Сохранить изменения"}
		</button>
		<button on:click={() => modal.close()}
			class="cursor-pointer w-full py-3 bg-white/[0.06] text-white/60 rounded-xl text-[15px] font-semibold active:scale-[0.97] active:opacity-80 transition-all">
			Отмена
		</button>
	</div>
</div>
