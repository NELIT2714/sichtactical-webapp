<script lang="ts">
	import { fadeUp } from "$lib/context/js/ui/fadeUp";
	import { goto } from "$app/navigation";

	import Header from "$lib/components/+header.svelte";
</script>

<Header>
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<button on:click={() => history.back()}
							class="cursor-pointer w-9 h-9 bg-white/10 rounded-full flex items-center justify-center active:scale-95 transition-all"
							aria-label="Вернуться назад">
				<i class="bi bi-chevron-left text-lg"></i>
			</button>
			<span class="text-lg font-semibold">Уведомление</span>
		</div>

		<!--		<button-->
		<!--			class="cursor-pointer w-9 h-9 bg-white/10 rounded-full flex items-center justify-center active:scale-95 transition-all"-->
		<!--			aria-label="Поделиться">-->
		<!--			<i class="bi bi-share text-lg"></i>-->
		<!--		</button>-->
	</div>
</Header>

<section class="md:container md:mx-auto px-4 py-4">
	<div use:fadeUp={{ delayStep: 80 }}>
		<div class="opacity-0 flex flex-col gap-3">

			<!-- Icon + title -->
			<div class="bg-[#1a1a2e] border border-white/5 rounded-2xl p-5">
				<div class="flex items-start gap-4">
					<div class="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/20">
						<i class="bi bi-megaphone-fill text-xl text-white"></i>
					</div>
					<div class="flex-1 min-w-0 pt-0.5">
						<span class="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 uppercase tracking-wider mb-1.5">
							<i class="bi bi-broadcast text-[10px]"></i> Объявление
						</span>
						<h2 class="text-lg font-bold leading-snug">Клуб закрыт 31 декабря</h2>
					</div>
				</div>
			</div>

			<!-- Meta info -->
			<div class="bg-[#1a1a2e] border border-white/5 rounded-2xl overflow-hidden">
				<div class="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
					<span class="text-xs text-white/45 flex items-center gap-2">
						<i class="bi bi-clock text-white/30"></i> Дата
					</span>
					<span class="text-xs font-medium text-white/80">Вчера, 18:00</span>
				</div>
				<div class="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
					<span class="text-xs text-white/45 flex items-center gap-2">
						<i class="bi bi-person text-white/30"></i> Отправитель
					</span>
					<span class="text-xs font-medium text-white/80">Администрация клуба</span>
				</div>
				<div class="flex items-center justify-between px-4 py-3">
					<span class="text-xs text-white/45 flex items-center gap-2">
						<i class="bi bi-tag text-white/30"></i> Категория
					</span>
					<span class="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
						Объявление
					</span>
				</div>
			</div>

			<!-- Description -->
			<div class="bg-[#1a1a2e] border border-white/5 rounded-2xl p-4">
				<h3 class="text-[11px] text-white/35 uppercase tracking-widest font-semibold mb-3">Сообщение</h3>
				<p class="text-sm text-white/80 leading-relaxed">
					Уважаемые игроки, сообщаем, что <span class="text-white font-semibold">31 декабря</span> клуб будет закрыт в связи с плановым техническим обслуживанием полигона.
				</p>
				<div class="h-px bg-white/[0.06] my-3"></div>
				<p class="text-sm text-white/80 leading-relaxed">
					Все записи на этот день автоматически перенесены. Если вы хотите выбрать новую дату — перейдите в раздел «События» и запишитесь на удобное время.
				</p>
				<div class="h-px bg-white/[0.06] my-3"></div>
				<p class="text-sm text-white/80 leading-relaxed">
					Приносим извинения за доставленные неудобства. С наступающим Новым годом! 🎉
				</p>
			</div>

			<!-- Action buttons -->
			<div class="flex flex-col gap-2">
				<button on:click={() => goto("/events")} class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all text-sm font-semibold flex items-center justify-center gap-2">
					<i class="bi bi-calendar3"></i> Перейти к событиям
				</button>
				<button class="w-full py-3 rounded-xl bg-white/5 hover:bg-white/[0.08] active:scale-[0.98] transition-all text-sm font-medium text-white/70 border border-white/[0.07]">
					Закрыть уведомление
				</button>
			</div>

			<!-- Related -->
			<div>
				<p class="text-[11px] text-white/30 uppercase tracking-widest font-semibold mb-2">Другие новости</p>
				<div class="bg-[#1a1a2e] border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all rounded-xl p-3.5 flex items-start gap-3 cursor-pointer">
					<div class="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
						<i class="bi bi-calendar-event-fill text-xs text-white"></i>
					</div>
					<div class="flex-1 min-w-0">
						<h4 class="font-semibold text-sm mb-0.5">Новое событие добавлено</h4>
						<p class="text-xs text-white/55 line-clamp-1">Добавлена игра на 22 февраля в 10:00.</p>
						<span class="text-[11px] text-white/35 mt-1 inline-block">Сегодня, 14:32</span>
					</div>
					<i class="bi bi-chevron-right text-sm text-white/25 mt-1 flex-shrink-0"></i>
				</div>
			</div>

		</div>
	</div>
</section>