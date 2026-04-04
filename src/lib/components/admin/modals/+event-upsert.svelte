<script lang="ts">
	import { modal } from "$lib/context/js/store/modal.store";
	import { adminCreateEvent, adminUpdateEvent, createEmptyEventForm, mapEventToForm } from "$lib/context/js/admin";
	import type { AdminEvent, AdminEventForm, AdminLocale, AdminEventRule, AdminEventProgramItem } from "$lib/context/js/types/admin";

	export let mode: "create" | "edit" = "create";
	export let event: AdminEvent | null = null;
	export let onSuccess: (() => void) | null = null;

	const locales: AdminLocale[] = ["ru", "pl"];
	let activeLocale: AdminLocale = "ru";
	let form: AdminEventForm = event ? mapEventToForm(event, locales) : createEmptyEventForm(locales);
	let loading = false;

	const updateEventData = (lang: AdminLocale, field: keyof AdminEventForm["event_data"][string], value: string) => {
		const next = { ...form.event_data[lang], [field]: value };
		form = { ...form, event_data: { ...form.event_data, [lang]: next } };
	};

	const updateRule = (lang: AdminLocale, index: number, value: string) => {
		const next = form.event_rules[lang].map((r, i) => (i === index ? { ...r, text: value } : r));
		form = { ...form, event_rules: { ...form.event_rules, [lang]: next } };
	};

	const addRule = (lang: AdminLocale) => {
		const next: AdminEventRule[] = [...form.event_rules[lang], { text: "", position: form.event_rules[lang].length + 1 }];
		form = { ...form, event_rules: { ...form.event_rules, [lang]: next } };
	};

	const removeRule = (lang: AdminLocale, index: number) => {
		const next = form.event_rules[lang].filter((_, i) => i !== index).map((r, idx) => ({ ...r, position: idx + 1 }));
		form = { ...form, event_rules: { ...form.event_rules, [lang]: next } };
	};

	const updateProgram = (lang: AdminLocale, updater: (list: AdminEventProgramItem[]) => AdminEventProgramItem[]) => {
		const next = updater(form.event_program[lang]).map((item, idx) => ({ ...item, position: idx + 1 }));
		form = { ...form, event_program: { ...form.event_program, [lang]: next } };
	};

	const addProgramItem = (lang: AdminLocale) => {
		updateProgram(lang, (list) => [...list, { text: "", position: list.length + 1 }]);
	};

	const removeProgramItem = (lang: AdminLocale, index: number) => {
		updateProgram(lang, (list) => list.filter((_, i) => i !== index));
	};

	const updateProgramText = (lang: AdminLocale, index: number, value: string) => {
		updateProgram(lang, (list) => list.map((item, i) => (i === index ? { ...item, text: value } : item)));
	};

	let dragLang: AdminLocale | null = null;
	let dragIndex: number | null = null;

	const moveProgramItem = (lang: AdminLocale, from: number, to: number) => {
		updateProgram(lang, (list) => {
			const copy = [...list];
			const [item] = copy.splice(from, 1);
			copy.splice(to, 0, item);
			return copy;
		});
	};

	const onProgramDragStart = (lang: AdminLocale, index: number, ev: DragEvent) => {
		dragLang = lang;
		dragIndex = index;
		if (ev.dataTransfer) {
			ev.dataTransfer.setData("text/plain", `${lang}-${index}`);
			ev.dataTransfer.setDragImage(new Image(), 0, 0);
			ev.dataTransfer.effectAllowed = "move";
		}
	};

	const onProgramDragOver = (lang: AdminLocale, index: number, event: DragEvent) => {
		event.preventDefault();
		if (dragLang !== lang || dragIndex === null || dragIndex === index) return;
		updateProgram(lang, (list) => {
			const copy = [...list];
			const [item] = copy.splice(dragIndex!, 1);
			copy.splice(index, 0, item);
			return copy;
		});
		dragIndex = index;
	};

	const onProgramDrop = () => {
		dragLang = null;
		dragIndex = null;
	};

	const updateLocation = (field: keyof AdminEventForm["location"], value: string) => {
		form = { ...form, location: { ...form.location, [field]: value } };
	};

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

<div class="w-[calc(100vw-0.75rem)] h-[88dvh] max-h-[88dvh] md:w-full md:h-auto md:max-h-[90vh] md:max-w-xl bg-[#1a1a2e] rounded-2xl flex flex-col overflow-hidden">
	<div class="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-[#1a1a2e] z-10 shrink-0">
		<div>
			<h2 class="text-base font-bold">{mode === "create" ? "Создать ивент" : "Редактировать ивент"}</h2>
			<p class="text-xs text-white/40 mt-0.5">{mode === "create" ? "Заполните данные нового ивента" : event?.name}</p>
		</div>
		<button on:click={() => modal.close()} aria-label="Закрыть" class="cursor-pointer w-8 h-8 bg-white/[0.06] rounded-full flex items-center justify-center active:scale-95 transition-all">
			<i class="bi bi-x-lg text-sm text-white/60"></i>
		</button>
	</div>

	<div class="overflow-y-auto overscroll-contain flex-1 px-5 py-5 flex flex-col gap-5 pb-6">
		<div class="grid grid-cols-1 gap-3">
			<div class="flex flex-col gap-1.5">
				<span class="text-[11px] text-white/40 uppercase tracking-wide">Дата</span>
				<input bind:value={form.event_date} type="date" class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white outline-none transition-all [color-scheme:dark]" />
			</div>
			<div class="grid grid-cols-2 gap-2">
				<div class="flex flex-col gap-1.5">
					<span class="text-[11px] text-white/40 uppercase tracking-wide">Начало</span>
					<input bind:value={form.start_time} type="time" class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white outline-none transition-all [color-scheme:dark]" />
				</div>
				<div class="flex flex-col gap-1.5">
					<span class="text-[11px] text-white/40 uppercase tracking-wide">Конец</span>
					<input bind:value={form.end_time} type="time" class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white outline-none transition-all [color-scheme:dark]" />
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
			<div class="flex flex-col gap-1.5">
				<span class="text-[11px] text-white/40 uppercase tracking-wide">Локация</span>
				<input value={form.location.name} on:input={(e) => updateLocation("name", (e.target as HTMLInputElement).value)} type="text" placeholder="Polygon Wschód"
					class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-all" />
			</div>
			<div class="flex flex-col gap-1.5">
				<span class="text-[11px] text-white/40 uppercase tracking-wide">Адрес</span>
				<input value={form.location.address} on:input={(e) => updateLocation("address", (e.target as HTMLInputElement).value)} type="text" placeholder="ul. Strzelecka 1, Warszawa"
					class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-all" />
			</div>
			<div class="flex flex-col gap-1.5">
				<span class="text-[11px] text-white/40 uppercase tracking-wide">Google Maps URL</span>
				<input value={form.location.maps_url} on:input={(e) => updateLocation("maps_url", (e.target as HTMLInputElement).value)} type="url" placeholder="https://maps.google.com/?q=..."
					class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-all" />
			</div>
		</div>

		<div class="flex flex-col gap-3">
			<div class="flex flex-col gap-1.5">
				<span class="text-[11px] text-white/40 uppercase tracking-wide">Цена</span>
				<div class="relative">
					<input bind:value={form.cost} type="number" step="0.01" min="0" placeholder="100"
						class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 pr-10 text-sm text-white placeholder:text-white/25 outline-none transition-all" />
					<span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-white/30">zł</span>
				</div>
			</div>
			<div class="flex flex-col gap-1.5">
				<span class="text-[11px] text-white/40 uppercase tracking-wide">Макс. участников</span>
				<input bind:value={form.max_members} type="number" min="1" placeholder="20"
					class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-all" />
			</div>
		</div>

		<div class="flex items-center gap-2">
			<span class="text-[11px] text-white/40 uppercase tracking-wide">Язык</span>
			<div class="flex gap-2">
				{#each locales as loc}
					<button type="button" on:click={() => (activeLocale = loc)}
						class={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${activeLocale === loc ? "bg-white/10 border-white/20 text-white" : "bg-white/[0.03] border-white/[0.06] text-white/45"}`}>
						{loc === "ru" ? "Русский" : "Polski"}
					</button>
				{/each}
			</div>
		</div>

		<div class="bg-white/[0.02] rounded-xl border border-white/[0.05] p-4 flex flex-col gap-3">
			<div class="text-[10px] text-white/35 uppercase tracking-widest font-semibold">Контент ({activeLocale.toUpperCase()})</div>
			<div class="flex flex-col gap-1.5">
				<span class="text-[11px] text-white/40 uppercase tracking-wide">Название</span>
				<input value={form.event_data[activeLocale].name} on:input={(e) => updateEventData(activeLocale, "name", (e.target as HTMLInputElement).value)} type="text" placeholder="Assault #13"
					class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-all" />
			</div>
			<div class="flex flex-col gap-1.5">
				<span class="text-[11px] text-white/40 uppercase tracking-wide">Краткое описание</span>
				<textarea value={form.event_data[activeLocale].short_description} on:input={(e) => updateEventData(activeLocale, "short_description", (e.target as HTMLTextAreaElement).value)} rows="2" placeholder="Городская тактическая игра..."
					class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-all resize-none"></textarea>
			</div>
			<div class="flex flex-col gap-1.5">
				<span class="text-[11px] text-white/40 uppercase tracking-wide">Описание</span>
				<textarea value={form.event_data[activeLocale].description} on:input={(e) => updateEventData(activeLocale, "description", (e.target as HTMLTextAreaElement).value)} rows="4" placeholder="Полное описание сценария, требования, подготовка..."
					class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-all"></textarea>
			</div>
		</div>

		<div class="bg-white/[0.02] rounded-xl border border-white/[0.05] p-4 flex flex-col gap-3">
			<div class="flex items-center justify-between">
				<div class="text-[10px] text-white/35 uppercase tracking-widest font-semibold">Правила ({activeLocale.toUpperCase()})</div>
				<button type="button" on:click={() => addRule(activeLocale)} class="cursor-pointer px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-white/[0.08] text-white hover:bg-white/12 transition-all">
					Добавить правило
				</button>
			</div>
			<div class="flex flex-col gap-2">
				{#if form.event_rules[activeLocale]?.length === 0}
					<div class="text-xs text-white/35">Правила пока пустые</div>
				{/if}
				{#each form.event_rules[activeLocale] as rule, idx}
					<div class="group rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 flex items-start gap-2">
						<div class="text-[10px] text-white/35 pt-1 w-6">#{idx + 1}</div>
						<textarea value={rule.text} on:input={(e) => updateRule(activeLocale, idx, (e.target as HTMLTextAreaElement).value)} rows="2"
							class="flex-1 bg-transparent text-sm text-white outline-none resize-none" placeholder="Текст правила"></textarea>
						<button type="button" on:click={() => removeRule(activeLocale, idx)} aria-label="Удалить"
							class="cursor-pointer w-8 h-8 rounded-lg bg-red-500/10 text-red-300 flex items-center justify-center hover:bg-red-500/20 transition-all">
							<i class="bi bi-trash3"></i>
						</button>
					</div>
				{/each}
			</div>
		</div>

		<div class="bg-white/[0.02] rounded-xl border border-white/[0.05] p-4 flex flex-col gap-3">
			<div class="flex items-center justify-between">
				<div class="text-[10px] text-white/35 uppercase tracking-widest font-semibold">Программа ({activeLocale.toUpperCase()})</div>
				<button type="button" on:click={() => addProgramItem(activeLocale)} class="cursor-pointer px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-white/[0.08] text-white hover:bg-white/12 transition-all">
					Добавить пункт
				</button>
			</div>
			<div class="flex flex-col gap-2">
				{#if form.event_program[activeLocale]?.length === 0}
					<div class="text-xs text-white/35">Программа пока пустая</div>
				{/if}
				{#each form.event_program[activeLocale] as item, idx}
					<div class="group rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 flex items-start gap-2"
						draggable="true"
						on:dragstart={(e) => onProgramDragStart(activeLocale, idx, e)}
						on:dragover={(e) => onProgramDragOver(activeLocale, idx, e)}
						on:drop={onProgramDrop}
						on:dragend={onProgramDrop}>
						<div class="w-8 h-8 rounded-lg bg-white/[0.06] text-white/60 flex items-center justify-center cursor-move active:scale-95">
							<i class="bi bi-grip-vertical"></i>
						</div>
						<textarea value={item.text} on:input={(e) => updateProgramText(activeLocale, idx, (e.target as HTMLTextAreaElement).value)} rows="2"
							class="flex-1 bg-transparent text-sm text-white outline-none resize-none" placeholder="Описание пункта программы"></textarea>
						<div class="flex flex-col gap-1">
							<button type="button" on:click={() => moveProgramItem(activeLocale, idx, Math.max(0, idx - 1))} class="w-8 h-8 rounded-lg bg-white/[0.06] text-white/60 flex items-center justify-center hover:bg-white/12 transition-all" aria-label="Вверх">
								<i class="bi bi-chevron-up"></i>
							</button>
							<button type="button" on:click={() => moveProgramItem(activeLocale, idx, Math.min(form.event_program[activeLocale].length - 1, idx + 1))} class="w-8 h-8 rounded-lg bg-white/[0.06] text-white/60 flex items-center justify-center hover:bg-white/12 transition-all" aria-label="Вниз">
								<i class="bi bi-chevron-down"></i>
							</button>
						</div>
						<button type="button" on:click={() => removeProgramItem(activeLocale, idx)} aria-label="Удалить"
							class="cursor-pointer w-8 h-8 rounded-lg bg-red-500/10 text-red-300 flex items-center justify-center hover:bg-red-500/20 transition-all">
							<i class="bi bi-trash3"></i>
						</button>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="sticky bottom-0 px-5 pt-4 pb-[calc(env(safe-area-inset-bottom)+24px)] border-t border-white/[0.06] bg-[#1a1a2e] flex flex-col gap-2.5 shadow-[0_-12px_30px_rgba(0,0,0,0.45)] z-10">
		<button on:click={handleSubmit} disabled={loading}
			class="cursor-pointer w-full py-3.5 bg-blue-600 text-white rounded-xl text-[15px] font-semibold active:scale-[0.97] active:opacity-80 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
			{#if loading}
				<i class="bi bi-arrow-clockwise animate-spin text-sm"></i>
			{/if}
			{mode === "create" ? "Создать ивент" : "Сохранить изменения"}
		</button>
		<button on:click={() => modal.close()}
			class="cursor-pointer w-full py-3 bg-white/[0.06] text-white/70 rounded-xl text-[15px] font-semibold active:scale-[0.97] active:opacity-80 transition-all">
			Отмена
		</button>
	</div>
</div>
