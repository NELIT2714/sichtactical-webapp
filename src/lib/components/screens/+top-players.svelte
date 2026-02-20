<script lang="ts">
	import type { User } from "$lib/context/js/types/user";

	// Mock data for top players
	const topPlayers: User[] = [
		{
			id: 1,
			first_name: "Andriej",
			last_name: "Sokołow",
			call_sign: "OMEGA",
			level: 12,
			experience: 8500,
			phone: "+48123456789",
			avatar_color: "from-yellow-500 to-orange-500",
			games_played: 28,
			registered_events: [1, 2, 3],
			balance: 500,
		},
		{
			id: 2,
			first_name: "Maksym",
			last_name: "Petrow",
			call_sign: "TITAN",
			level: 10,
			experience: 6200,
			phone: "+48111111111",
			avatar_color: "from-green-500 to-teal-500",
			games_played: 21,
			registered_events: [1, 2],
			balance: 450,
		},
		{
			id: 3,
			first_name: "Dmitrij",
			last_name: "Kowalew",
			call_sign: "GHOST",
			level: 9,
			experience: 5100,
			phone: "+48222222222",
			avatar_color: "from-orange-500 to-red-500",
			games_played: 19,
			registered_events: [1],
			balance: 380,
		},
		{
			id: 4,
			first_name: "Igor",
			last_name: "Nowak",
			call_sign: "VIPER",
			level: 8,
			experience: 4300,
			phone: "+48333333333",
			avatar_color: "from-purple-500 to-pink-500",
			games_played: 16,
			registered_events: [2, 3],
			balance: 320,
		},
	];

	$: getAvatarInitial = (name: string) => name.charAt(0).toUpperCase();
</script>

<section class="px-4 py-4">
	<h3 class="text-lg font-bold mb-3">Топ игроки</h3>

	<div class="bg-[#1a1a2e] rounded-2xl p-4 border border-white/10 overflow-hidden">
		<div class="space-y-2">
			{#each topPlayers as player, index (player.id)}
				<div class="flex items-center gap-3 p-3 hover:bg-white/[0.05] rounded-xl transition-all cursor-pointer">
					<!-- Rank Badge -->
					<div class="w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm bg-white/10 rounded-full text-white/70">
						{index + 1}
					</div>

					<!-- Avatar -->
					<div class="w-10 h-10 bg-gradient-to-br {player.avatar_color} rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">
						{getAvatarInitial(player.first_name)}
					</div>

					<!-- Player Info -->
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-1.5 mb-0.5">
							<div class="font-semibold text-sm truncate">{player.first_name} {player.last_name}</div>
							<span class="text-xs text-blue-400 font-medium">({player.call_sign})</span>
						</div>
						<div class="text-xs text-white/50">{player.games_played} игр</div>
					</div>

					<!-- Level Badge -->
					<div class="flex flex-col items-center gap-1 flex-shrink-0">
						<div class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-sm font-bold text-white/60">
							{player.level}
						</div>
						<span class="text-[10px] text-white/40 font-medium">Lvl</span>
					</div>
				</div>
			{/each}
		</div>

		<button class="w-full mt-3 py-2.5 text-sm text-blue-400 font-medium bg-white/[0.05] rounded-lg hover:bg-white/[0.08] transition-all">
			Все игроки →
		</button>
	</div>
</section>
