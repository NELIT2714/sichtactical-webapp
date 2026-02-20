<script lang="ts">
	import { modal } from "$lib/context/js/store/modal.store";
	import Modal from "$lib/components/ui/+modal.svelte";

	let state : any;
	const unsubscribe = modal.subscribe((v) => (state = v));

	function close() {
		modal.close();
	}
</script>

{#if state?.component}
	<Modal onClose={close}>
		<svelte:component
			this={state.component}
			{...state.props}
			on:close={close}
		/>
	</Modal>
{/if}