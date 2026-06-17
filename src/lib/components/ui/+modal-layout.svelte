<script lang="ts">
	import { createEventDispatcher } from "svelte";

	export let title = "";
	export let subtitle = "";
	export let maxWidthClass = "max-w-lg";
	export let maxHeightClass = "max-h-[90vh]";
	export let roundedClass = "rounded-t-3xl";
	export let bodyClass = "overflow-y-auto flex-1";
	export let rootClass = "";
	export let showCloseButton = true;

	const dispatch = createEventDispatcher<{ close: void }>();

	const handleClose = () => {
		dispatch("close");
	};
</script>

<div class={`w-full ${maxWidthClass} bg-[#1a1a2e] border border-white/[0.08] ${roundedClass} overflow-hidden ${maxHeightClass} flex flex-col ${rootClass}`}>
	{#if $$slots.header || title || subtitle || $$slots.headerActions || showCloseButton}
		<div class="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/[0.06] gap-3">
			<div class="min-w-0 flex-1">
				{#if $$slots.header}
					<slot name="header" />
				{:else}
					{#if title}
						<h2 class="text-base font-bold">{title}</h2>
					{/if}
					{#if subtitle}
						<p class="text-xs text-white/40 mt-0.5">{subtitle}</p>
					{/if}
				{/if}
			</div>
			<div class="flex items-center gap-2 shrink-0">
				<slot name="headerActions" />
				{#if showCloseButton}
					<button on:click={handleClose} aria-label="Закрыть" class="cursor-pointer w-8 h-8 bg-white/[0.06] rounded-full flex items-center justify-center active:scale-95 transition-all">
						<i class="bi bi-x-lg text-sm text-white/60"></i>
					</button>
				{/if}
			</div>
		</div>
	{/if}

	<div class={bodyClass}>
		<slot />
	</div>

	{#if $$slots.footer}
		<slot name="footer" />
	{/if}
</div>

