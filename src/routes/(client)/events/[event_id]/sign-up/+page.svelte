<script lang="ts">
	import { API } from "$lib/context/js/axios";
	import { goto } from "$app/navigation";
	import { fadeUp } from "$lib/context/js/ui/fadeUp";
	import { validateFullName, validatePhone, validateRules } from "$lib/context/js/validation";

	import LoadButton from "$lib/components/ui/+load-button.svelte";
	import PhoneInput from "$lib/components/ui/+phone-input.svelte";
	import Header from "$lib/components/+header.svelte";
	import SkeletonSignUp from "$lib/components/skeletons/+sign-up.svelte";
	import { tick } from "svelte";

	const lang = "ru";
	export let data;

	let signUpData = {
		full_name: "",
		phone_number: "",
		call_sign: null as string | null,
		equipment_type: "OWN",
		save_data: true,
		accept_rules: false,
	};

	let loading = false;
	let eventInfo: any = null;

	let errors = {
		full_name: "",
		phone_number: "",
		accept_rules: "",
	};

	let touched = {
		full_name: false,
		phone_number: false,
		accept_rules: false,
	};

	let isFormValid = false;
	let price = 0;

	const initUserData = () => {
		const user = data?.user;
		if (!user) return;
		signUpData.full_name = user.telegram_data?.first_name ? `${user.telegram_data.first_name} ${user.telegram_data.last_name ?? ""}`.trim() : "";
		signUpData.phone_number = user.telegram_data?.phone_number ?? "";
		signUpData.call_sign = user.call_sign ?? null;
	};
	initUserData();

	data.eventPromise.then((eventResponse: any) => {
		eventInfo = eventResponse?.event ?? null;
	});

	const tg : any = window?.Telegram?.WebApp;

	const waitForUserUpdate = async ({ interval = 500, timeout = 7000 } = {}) => {
		const start = Date.now();

		while (Date.now() - start < timeout) {
			try {
				const response = await API.get("/v1/users/me");

				if (response.data.status && response.data.user.telegram_data.phone_number) {
					return response.data.user;
				}
			} catch (error) {
				console.error("Polling error:", error);
			}

			await new Promise(res => setTimeout(res, interval));
		}

		console.warn("Timeout: user update not detected");
	};

	const requestContact = () => {
		if (!tg?.initData) return;

		tg.requestContact(async (status: boolean) => {
			if (status) {
				try {
					const updatedUser = await waitForUserUpdate();
					const phone = updatedUser?.telegram_data?.phone_number;

					if (phone) {
						signUpData = { ...signUpData, phone_number: phone };
						touched.phone_number = true;
						await tick();
					}
				} catch (error) {
					console.error(error);
				}
			}
		});
	};

	$: errors.full_name = validateFullName(signUpData.full_name);
	$: errors.phone_number = validatePhone(signUpData.phone_number);
	$: errors.accept_rules = validateRules(signUpData.accept_rules);
	$: isFormValid = !!eventInfo && !errors.full_name && !errors.phone_number && !errors.accept_rules;
	$: price = eventInfo?.cost ? (signUpData.equipment_type === "RENT" ? 200 : eventInfo.cost) : 0;

	$: showError = {
		full_name: touched.full_name && !!errors.full_name,
		phone_number: touched.phone_number && !!errors.phone_number,
		accept_rules: touched.accept_rules && !!errors.accept_rules,
	};

	const submit = async () => {
		if (!isFormValid || !eventInfo) return;

		const payload = { ...signUpData, call_sign: signUpData.call_sign ?? "" };

		try {
			loading = true;

			console.log(payload);

			await Promise.all([
				API.post("/v1/users/app", {
					user_telegram_id: data.user.telegram_data.telegram_id,
					save_data: signUpData.save_data,
					init_data: tg.initData
				}),
				API.post(`/v1/events/${eventInfo.id_event}/members`, payload)
			]);

			await goto(`/events/${eventInfo.id_event}/sign-up/success`);
		} catch {
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

<section>
	{#await data.eventPromise}
		<SkeletonSignUp />
	{:then}
		{@const eventDate = eventInfo?.event_date && new Date(eventInfo.event_date)}

		<div use:fadeUp={{ delayStep: 300 }}>
			<div class="opacity-0 md:container md:mx-auto px-4 py-4 space-y-3">
				<div class="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
					<div class="flex items-start gap-3">
						<div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
							<i class="bi bi-controller text-2xl text-blue-400"></i>
						</div>
						<div class="flex-1">
							{#if eventInfo}
								<h3 class="font-display text-lg font-semibold tracking-wide mb-1">
									{eventInfo?.event_data?.[lang]?.name ?? ""}
								</h3>
								<div class="flex items-center gap-2 text-xs text-white/50">
								<span>
									<i class="bi bi-calendar-event-fill"></i>
									{eventDate?.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) ?? ""}
								</span>
									<span>•</span>
									<span>
									<i class="bi bi-clock-fill"></i>
										{eventInfo?.start_time?.slice(0, 5) ?? ""} - {eventInfo?.end_time?.slice(0, 5) ?? ""}
								</span>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<form on:submit|preventDefault={submit} class="space-y-3">
					<div class="bg-[#1a1a2e] rounded-xl p-4 border border-white/5 flex flex-col gap-4">
						<div class="flex flex-col gap-2">
							<div class="flex items-center gap-0.5">
								<span class="text-lg font-medium">Имя и фамилия</span>
								<span class="text-sm text-red-600">*</span>
							</div>
							<input
								type="text"
								bind:value={signUpData.full_name}
								on:input={() => touched.full_name = true}
								on:blur={() => touched.full_name = true}
								class="w-full rounded-lg px-4 py-3 text-base transition-all {showError.full_name ? 'bg-red-500/10 border border-red-500/50 focus:border-red-500' : 'bg-white/5 border border-white/10 focus:border-blue-500/50'}"
							/>
							{#if showError.full_name}
								<span class="text-xs text-red-500 mt-1">{errors.full_name}</span>
							{/if}
						</div>

						<div class="flex flex-col gap-2">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-0.5 pointer-events-none">
									<span class="text-lg font-medium">Номер телефона</span>
									<span class="text-sm text-red-600">*</span>
								</div>
								<button type="button"
												on:click={() => requestContact()}
												class="cursor-pointer w-8 h-8 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 active:scale-95 transition-all flex items-center justify-center"
												aria-label="Получить из Telegram"
								>
									<i class="bi bi-cloud-download-fill text-lg"></i>
								</button>
							</div>

							<PhoneInput
								bind:value={signUpData.phone_number}
								on:input={() => touched.phone_number = true}
								on:blur={() => touched.phone_number = true}
								styles="w-full rounded-lg px-4 py-3 text-base transition-all {showError.phone_number ? 'bg-red-500/10 border border-red-500/50 focus:border-red-500' : 'bg-white/5 border border-white/10 focus:border-blue-500/50'}"
							/>
							{#if showError.phone_number}
								<span class="text-xs text-red-500 mt-1">{errors.phone_number}</span>
							{/if}
						</div>

						<div class="flex flex-col gap-2">
							<div class="flex items-center gap-1">
								<span class="text-lg font-medium">Позывной</span>
								<span class="text-sm text-gray-500">(необязательно)</span>
							</div>
							<input
								type="text"
								bind:value={signUpData.call_sign}
								class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-500/50 transition-all"
							/>
						</div>
					</div>

					<div class="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
						<div class="flex items-center gap-2 mb-3">
							<span class="text-lg font-medium">Снаряжение</span>
						</div>
						<div class="grid grid-cols-2 gap-3">
							<button type="button"
											class="cursor-pointer py-3.5 rounded-lg text-sm font-semibold active:scale-95 transition-all border-2 {signUpData.equipment_type === 'OWN' ? 'bg-blue-500/20 border-blue-500/50' : 'bg-white/5 border-white/10 text-white/60'}"
											on:click={() => signUpData.equipment_type = "OWN"}>Своё снаряжение</button>
							<button type="button"
											class="cursor-pointer py-3.5 rounded-lg text-sm font-semibold active:scale-95 transition-all border-2 {signUpData.equipment_type === 'RENT' ? 'bg-blue-500/20 border-blue-500/50' : 'bg-white/5 border-white/10 text-white/60'}"
											on:click={() => signUpData.equipment_type = "RENT"}>Аренда</button>
						</div>
					</div>

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
							<div><span>Оплата на игре</span></div>
						</div>
					</div>

					<div class="bg-[#1a1a2e] rounded-xl p-4 border border-white/5 flex flex-col gap-4">
						<label class="flex items-start gap-3 cursor-pointer select-none">
							<input type="checkbox" bind:checked={signUpData.save_data} class="sr-only peer">
							<div class="mt-[2px] w-5 h-5 min-w-5 min-h-5 flex items-center justify-center rounded-md border-2 border-white/20 bg-white/5 transition-all duration-200 peer-checked:bg-blue-500 peer-checked:border-blue-500 active:border-blue-400/50">
								{#if signUpData.save_data}<i class="bi bi-check text-white text-sm"></i>{/if}
							</div>
							<span class="text-sm text-white/70">Сохранить мои данные для следующих записей</span>
						</label>

						<label class="flex items-start gap-3 cursor-pointer select-none"
									 on:change={() => touched.accept_rules = true}>
							<input type="checkbox" bind:checked={signUpData.accept_rules} class="sr-only peer">
							<div class="mt-[2px] w-5 h-5 min-w-5 min-h-5 flex items-center justify-center rounded-md border-2 border-white/20 bg-white/5 transition-all duration-200 peer-checked:bg-blue-500 peer-checked:border-blue-500 active:border-blue-400/50">
								{#if signUpData.accept_rules}<i class="bi bi-check text-white text-sm"></i>{/if}
							</div>
							<span class="text-sm text-white/70">
								Я согласен с
								<a href="/" class="text-blue-400 underline">правилами игры</a>
								и
								<a href="/" class="text-blue-400 underline">политикой конфиденциальности</a>
								{#if showError.accept_rules}<br><span class="text-xs text-red-500 mt-1">{errors.accept_rules}</span>{/if}
							</span>
						</label>
					</div>

					<div class="flex flex-col gap-2">
						<LoadButton {loading} typeButton="submit" disabled={!isFormValid}
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
		</div>
	{/await}
</section>