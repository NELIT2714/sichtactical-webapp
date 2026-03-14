<script lang="ts">
	import { modal } from "$lib/context/js/store/modal.store";
	import { adminCreateNotification, MOCK_STATS } from "$lib/context/js/admin";
	import { CATEGORY_CONFIG } from "$lib/context/js/notifications";
	import type { AdminNotifForm } from "$lib/context/js/admin";
	import type { AdminNotifCategory } from "$lib/context/js/types/admin";

	export let totalUsers: number = MOCK_STATS.totalUsers;
	export let onSuccess: (() => void) | null = null;

	let form: AdminNotifForm = {
		category: "ANNOUNCEMENT",
		title_ru: "",
		description_ru: "",
		title_pl: "",
		description_pl: "",
	};

	let loading = false;

	const categoryEntries = Object.entries(CATEGORY_CONFIG).map(([cat, cfg]) => ({
		cat: cat as AdminNotifCategory,
		lbl: cfg.label,
		icon: cfg.icon,
		bgClass: cfg.bgClass,
	}));

	const handleSubmit = async () => {
		loading = true;
		try {
			const ok = await adminCreateNotification(form);
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
			<h2 class="text-base font-bold">Новое уведомление</h2>
			<p class="text-xs text-white/40 mt-0.5">Будет отправлено всем пользователям</p>
		</div>
		<button on:click={() => modal.close()} aria-label="Закрыть" class="cursor-pointer w-8 h-8 bg-white/[0.06] rounded-full flex items-center justify-center active:scale-95 transition-all">
			<i class="bi bi-x-lg text-sm text-white/60"></i>
		</button>
	</div>

	<div class="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">
		<div class="flex flex-col gap-1.5">
			<p class="text-[11px] text-white/40 uppercase tracking-wide">Категория</p>
			<div class="grid grid-cols-2 gap-1.5">
				{#each categoryEntries as entry}
					<button on:click={() => (form.category = entry.cat)}
						class="cursor-pointer flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all
							{form.category === entry.cat ? 'bg-white/10 border-white/20 text-white' : 'bg-white/[0.03] border-white/[0.06] text-white/45'}">
						<div class="w-6 h-6 {entry.bgClass} rounded-md flex items-center justify-center shrink-0">
							<i class="bi {entry.icon} text-[10px] text-white"></i>
						</div>
						<span class="text-xs font-medium">{entry.lbl}</span>
					</button>
				{/each}
			</div>
		</div>

		<div class="bg-white/[0.02] rounded-xl border border-white/[0.05] p-3.5 flex flex-col gap-3">
			<div class="text-[10px] text-white/30 uppercase tracking-widest font-semibold flex items-center gap-1.5">
				<span class="text-base">🇷🇺</span> Русский
			</div>
			<div class="flex flex-col gap-1.5">
				<span class="text-[11px] text-white/40 uppercase tracking-wide">Заголовок</span>
				<input bind:value={form.title_ru} type="text" placeholder="Новое событие!"
					class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-all"/>
			</div>
			<div class="flex flex-col gap-1.5">
				<span class="text-[11px] text-white/40 uppercase tracking-wide">Описание</span>
				<textarea bind:value={form.description_ru} rows="2" placeholder="Открыта запись на игру..."
					class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-all resize-none"></textarea>
			</div>
		</div>

		<div class="bg-white/[0.02] rounded-xl border border-white/[0.05] p-3.5 flex flex-col gap-3">
			<div class="text-[10px] text-white/30 uppercase tracking-widest font-semibold flex items-center gap-1.5">
				<span class="text-base">🇵🇱</span> Polski
			</div>
			<div class="flex flex-col gap-1.5">
				<span class="text-[11px] text-white/40 uppercase tracking-wide">Tytuł</span>
				<input bind:value={form.title_pl} type="text" placeholder="Nowe wydarzenie!"
					class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-all"/>
			</div>
			<div class="flex flex-col gap-1.5">
				<span class="text-[11px] text-white/40 uppercase tracking-wide">Opis</span>
				<textarea bind:value={form.description_pl} rows="2" placeholder="Rejestracja na grę jest otwarta..."
					class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-all resize-none"></textarea>
			</div>
		</div>

		<div class="flex items-start gap-2.5 p-3 bg-blue-500/5 border border-blue-500/15 rounded-xl">
			<i class="bi bi-info-circle-fill text-blue-400 text-sm mt-0.5 shrink-0"></i>
			<p class="text-xs text-white/50 leading-relaxed">
				Уведомление будет отправлено всем
				<span class="text-white/70 font-semibold">{totalUsers} пользователям</span> приложения.
			</p>
		</div>
	</div>

	<div class="px-5 py-4 border-t border-white/[0.06] flex flex-col gap-2">
		<button on:click={handleSubmit} disabled={loading}
			class="cursor-pointer w-full py-3.5 bg-blue-600 text-white rounded-xl text-[15px] font-semibold active:scale-[0.97] active:opacity-80 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
			{#if loading}
				<i class="bi bi-arrow-clockwise animate-spin text-sm"></i>
			{:else}
				<i class="bi bi-send-fill text-sm"></i>
			{/if}
			Отправить уведомление
		</button>
		<button on:click={() => modal.close()}
			class="cursor-pointer w-full py-3 bg-white/[0.06] text-white/60 rounded-xl text-[15px] font-semibold active:scale-[0.97] active:opacity-80 transition-all">
			Отмена
		</button>
	</div>
</div>
