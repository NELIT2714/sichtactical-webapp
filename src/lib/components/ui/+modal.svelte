<script lang="ts">
	import { fade } from "svelte/transition";

	export let onClose: () => void = () => {};
</script>

<div transition:fade={{ duration: 200 }} on:click={onClose} aria-hidden="true" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
	<div on:click|stopPropagation aria-hidden="true" class="w-full max-w-sm bg-[#1a1a2e] border border-white/[0.08] rounded-2xl overflow-hidden">
		<slot />
	</div>
</div>