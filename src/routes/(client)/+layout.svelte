<script lang="ts">
	import { onMount } from "svelte";

	import ModalProvider from "$lib/components/+modal-provider.svelte";
	import Footer from "$lib/components/+footer.svelte";

	import "$lib/context/css/app.css";

	let tg: any = window.Telegram.WebApp;

	onMount(async () => {
		if (window.Telegram && window.Telegram.WebApp) {
			tg.ready();
			tg.expand();
			tg.setHeaderColor("#1a1a2e");
			tg.setBackgroundColor("#0a0a0f");
		}
	})
</script>

<ModalProvider />

<slot />
<Footer />