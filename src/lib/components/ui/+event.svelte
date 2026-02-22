<script lang="ts">
	import type { EventItem } from "$lib/context/js/types/event";
	import { goto, invalidateAll } from "$app/navigation";
	import { modal } from "$lib/context/js/store/modal.store";
	import { API } from "$lib/context/js/axios";
	import { hasEventStarted } from "$lib/context/js/events";

	import CancelRegistrationModal from "$lib/components/dropdowns/+cancel-registration.svelte";

	export let eventInfo: EventItem;

	const lang = "ru";

	const eventDate = new Date(eventInfo.event_date);

	$: percentSlots = Math.round((eventInfo.members / eventInfo.max_members) * 100);
	$: slotStatus = percentSlots >= 100 ? "full" : percentSlots >= 70 ? "few" : "available";

	const cancelRegistrationModal = () => {
		modal.open(CancelRegistrationModal, {
			eventName: eventInfo.event_data[lang].name,
			eventDate: eventDate,
			eventLocation: eventInfo.location.name,
			eventStartTime: eventInfo.start_time.slice(0, 5),
			onConfirm: async () => {
				await API.delete(`/v1/events/${eventInfo.id_event}/members`);
				await invalidateAll();
				modal.close();
			},
		});
	};
</script>

<div
	class="flex flex-col gap-3 rounded-2xl p-4 border border-white/[0.08] active:scale-[0.98] transition-all {eventInfo.registered ? 'bg-green-500/10' : 'bg-[#1a1a2e]'}">
	<div class="flex flex-col gap-2">
		<div class="flex justify-between items-start gap-2">
			<div class="flex flex-col gap-2.5 min-w-0">
				<div class="text-[17px] font-semibold">{eventInfo.event_data[lang].name}</div>

				<div class="flex flex-col gap-0.5">
					<div class="flex items-center gap-1.5 text-[13px] text-white/50">
						<span><i class="bi bi-calendar-event-fill"></i></span>
						<span>{eventDate.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
					</div>

					<div class="flex items-center gap-1.5 text-[13px] text-white/50">
						<span><i class="bi bi-clock-fill"></i></span>
						<span>{eventInfo.start_time.slice(0, 5)} - {eventInfo.end_time.slice(0, 5)}</span>
					</div>
				</div>
			</div>

			<div class="slot-badge shrink-0 {slotStatus}">
				{slotStatus === "full" ? "Мест нет" : slotStatus === "few" ? "Мест мало" : "Места есть"}
			</div>
		</div>

		<div class="text-sm text-white/70 leading-relaxed line-clamp-4">
			{eventInfo.event_data[lang].short_description}
		</div>

		<div class="flex flex-col gap-1.5">
			<div class="bg-white/[0.03] p-2.5 rounded-xl flex items-center gap-2.5 border border-white/5">
				<div class="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-base">
					<i class="bi bi-geo-alt-fill"></i>
				</div>
				<div class="flex-1">
					<div class="text-[11px] text-white/40 uppercase tracking-wide">Локация</div>
					<div class="flex flex-col">
						<span class="text-md font-semibold text-white/90">{eventInfo.location.name}</span>
						<span class="text-xs text-white/60">{eventInfo.location.address}</span>
					</div>
				</div>
			</div>

			<div class="bg-white/[0.03] p-2.5 rounded-xl flex items-center gap-2.5 border border-white/5">
				<div class="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-base">
					<i class="bi bi-credit-card-fill"></i>
				</div>
				<div class="flex-1">
					<div class="text-[11px] text-white/40 uppercase tracking-wide">Стоимость</div>
					<div class="text-md font-semibold text-white/90">{eventInfo.cost} zł</div>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-1.5">
			<div class="flex justify-between items-center">
				<span class="text-[13px] text-white/50">Участники</span>
				<span class="text-[13px] font-semibold slot-text {slotStatus}">
					{eventInfo.members} / {eventInfo.max_members}
				</span>
			</div>
			<div class="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
				<div class="h-full rounded-full transition-all slot-bg {slotStatus}" style="width: {percentSlots}%;"></div>
			</div>
		</div>
	</div>

	<div class="flex flex-col gap-2">
		{#if !eventInfo.registered}

			{#if ["available", "few"].includes(slotStatus) && !hasEventStarted(eventInfo.event_date, eventInfo.start_time)}
				<button on:click={() => goto(`/events/${eventInfo.id_event}/sign-up`)}
								class="cursor-pointer w-full py-3.5 bg-blue-600 text-white rounded-xl text-[15px] font-semibold active:scale-[0.97] active:opacity-80 transition-all">
					Быстрая запись
				</button>
			{/if}

			<button on:click={() => goto(`/events/${eventInfo.id_event}`)}
							class="text-center cursor-pointer w-full py-3 bg-white/[0.08] text-white rounded-xl text-[15px] font-semibold active:scale-[0.97] active:opacity-80 transition-all">
				Подробнее
			</button>

		{:else}

			<button on:click={() => goto(`/events/${eventInfo.id_event}`)}
							class="text-center cursor-pointer w-full py-3 bg-white/[0.08] text-white rounded-xl text-[15px] font-semibold active:scale-[0.97] active:opacity-80 transition-all">
				Подробнее
			</button>

			<button on:click={cancelRegistrationModal}
							class="cursor-pointer w-full py-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[15px] font-semibold active:scale-[0.97] active:opacity-80 transition-all">
				Отменить запись
			</button>

		{/if}
	</div>
</div>
