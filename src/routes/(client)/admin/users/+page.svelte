<script lang="ts">
	import { fade } from "svelte/transition";
	import UsersScreen from "$lib/components/admin/screens/+users.svelte";

	export let data;
</script>

{#await data.adminData}
	<div class="flex justify-center py-20" transition:fade={{ duration: 180 }}>
		<i class="bi bi-arrow-clockwise animate-spin text-2xl text-white/30"></i>
	</div>
{:then adminData}
	<div transition:fade={{ duration: 180 }}>
		<UsersScreen users={adminData.users} />
	</div>
{/await}
