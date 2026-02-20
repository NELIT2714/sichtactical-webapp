<script lang="ts">
	import { goto } from "$app/navigation";
</script>

<section class="opacity-0">
	<div class="bg-gradient-to-br from-[#1a2332] to-[#1a1a2e] rounded-2xl p-8 border border-blue-500/20 shadow-xl text-center">
		<div class="mb-4">
			<i class="bi bi-calendar-x text-4xl text-white/40"></i>
		</div>
		<h3 class="text-lg font-semibold mb-2">Нет событий</h3>
		<p class="text-sm text-white/50">В данный момент нет запланированных игр. Проверьте позже!</p>

<!--		<button on:click={() => goto("/events")}-->
<!--						class="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[14px] font-semibold transition-all">-->
<!--			Смотреть все события-->
<!--		</button>-->
	</div>
</section>
