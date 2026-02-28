<script lang="ts">
	import { goto } from "$app/navigation";
	import {
		CATEGORY_CONFIG,
		formatNotificationTime,
		type NotificationItem
	} from "$lib/context/js/notifications";

	export let announcements: NotificationItem[] = [];

	function getLocalized(notif: NotificationItem) {
		return notif.notification_data?.ru ?? Object.values(notif.notification_data)[0];
	}
</script>

<section class="px-4">
	<h3 class="text-lg font-bold mb-3">Новости</h3>

	{#if announcements.length > 0}
		<div class="space-y-2">
			{#each announcements as notif (notif.id_notification)}
				{@const config = CATEGORY_CONFIG[notif.category] ?? CATEGORY_CONFIG.SYSTEM}
				{@const localized = getLocalized(notif)}

				<button
					type="button"
					on:click={() => goto(`/notifications/${notif.id_notification}`)}
					class="w-full text-left bg-[#1a1a2e] rounded-xl p-3.5 border border-white/5 hover:border-white/10 hover:bg-white/2 transition-all cursor-pointer flex items-start gap-3"
				>
					<div class="w-10 h-10 {config.bgClass} rounded-lg flex items-center justify-center shrink-0 text-white">
						<i class="bi {config.icon} text-sm"></i>
					</div>

					<div class="flex-1 min-w-0">
						<h4 class="font-semibold text-sm mb-0.5">{localized?.title ?? '—'}</h4>
						<p class="text-xs text-white/60 line-clamp-1">{localized?.description ?? ''}</p>
						<span class="text-[11px] text-white/40 mt-1 inline-block">{formatNotificationTime(notif.created_at)}</span>
					</div>

					<div class="text-white/30 shrink-0 mt-1">
						<i class="bi bi-chevron-right text-sm"></i>
					</div>
				</button>
			{/each}
		</div>
	{:else}
		<p class="text-white/40 text-sm text-center py-6">Нет объявлений</p>
	{/if}

	<button
		class="w-full mt-2 py-2.5 text-sm text-blue-400 font-medium bg-white/5 rounded-lg hover:bg-white/8 transition-all"
		on:click={() => goto('/notifications')}
	>
		Все новости →
	</button>
</section>
