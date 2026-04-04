<script lang="ts">
	import { fade } from "svelte/transition";
	import { modal } from "$lib/context/js/store/modal.store";
	import Modal from "$lib/components/ui/+modal.svelte";
	import { onDestroy } from "svelte";

	let state: any;
	modal.subscribe((v) => (state = v));

	$: {
		if (typeof document !== "undefined") {
			document.body.style.overflow = state?.component ? "hidden" : "";
		}
	}

	onDestroy(() => {
		if (typeof document !== "undefined") {
			document.body.style.overflow = "";
		}
	});

	function close() {
		modal.close();
	}
</script>

{#if state?.component}
	{#if state.type === "bottom"}
		<!-- Bottom-sheet модалка (для админки и др.) -->
		<div
			transition:fade={{ duration: 200 }}
			on:click={close}
			aria-hidden="true"
			class="fixed inset-0 z-[1050] bg-black/70 backdrop-blur-sm flex items-end justify-center"
		>
			<div on:click|stopPropagation aria-hidden="true">
				<svelte:component
					this={state.component}
					{...state.props}
					on:close={close}
				/>
			</div>
		</div>
	{:else if state.type === "center-large"}
		<!-- Center Large модалка -->
		<div
			transition:fade={{ duration: 200 }}
			on:click={close}
			aria-hidden="true"
			class="fixed inset-0 z-[1050] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
		>
			<div
				on:click|stopPropagation
				aria-hidden="true"
				class="w-full max-w-lg flex flex-col items-center"
			>
				<svelte:component
					this={state.component}
					{...state.props}
					on:close={close}
				/>
			</div>
		</div>
	{:else}
		<!-- Center модалка (стандартная) -->
		<Modal onClose={close}>
			<svelte:component
				this={state.component}
				{...state.props}
				on:close={close}
			/>
		</Modal>
	{/if}
{/if}