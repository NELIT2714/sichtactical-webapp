<script lang="ts">
	import { fadeUp } from "$lib/context/js/ui/fadeUp";
	import { goto } from "$app/navigation";
	import { type NotificationItem, } from "$lib/context/js/types/notification";

	import {
		CATEGORY_CONFIG,
		formatNotificationTime,
		groupNotificationsByDate,
	} from "$lib/context/js/notifications.js";

	import Header from "$lib/components/+header.svelte";

	export let data;

	function getLocalized(notif: NotificationItem) {
		return notif.notification_data?.ru ?? Object.values(notif.notification_data)[0];
	}
</script>

<Header>
	<h1 class="text-xl font-bold mb-0.5 uppercase">Sich Tactical</h1>
	<p class="text-[13px] text-white/50">Новости и обновления</p>
</Header>

<section class="md:container md:mx-auto px-4 py-4">
	{#await data.appData}
		loading...
	{:then appData}
		{@const notifications = appData?.notificationsResponse?.notifications ?? []}
		{@const groups = groupNotificationsByDate(notifications)}

		<div use:fadeUp={{ delayStep: 100 }}>
			<div class="opacity-0 flex flex-col gap-4">

				<div class="flex flex-col gap-2">
					{#each groups as group}
						<p class="text-[11px] text-white/30 uppercase tracking-widest font-semibold mb-2 mt-2">{group.label}</p>

						{#each group.notifications as notif}
							{@const config = CATEGORY_CONFIG[notif.category] ?? CATEGORY_CONFIG.SYSTEM}
							{@const localized = getLocalized(notif)}

							<a href="/" on:click|preventDefault={() => notif.category === "EVENT" || notif.category === "SIGNUP" ? goto("/events") : null } class="bg-[#1a1a2e] border border-white/5 transition-all rounded-xl p-3.5 flex items-start gap-3 cursor-pointer">
								<div class="w-10 h-10 {config.bgClass} rounded-lg flex items-center justify-center shrink-0">
									<i class="bi {config.icon} text-sm text-white"></i>
								</div>
								<div class="flex-1 min-w-0">
									<div class="flex items-center gap-1.5 mb-0.5">
										<h4 class="font-semibold text-sm">{localized?.title ?? '—'}</h4>
									</div>
									<p class="text-xs text-white/60 line-clamp-2">{localized?.description ?? ''}</p>
									<span class="text-[11px] text-white/35 mt-1.5 inline-block">{formatNotificationTime(notif.created_at)}</span>
								</div>
								<i class="bi bi-chevron-right text-sm text-white/25 mt-1"></i>
							</a>
						{/each}
					{/each}

					{#if notifications.length === 0}
						<p class="text-white/40 text-sm text-center py-8">Уведомлений пока нет</p>
					{/if}
				</div>

			</div>
		</div>
	{/await}
</section>