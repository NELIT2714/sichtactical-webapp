<script lang="ts">
	import { fade } from "svelte/transition";
	import NotificationsScreen from "$lib/components/admin/screens/+notifications.svelte";

	export let data;
</script>

{#await data.adminData}
	<div class="flex justify-center py-20" transition:fade={{ duration: 180 }}>
		<i class="bi bi-arrow-clockwise animate-spin text-2xl text-white/30"></i>
	</div>
{:then adminData}
	<div transition:fade={{ duration: 180 }}>
		<NotificationsScreen
			notifications={adminData.notifications}
			totalUsers={adminData.stats?.totalUsers ?? 0}
		/>
	</div>
{/await}
