<script lang="ts">
	import "bootstrap-icons/font/bootstrap-icons.css";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";

	const tabs = [
		{ id: "events", path: "/admin/events", icon: "bi-calendar3", label: "Ивенты" },
		{ id: "users", path: "/admin/users", icon: "bi-people-fill", label: "Юзеры" },
		{ id: "notifications", path: "/admin/notifications", icon: "bi-megaphone-fill", label: "Нотиф." },
	];

	$: activeTab = tabs.find(t => $page.url.pathname.startsWith(t.path))?.id ?? "events";
</script>

<!-- ════════ HEADER ════════════════════════════════════════════════════════ -->
<header class="md:container md:mx-auto bg-[#1a1a2e] px-5 py-4 border-b border-white/5 sticky top-0 z-40">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-lg font-bold uppercase tracking-wide">Sich Tactical</h1>
			<p class="text-[11px] text-white/40 uppercase tracking-widest">Admin Panel</p>
		</div>
		<div class="w-9 h-9 bg-red-500/15 border border-red-500/25 rounded-full flex items-center justify-center">
			<i class="bi bi-shield-fill-exclamation text-red-400 text-base"></i>
		</div>
	</div>
	<!-- Admin tabs -->
	<div class="flex gap-1 mt-4 bg-white/[0.04] rounded-xl p-1">
		{#each tabs as tab}
			<button
				on:click={() => goto(tab.path)}
				class="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-lg text-[10px] font-semibold transition-all duration-200 cursor-pointer
					{activeTab === tab.id ? 'bg-[#0a0a0f] text-white shadow-md' : 'text-white/40 hover:text-white/60'}">
				<i class="bi {tab.icon} text-sm leading-none"></i>
				{tab.label}
			</button>
		{/each}
	</div>
</header>

<!-- ════════ CONTENT ══════════════════════════════════════════════════════ -->
<main class="md:container md:mx-auto pb-6">
	<slot />
</main>
