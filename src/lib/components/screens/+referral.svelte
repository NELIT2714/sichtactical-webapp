<script lang="ts">
	import type { User } from "$lib/context/js/types/user";

	export let user : User

	const referralCode = user.referral_code;

	let copied = false;

	const copyToClipboard = () => {
		navigator.clipboard.writeText(referralCode);
		copied = true;
		setTimeout(() => (copied = false), 3000);
	}
</script>

<section class="px-4 opacity-0">
	<h3 class="text-lg font-bold mb-3">Приглашайте друзей</h3>

	<div class="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-5 border border-purple-500/30">
		<div class="mb-3">
			<h4 class="font-semibold mb-1">Получайте награды вместе!</h4>
			<p class="text-sm text-white/60">Вы: 500 XP + 15 zł за первую игру друга</p>
			<p class="text-sm text-white/60">Друг: 200 XP + 20 zł после двух игр</p>
		</div>

		<div class="bg-white/5 rounded-lg p-3 mb-3 border border-white/10">
			<div class="text-xs text-white/50 mb-1">Ваш код приглашения</div>
			<div class="flex items-center justify-between gap-2">
				<code class="text-md font-mono font-bold text-purple-300">{referralCode}</code>
			</div>
		</div>

		<div class="flex gap-2">
			<button on:click={copyToClipboard} class="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2">
				<i class="bi bi-copy"></i>
				{copied ? "Скопировано!" : "Копировать"}
			</button>
		</div>
	</div>
</section>
