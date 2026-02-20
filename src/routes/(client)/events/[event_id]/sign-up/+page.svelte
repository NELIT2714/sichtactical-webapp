<script lang="ts">
	import { API } from "$lib/context/js/axios";
	import { goto } from "$app/navigation";
	import { fadeUp } from "$lib/context/js/ui/fadeUp";
	import { validateFullName, validatePhone, validateRules } from "$lib/context/js/validation";

	import LoadButton from "$lib/components/ui/+load-button.svelte";
	import PhoneInput from "$lib/components/ui/+phone-input.svelte";
	import Header from "$lib/components/+header.svelte";

	export let data;

	const lang = "ru";

	$: user = data?.user ?? null;
	$: eventInfo = data?.event ?? null;

	$: if (eventInfo?.registered) {
		goto("/", { invalidateAll: true });
	}

	$: eventDate = eventInfo ? new Date(eventInfo.event_date) : null;

	let signUpData = {
		full_name: "",
		phone_number: "",
		call_sign: null as string | null,
		equipment_type: "OWN",
		save_data: true,
		accept_rules: false,
	};

	const getFullName = () => {
		const firstName = user?.telegram_data?.first_name ?? "";
		const lastName = user?.telegram_data?.last_name ?? "";
		return firstName ? `${firstName} ${lastName}`.trim() : "";
	};

	$: if (user) {
		signUpData.full_name = getFullName();
		signUpData.phone_number = user.telegram_data?.phone_number ?? "";
		signUpData.call_sign = user.call_sign ?? "";
	}

	$: price = eventInfo
		? (signUpData.equipment_type === "RENT" ? 200 : eventInfo.cost)
		: 0;

	let errors = {
		full_name: "",
		phone_number: "",
		accept_rules: "",
	};

	$: errors.full_name = validateFullName(signUpData.full_name);
	$: errors.phone_number = validatePhone(signUpData.phone_number);
	$: errors.accept_rules = validateRules(signUpData.accept_rules);

	$: isFormValid =
		!errors.full_name &&
		!errors.phone_number &&
		!errors.accept_rules;

	let contactRequestStatus: string | null = null;

	const requestContact = () => {
		const tg: any = window?.Telegram?.WebApp;
		const isTelegram: boolean = !!tg?.initData;
		if (!isTelegram) return;

		tg.requestContact((status: string) => {
			contactRequestStatus = status;
		});
	};

	let loading = false;

	const submit = async () => {
		if (!isFormValid || !eventInfo) return;

		try {
			loading = true
			await API.post(`/v1/events/${eventInfo.id_event}/members`, signUpData);
			await goto(`/events/${eventInfo.id_event}/sign-up/success`);
		} catch (err) {
			await goto("/", { invalidateAll: true });
		} finally {
			loading = false;
		}
	};
</script>

<Header>
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<button on:click={() => history.back()}
							class="cursor-pointer w-9 h-9 bg-white/10 rounded-full flex items-center justify-center active:scale-95 transition-all"
							aria-label="Вернуться назад">
				<i class="bi bi-chevron-left text-lg"></i>
			</button>
			<span class="text-lg font-semibold">Запись на игру</span>
		</div>
	</div>
</Header>

<section use:fadeUp={{ delayStep: 300 }}>
	<div class="opacity-0 md:container md:mx-auto px-4 py-4 space-y-3">
		<div class="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
			<div class="flex items-start gap-3">
				<div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
					<i class="bi bi-controller text-2xl text-blue-400"></i>
				</div>
				<div class="flex-1">
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

		<form on:submit|preventDefault={submit} class="space-y-3">
			<div class="bg-[#1a1a2e] rounded-xl p-4 border border-white/5 flex flex-col gap-4">
				<label class="flex flex-col gap-2">
					<div class="flex items-center gap-0.5">
						<span class="text-lg font-medium">Имя и фамилия</span>
						<span class="text-sm text-red-600">*</span>
					</div>

					<input
						type="text"
						bind:value={signUpData.full_name}
						class="w-full rounded-lg px-4 py-3 text-base transition-all {errors.full_name ? 'bg-red-500/10 border border-red-500/50 focus:border-red-500' : 'bg-white/5 border border-white/10 focus:border-blue-500/50'}"
					/>

					{#if errors.full_name}
						<span class="text-xs text-red-500 mt-1">{errors.full_name}</span>
					{/if}
				</label>

				<label class="flex flex-col gap-2">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-0.5">
							<span class="text-lg font-medium">Номер телефона</span>
							<span class="text-sm text-red-600">*</span>
						</div>

						{#if contactRequestStatus !== "sent"}
							<button
								on:click={() => requestContact()}
								class="cursor-pointer w-8 h-8 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 active:scale-95 transition-all flex items-center justify-center"
								aria-label="Получить из Telegram"
							>
								<i class="bi bi-cloud-download-fill text-lg"></i>
							</button>
						{/if}
					</div>

					<PhoneInput
						bind:value={signUpData.phone_number}
						styles="w-full rounded-lg px-4 py-3 text-base transition-all {errors.phone_number ? 'bg-red-500/10 border border-red-500/50 focus:border-red-500' : 'bg-white/5 border border-white/10 focus:border-blue-500/50'}"
					/>

					{#if errors.phone_number}
						<span class="text-xs text-red-500 mt-1">{errors.phone_number}</span>
					{/if}
				</label>

				<label class="flex flex-col gap-2">
					<div class="flex items-center gap-1">
						<span class="text-lg font-medium">Позывной</span>
						<span class="text-sm text-gray-500">(необязательно)</span>
					</div>

					<input
						type="text"
						bind:value={signUpData.call_sign}
						class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-500/50 transition-all"
					/>
				</label>
			</div>

			<div class="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
				<div class="flex items-center gap-2 mb-3">
					<!--			<i class="bi bi-gear-fill"></i>-->
					<span class="text-lg font-medium">Снаряжение</span>
				</div>
				<div class="grid grid-cols-2 gap-3">
					<button
						class="py-3.5 rounded-lg text-sm font-semibold active:scale-95 transition-all border-2 {signUpData.equipment_type === 'OWN' ? 'bg-blue-500/20 border-blue-500/50' : 'bg-white/5 border-white/10 text-white/60'}"
						on:click={() => signUpData.equipment_type = "OWN"}>
						Своё снаряжение
					</button>
					<button
						class="py-3.5 rounded-lg text-sm font-semibold active:scale-95 transition-all border-2 {signUpData.equipment_type === 'RENT' ? 'bg-blue-500/20 border-blue-500/50' : 'bg-white/5 border-white/10 text-white/60'}"
						on:click={() => signUpData.equipment_type = "RENT"}>
						Аренда
					</button>
				</div>
			</div>

			<!--	<div class="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">-->
			<!--		<div class="flex items-center gap-2 mb-3">-->
			<!--&lt;!&ndash;			<i class="bi bi-credit-card-fill"></i>&ndash;&gt;-->
			<!--			<span class="text-lg font-medium">Способ оплаты</span>-->
			<!--		</div>-->
			<!--		<div class="grid grid-cols-2 gap-3">-->
			<!--			<button-->
			<!--				class="py-3.5 rounded-lg text-sm font-semibold active:scale-95 transition-all border-2 {selectedPayment === 'online' ? 'bg-blue-500/20 border-blue-500/50' : 'bg-white/5 border-white/10 text-white/60'}"-->
			<!--				on:click={() => selectedPayment = "online"}>-->
			<!--				Онлайн сейчас-->
			<!--			</button>-->
			<!--			<button-->
			<!--				class="py-3.5 rounded-lg text-sm font-semibold active:scale-95 transition-all border-2 {selectedPayment === 'cash' ? 'bg-blue-500/20 border-blue-500/50' : 'bg-white/5 border-white/10 text-white/60'}"-->
			<!--				on:click={() => selectedPayment = "cash"}>-->
			<!--				Наличные на игре-->
			<!--			</button>-->
			<!--		</div>-->
			<!--	</div>-->

			<!--	<div class="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">-->
			<!--		<label class="block">-->
			<!--			<div class="flex items-center gap-2 mb-3">-->
			<!--				<i class="bi bi-chat-left-text-fill text-yellow-400"></i>-->
			<!--				<span class="text-sm font-medium">Дополнительная информация</span>-->
			<!--			</div>-->
			<!--			<textarea-->
			<!--				bind:value={notes}-->
			<!--				placeholder="Особые пожелания, вопросы..."-->
			<!--				rows="3"-->
			<!--				class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-500/50 transition-all resize-none"-->
			<!--			></textarea>-->
			<!--		</label>-->
			<!--	</div>-->

			<div class="bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-xl p-4 border border-blue-500/20">
				<div class="flex items-center justify-between mb-2">
					<span class="text-sm text-white/70">Стоимость участия</span>
					<span class="text-2xl font-bold">{price} zł</span>
				</div>
				<div class="text-xs text-white/50 space-y-0.5">
					<div>
						{#if signUpData.equipment_type === "RENT"}
							<span>Аренда снаряжения включена</span>
						{:else}
							<span>Своё снаряжение</span>
						{/if}
					</div>
					<div>
						<span>Оплата на игре</span>
					</div>
				</div>
			</div>

			<div class="bg-[#1a1a2e] rounded-xl p-4 border border-white/5 flex flex-col gap-4">

				<label class="flex items-start gap-3 cursor-pointer select-none">
					<input type="checkbox" bind:checked={signUpData.save_data} class="sr-only peer">

					<div
						class="mt-[2px] w-5 h-5 min-w-5 min-h-5 flex items-center justify-center rounded-md border-2 border-white/20 bg-white/5 transition-all duration-200 peer-checked:bg-blue-500 peer-checked:border-blue-500 active:border-blue-400/50">
						{#if signUpData.save_data}
							<i class="bi bi-check text-white text-sm"></i>
						{/if}
					</div>

					<span class="text-sm text-white/70">
					Сохранить мои данные для следующих записей
				</span>
				</label>

				<label class="flex items-start gap-3 cursor-pointer select-none">
					<input type="checkbox" bind:checked={signUpData.accept_rules} class="sr-only peer">

					<div
						class=" mt-[2px] w-5 h-5 min-w-5 min-h-5 flex items-center justify-center rounded-md border-2 border-white/20 bg-white/5 transition-all duration-200 peer-checked:bg-blue-500 peer-checked:border-blue-500 active:border-blue-400/50">
						{#if signUpData.accept_rules}
							<i class="bi bi-check text-white text-sm"></i>
						{/if}
					</div>

					<span class="text-sm text-white/70">
					Я согласен с
					<a href="/" class="text-blue-400 underline">правилами игры</a>
					и
					<a href="/" class="text-blue-400 underline">политикой конфиденциальности</a>

						{#if errors.accept_rules}
						<br>
						<span class="text-xs text-red-500 mt-1">{errors.accept_rules}</span>
					{/if}
				</span>
				</label>

			</div>

			<div class="flex flex-col gap-2">
				<LoadButton {loading}
										typeButton="submit"
										disabled={!isFormValid}
										styles="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-[15px] font-semibold transition-all {isFormValid ? 'bg-blue-600 text-white active:scale-[0.97] active:opacity-80 cursor-pointer' : 'bg-gray-500/20 text-white/40 cursor-not-allowed opacity-60'}">
					Подтвердить запись
				</LoadButton>

				<button type="button" on:click={() => history.back()}
								class="text-center cursor-pointer w-full py-3 bg-white/[0.1] text-white rounded-xl text-[15px] font-semibold active:scale-[0.97] active:opacity-80 transition-all">
					Отменить
				</button>
			</div>
		</form>
	</div>
</section>
