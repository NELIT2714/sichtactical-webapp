<script lang="ts">
	import type { User } from "$lib/context/js/types/user";
	import { progressForXP } from "$lib/context/js/xp";
	import { fadeUp } from "$lib/context/js/ui/fadeUp";

	export let user: User;
	export let topUpEnabled: boolean = false;

	$: ({ level, experience, experienceToNextLevel, levelProgress } = progressForXP(user.xp_total));
</script>

<section class="px-4">
	<div class="bg-[#1a1a2e] rounded-2xl p-4 border border-blue-500/15 shadow-xl space-y-3 animate-pulse">

		<div class="space-y-1">
			<div class="h-7 w-2/3 bg-white/10 rounded-lg"></div>

			<div class="space-y-1.5 mt-1">
				<div class="flex justify-between items-center">
					<div class="h-3 w-36 bg-white/8 rounded"></div>
					<div class="h-3 w-16 bg-white/8 rounded"></div>
				</div>
				<div class="h-1.5 bg-white/[0.08] rounded-full"></div>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-2.5">

			<div class="bg-white/5 rounded-xl border border-white/10 p-3.5 flex flex-col items-center gap-1.5">
				<div class="h-2.5 w-14 bg-white/10 rounded"></div>
				<div class="h-6 w-8 bg-blue-400/20 rounded-md"></div>
			</div>

			<div class="bg-white/5 rounded-xl border border-white/10 p-3.5 flex flex-col items-center gap-1.5">
				<div class="h-2.5 w-10 bg-white/10 rounded"></div>
				<div class="h-6 w-8 bg-green-400/20 rounded-md"></div>
			</div>

			<div class="col-span-2 bg-white/5 rounded-xl border border-white/10 p-3.5 flex flex-col items-center gap-1.5">
				<div class="h-2.5 w-6 bg-white/10 rounded"></div>
				<div class="h-6 w-16 bg-purple-400/20 rounded-md"></div>
			</div>

		</div>

	</div>
</section>