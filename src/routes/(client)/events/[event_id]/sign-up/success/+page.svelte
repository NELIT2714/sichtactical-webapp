<script lang="ts">
	import { goto } from "$app/navigation";
	import { fadeUp } from "$lib/context/js/ui/fadeUp";
	import Header from "$lib/components/+header.svelte";

	import SkeletonSignUpSuccess from "$lib/components/skeletons/+sign-up-success.svelte";

	export let data;

	const lang = "ru";

	let eventInfo: any = null;

	data.eventPromise.then((eventResponse: any) => {
		eventInfo = eventResponse?.event ?? null;
	});
</script>

<Header>
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<span class="text-lg font-semibold">Успешная запись</span>
		</div>
	</div>
</Header>

<section class="md:container md:mx-auto px-4 py-4">
	{#await data.eventPromise}
		<SkeletonSignUpSuccess />
	{:then}
		{@const eventDate = eventInfo?.event_date && new Date(eventInfo.event_date)}

		<div use:fadeUp={{ delayStep: 300 }} class="flex flex-col items-center gap-2">
			<div class="relative w-28 h-28 flex items-center justify-center opacity-0 animate-ring-appear">
				<div class="absolute inset-0 rounded-full bg-green-500/15 border-2 border-green-500/40"></div>
				<div class="absolute inset-3 rounded-full bg-green-500/10"></div>
				<i class="bi bi-check-lg text-5xl text-green-400 opacity-0 animate-check-pop"></i>
			</div>

			<div class="text-center opacity-0 animate-fade-up-1">
				<h1 class="font-display text-3xl font-bold tracking-wider mb-2">Ты в игре!</h1>
				<p class="text-white/50 text-sm">
					Запись успешно подтверждена.<br>
					Напоминание будет отправлено в Telegram
				</p>
			</div>

			{#if eventInfo}
				<div class="opacity-0 animate-fade-up-2 w-full bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
					<div class="flex items-start gap-3">
						<div class="w-11 h-11 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
							<i class="bi bi-controller text-xl text-blue-400"></i>
						</div>
						<div>
							<h3 class="font-display text-lg font-semibold tracking-wide mb-1">{eventInfo.event_data[lang].name}</h3>
							<div class="flex items-center gap-2 text-xs text-white/50">
								<span><i class="bi bi-calendar-event-fill"></i> {eventDate?.toLocaleDateString('ru-RU', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric'
								})}</span>
								<span>•</span>
								<span><i class="bi bi-clock-fill"></i> {eventInfo.start_time.slice(0, 5)} - {eventInfo.end_time.slice(0, 5)}</span>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<div class="opacity-0 animate-fade-up-3 w-full">
				<button on:click={() => goto("/", {invalidateAll: true})}
								class="cursor-pointer w-full py-3.5 bg-blue-600 text-white rounded-xl text-[15px] font-semibold active:scale-[0.97] active:opacity-80 transition-all">
					На главную
				</button>
			</div>
		</div>
	{/await}
</section>