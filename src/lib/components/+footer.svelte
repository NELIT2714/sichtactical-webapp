<script lang="ts">
	import { page } from "$app/state";
	import { goto } from "$app/navigation";

	import "bootstrap-icons/font/bootstrap-icons.css";

	const links = [
		{
			id: "start",
			title: "Начало",
			icon: "bi bi-hexagon-fill",
			href: "/"
		},
		{
			id: "events",
			title: "События",
			icon: "bi bi-calendar3",
			text: "Предстоящие события",
			href: "/events"
		},
		{
			id: "notifications",
			title: "Лента",
			icon: "bi bi-activity",
			text: "Активность",
			href: "/notifications"
		},
		{
			id: "more",
			title: "Ещё",
			icon: "bi bi-three-dots",
			text: "Дополнительно",
			href: "/more"
		},
	];
</script>

<footer>
	<div class="fixed flex justify-around bottom-0 left-0 right-0 bg-[#1a1a2e] border-t border-white/5 px-2 py-2 pb-4 z-1000 items-center">
		{#each links as l}
			<button on:click={() => {
				if (page.url.pathname !== l.href) {
					goto(l.href, { invalidateAll: true });
				}
			}} class:active={page.url.pathname === l.href || page.url.pathname.startsWith(l.href + '/')} class="flex flex-col w-fit items-center gap-1 text-white/50 active:scale-95 transition-all duration-300 cursor-pointer">
				<i class="{l.icon} text-[1.5rem] leading-none"></i>
				<div class="text-[11px] font-medium">{l.title}</div>
			</button>
		{/each}
	</div>
</footer>

<style lang="postcss">
  @reference "tailwindcss";

	.active {
		@apply text-white;
	}
</style>
