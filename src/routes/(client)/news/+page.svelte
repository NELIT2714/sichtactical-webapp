<script lang="ts">
	import { fadeUp } from "$lib/context/js/ui/fadeUp";

	import Header from "$lib/components/+header.svelte";
</script>

<Header>
	<h1 class="text-xl font-bold mb-0.5 uppercase">Sich Tactical</h1>
	<p class="text-[13px] text-white/50">Новости и обновления</p>
</Header>

<section class="md:container md:mx-auto px-4 py-4">
	<div use:fadeUp={{ delayStep: 100 }}>
		<div class="opacity-0 flex flex-col gap-4">

			<!-- Filters -->
			<div class="flex gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pt-4 pb-2">
				<button class="bg-blue-500/15 border border-blue-500/35 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap">Все</button>
				<button class="bg-white/5 border border-white/[0.07] text-white/60 text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap hover:bg-white/[0.08] transition-all">События</button>
				<button class="bg-white/5 border border-white/[0.07] text-white/60 text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap hover:bg-white/[0.08] transition-all">Достижения</button>
				<button class="bg-white/5 border border-white/[0.07] text-white/60 text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap hover:bg-white/[0.08] transition-all">Объявления</button>
				<button class="bg-white/5 border border-white/[0.07] text-white/60 text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap hover:bg-white/[0.08] transition-all">Система</button>
			</div>

			<!-- News list -->
			<div class="flex flex-col gap-2">

				<!-- Date group: Сегодня -->
				<p class="text-[11px] text-white/30 uppercase tracking-widest font-semibold mb-2 mt-2">Сегодня</p>

				<div class="bg-[#1a1a2e] border border-white/5  transition-all rounded-xl p-3.5 flex items-start gap-3 cursor-pointer">
					<div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
						<i class="bi bi-calendar-event-fill text-sm text-white"></i>
					</div>
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-1.5 mb-0.5">
							<h4 class="font-semibold text-sm">Новое событие добавлено</h4>
							<span class="w-1.5 h-1.5 rounded-full bg-blue-500 "></span>
						</div>
						<p class="text-xs text-white/60 line-clamp-2">Добавлена игра на 22 февраля в 10:00. Запись открыта, количество мест ограничено — успей зарегистрироваться.</p>
						<span class="text-[11px] text-white/35 mt-1.5 inline-block">14:32</span>
					</div>
					<i class="bi bi-chevron-right text-sm text-white/25 mt-1 "></i>
				</div>

				<div class="bg-[#1a1a2e] border border-white/5  transition-all rounded-xl p-3.5 flex items-start gap-3 cursor-pointer">
					<div class="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center ">
						<i class="bi bi-trophy-fill text-sm text-white"></i>
					</div>
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-1.5 mb-0.5">
							<h4 class="font-semibold text-sm">Достижение разблокировано</h4>
							<span class="w-1.5 h-1.5 rounded-full bg-blue-500 "></span>
						</div>
						<p class="text-xs text-white/60 line-clamp-2">Вы достигли уровня 8! Получено 500 XP за участие в игре. Открыт новый ранг — «Ветеран».</p>
						<span class="text-[11px] text-white/35 mt-1.5 inline-block">09:15</span>
					</div>
					<i class="bi bi-chevron-right text-sm text-white/25 mt-1 "></i>
				</div>

				<!-- Date group: Вчера -->
				<p class="text-[11px] text-white/30 uppercase tracking-widest font-semibold mb-2 mt-3">Вчера</p>

				<div class="bg-[#1a1a2e] border border-white/5  transition-all rounded-xl p-3.5 flex items-start gap-3 cursor-pointer">
					<div class="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center ">
						<i class="bi bi-megaphone-fill text-sm text-white"></i>
					</div>
					<div class="flex-1 min-w-0">
						<h4 class="font-semibold text-sm mb-0.5">Важное объявление</h4>
						<p class="text-xs text-white/60 line-clamp-2">Клуб будет закрыт 31 декабря в связи с техническим обслуживанием полигона. Все записи перенесены.</p>
						<span class="text-[11px] text-white/35 mt-1.5 inline-block">18:00</span>
					</div>
					<i class="bi bi-chevron-right text-sm text-white/25 mt-1 "></i>
				</div>

				<div class="bg-[#1a1a2e] border border-white/5  transition-all rounded-xl p-3.5 flex items-start gap-3 cursor-pointer">
					<div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center ">
						<i class="bi bi-star-fill text-sm text-white"></i>
					</div>
					<div class="flex-1 min-w-0">
						<h4 class="font-semibold text-sm mb-0.5">Вы получили бонус</h4>
						<p class="text-xs text-white/60 line-clamp-2">За приглашение друга начислено 50 бонусных очков на ваш счёт.</p>
						<span class="text-[11px] text-white/35 mt-1.5 inline-block">12:44</span>
					</div>
					<i class="bi bi-chevron-right text-sm text-white/25 mt-1 "></i>
				</div>

				<!-- Date group: 3 дня назад -->
				<p class="text-[11px] text-white/30 uppercase tracking-widest font-semibold mb-2 mt-3">3 дня назад</p>

				<div class="bg-[#1a1a2e] border border-white/5  transition-all rounded-xl p-3.5 flex items-start gap-3 cursor-pointer">
					<div class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center ">
						<i class="bi bi-shield-fill-check text-sm text-white"></i>
					</div>
					<div class="flex-1 min-w-0">
						<h4 class="font-semibold text-sm mb-0.5">Обновление системы</h4>
						<p class="text-xs text-white/60 line-clamp-2">Добавлена реферальная система. Приглашай друзей и получай бонусы за каждого зарегистрированного.</p>
						<span class="text-[11px] text-white/35 mt-1.5 inline-block">10:20</span>
					</div>
					<i class="bi bi-chevron-right text-sm text-white/25 mt-1 "></i>
				</div>

				<div class="bg-[#1a1a2e] border border-white/5  transition-all rounded-xl p-3.5 flex items-start gap-3 cursor-pointer">
					<div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center ">
						<i class="bi bi-people-fill text-sm text-white"></i>
					</div>
					<div class="flex-1 min-w-0">
						<h4 class="font-semibold text-sm mb-0.5">Игра подтверждена</h4>
						<p class="text-xs text-white/60 line-clamp-2">Набрано минимальное количество игроков. Игра 18 февраля состоится. Ждём тебя на полигоне!</p>
						<span class="text-[11px] text-white/35 mt-1.5 inline-block">08:05</span>
					</div>
					<i class="bi bi-chevron-right text-sm text-white/25 mt-1 "></i>
				</div>

			</div>
		</div>
	</div>
</section>