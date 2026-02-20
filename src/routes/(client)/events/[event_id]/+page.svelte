<script lang="ts">
	import { goto, invalidateAll } from "$app/navigation";
	import { fadeUp } from "$lib/context/js/ui/fadeUp";

	import Header from "$lib/components/+header.svelte";
	import { getDuration } from "$lib/context/js/time";
	import { modal } from "$lib/context/js/store/modal.store";
	import CancelRegistrationModal from "$lib/components/dropdowns/+cancel-registration.svelte";
	import { API } from "$lib/context/js/axios";

	const lang = "ru";
	export let data;

	$: eventInfo = data?.event;

	$: eventDate = eventInfo ? new Date(eventInfo.event_date) : null;
	$: percentSlots = eventInfo ? Math.round((eventInfo.members / eventInfo.max_members) * 100) : 0;
	$: slotStatus = percentSlots >= 100 ? "full" : percentSlots >= 70 ? "few" : "available";

	let targetMore: HTMLElement;

	const cancelRegistrationModal = () => {
		modal.open(CancelRegistrationModal, {
			eventName: eventInfo.event_data[lang].name,
			eventDate: eventDate,
			eventLocation: eventInfo.location.name,
			eventStartTime: eventInfo.start_time.slice(0, 5),
			onConfirm: async () => {
				try {
					await API.delete(`/v1/events/${eventInfo.id_event}/members`);
					await invalidateAll();
				} catch (error) {
					console.error(error);
				} finally {
					modal.close();
				}
			}
		});
	}
</script>

<Header>
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<button on:click={() => history.back()}
							class="cursor-pointer w-9 h-9 bg-white/10 rounded-full flex items-center justify-center active:scale-95 transition-all"
							aria-label="Вернуться назад">
				<i class="bi bi-chevron-left text-lg"></i>
			</button>
			<span class="text-lg font-semibold">Подробности</span>
		</div>

<!--		<button-->
<!--			class="cursor-pointer w-9 h-9 bg-white/10 rounded-full flex items-center justify-center active:scale-95 transition-all"-->
<!--			aria-label="Поделиться">-->
<!--			<i class="bi bi-share text-lg"></i>-->
<!--		</button>-->
	</div>
</Header>

<section use:fadeUp={{ delayStep: 100 }}  class="">

	<div class="opacity-0 md:container md:mx-auto px-4 py-4 space-y-3">
		<div class="bg-[#1a1a2e] rounded-2xl p-5 border border-white/10 shadow-xl">
			<h2 class="text-2xl font-bold mb-2">{eventInfo.event_data[lang].name}</h2>
			<p class="text-white/60 text-sm">{eventInfo.event_data[lang].short_description}</p>
		</div>

		<button on:click={() => targetMore.scrollIntoView({ behavior: "smooth" })}
						class="text-center cursor-pointer w-full py-3 bg-white/[0.1] text-white rounded-xl text-[15px] font-semibold active:scale-[0.97] active:opacity-80 transition-all">
			Подробнее
		</button>

		<div class="grid grid-cols-2 gap-3">
			<div class="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
				<div class="flex items-center gap-2 mb-2">
					<div class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
						<i class="bi bi-calendar-event text-blue-400"></i>
					</div>
					<span class="text-xs text-white/50 uppercase tracking-wide">Дата</span>
				</div>
				<div class="text-base font-semibold">{eventDate.toLocaleDateString('ru-RU', {day: '2-digit', month: 'long', year: 'numeric' })}</div>
				<div class="text-xs text-white/50 mt-0.5 capitalize">{eventDate.toLocaleDateString('ru-RU', { weekday: 'long' })}</div>
			</div>

			<div class="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
				<div class="flex items-center gap-2 mb-2">
					<div class="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
						<i class="bi bi-clock text-purple-400"></i>
					</div>
					<span class="text-xs text-white/50 uppercase tracking-wide">Время</span>
				</div>
				<div class="text-base font-semibold">{eventInfo.start_time.slice(0, 5)} - {eventInfo.end_time.slice(0, 5)}</div>
				<div class="text-xs text-white/50 mt-0.5">{getDuration(eventInfo.start_time.slice(0, 5), eventInfo.end_time.slice(0, 5))}</div>
			</div>

			<div class="bg-[#1a1a2e] rounded-xl p-4 border border-white/5 col-span-2">
				<div class="flex items-center gap-2 mb-2">
					<div class="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
						<i class="bi bi-geo-alt-fill text-green-400"></i>
					</div>
					<span class="text-xs text-white/50 uppercase tracking-wide">Локация</span>
				</div>

				<div class="text-base font-semibold mb-2">{eventInfo.location.name}</div>
				<div class="text-xs text-white/60 mb-3">{eventInfo.location.address}</div>

				<a href={eventInfo.location.google_maps} target="_blank"
					 class="w-full py-2.5 bg-green-500/10 border border-green-500/30 rounded-lg text-sm font-medium text-green-400 active:scale-95 transition-all flex items-center justify-center gap-2">
					<i class="bi bi-map"></i>
					<span>Показать на карте</span>
				</a>
			</div>

			<div class="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
				<div class="flex items-center gap-2 mb-2">
					<div class="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-base">
						<i class="bi bi-currency-dollar"></i>
					</div>

					<span class="text-xs text-white/50 uppercase tracking-wide">Цена</span>
				</div>
				<div class="text-xl font-bold">{eventInfo.cost} zł</div>
				<div class="text-xs text-white/50">за участника</div>
			</div>

			<div class="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
				<div class="flex items-center gap-2 mb-2">
					<div class="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-base">
						<i class="bi bi-people-fill"></i>
					</div>
					<span class="text-xs text-white/50 uppercase tracking-wide">Участники</span>
				</div>
				<div class="text-xl font-bold">{eventInfo.members} / {eventInfo.max_members}</div>
				<div class="text-xs text-white/50">{slotStatus === "full" ? "Нет" : eventInfo.max_members - (eventInfo.members)}
					доступных мест
				</div>
			</div>
		</div>

		<div bind:this={targetMore} class="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
			<div class="flex justify-between items-center mb-2">
				<span class="text-sm font-medium">Набор игроков</span>
				<span class="text-sm font-semibold slot-text {slotStatus}">{percentSlots}%</span>
			</div>
			<div class="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
				<div class="h-full rounded-full transition-all slot-bg {slotStatus}" style="width: {percentSlots}%;"></div>
			</div>
		</div>

		{#if !eventInfo.registered}

			{#if ["available", "few"].includes(slotStatus)}
				<button on:click={() => goto(`/events/${eventInfo.id_event}/sign-up`)}
								class="cursor-pointer w-full py-4 bg-blue-600 text-white rounded-xl text-[17px] font-semibold active:scale-[0.97] active:opacity-80 transition-all">
					Записаться на игру
				</button>
			{/if}

		{:else}

			<button on:click={cancelRegistrationModal} class="cursor-pointer w-full py-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[15px] font-semibold active:scale-[0.97] active:opacity-80 transition-all">
				Отменить запись
			</button>

		{/if}


		<div class="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
			<h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
				Описание
			</h3>
			<div class="text-sm text-white/70 leading-relaxed space-y-3">
				<p>
					{@html eventInfo.event_data[lang].description}
				</p>
				<div class="bg-white/5 rounded-lg p-3 mt-3">
					<div class="text-xs text-white/50 uppercase tracking-wide mb-2">Что тебя ждёт:</div>

					<ul class="text-sm text-white/70 space-y-1.5">
						{#each eventInfo.event_program[lang] as p (p.position)}
							<li class="flex items-start gap-2">
								<span class="text-green-400 mt-0.5">✓</span>
								<span>{p.text}</span>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>

		<div class="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
			<h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
				Правила
			</h3>
			<div class="space-y-2 text-sm text-white/70">
				{#each eventInfo.event_rules[lang] as r (r.position)}
					<li class="flex items-start gap-2">
						<span class="text-green-400 mt-0.5"><i class="bi bi-check-circle-fill"></i></span>
						<span>{r.text}</span>
					</li>
				{/each}
			</div>
		</div>

		<div class="bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-xl p-4 border border-blue-500/20">
			<div class="flex items-center gap-3 mb-3">
				<div class="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
					<i class="bi bi-telegram text-2xl text-blue-400"></i>
				</div>
				<div class="flex-1">
					<h3 class="text-sm font-semibold">Есть вопросы?</h3>
					<p class="text-xs text-white/60">Свяжитесь с организаторами</p>
				</div>
			</div>
			<a href="https://t.me/sich_tactical"
				 class="block w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-sm text-center active:scale-[0.98] transition-all">
				<i class="bi bi-telegram mr-2"></i>
				Написать
			</a>
		</div>
	</div>
</section>


<!--	<div class="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">-->
<!--		<div class="flex items-center justify-between mb-3">-->
<!--			<h3 class="text-lg font-semibold flex items-center gap-2">-->
<!--				<i class="bi bi-people text-blue-400"></i>-->
<!--				Zapisani gracze-->
<!--			</h3>-->
<!--			<span class="text-sm text-white/50">24 / 60</span>-->
<!--		</div>-->

<!--		<div class="space-y-2 max-h-64 overflow-y-auto">-->
<!--			<div class="flex items-center gap-3 p-2 bg-white/5 rounded-lg">-->
<!--				<div class="w-9 h-9 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">-->
<!--					A-->
<!--				</div>-->
<!--				<div class="flex-1">-->
<!--					<div class="text-sm font-medium">Andriej Sokołow</div>-->
<!--					<div class="text-xs text-white/50">Poziom 10</div>-->
<!--				</div>-->
<!--				<div class="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">-->
<!--					Organizator-->
<!--				</div>-->
<!--			</div>-->

<!--			<div class="flex items-center gap-3 p-2 bg-white/5 rounded-lg">-->
<!--				<div class="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">-->
<!--					А-->
<!--				</div>-->
<!--				<div class="flex-1">-->
<!--					<div class="text-sm font-medium">Aleksandr</div>-->
<!--					<div class="text-xs text-white/50">Poziom 7 • Ty</div>-->
<!--				</div>-->
<!--			</div>-->

<!--			<div class="flex items-center gap-3 p-2 bg-white/5 rounded-lg">-->
<!--				<div class="w-9 h-9 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">-->
<!--					М-->
<!--				</div>-->
<!--				<div class="flex-1">-->
<!--					<div class="text-sm font-medium">Maksym Petrow</div>-->
<!--					<div class="text-xs text-white/50">Poziom 10</div>-->
<!--				</div>-->
<!--			</div>-->

<!--			<div class="flex items-center gap-3 p-2 bg-white/5 rounded-lg">-->
<!--				<div class="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">-->
<!--					Д-->
<!--				</div>-->
<!--				<div class="flex-1">-->
<!--					<div class="text-sm font-medium">Dmitrij Kowalew</div>-->
<!--					<div class="text-xs text-white/50">Poziom 9</div>-->
<!--				</div>-->
<!--			</div>-->

<!--			<div class="flex items-center gap-3 p-2 bg-white/5 rounded-lg">-->
<!--				<div class="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">-->
<!--					І-->
<!--				</div>-->
<!--				<div class="flex-1">-->
<!--					<div class="text-sm font-medium">Igor Nowak</div>-->
<!--					<div class="text-xs text-white/50">Poziom 8</div>-->
<!--				</div>-->
<!--			</div>-->

<!--			<button class="w-full py-2.5 text-sm text-blue-400 font-medium bg-white/5 rounded-lg hover:bg-white/10 transition-all">-->
<!--				Pokaż wszystkich (24)-->
<!--			</button>-->
<!--		</div>-->
<!--	</div>-->
