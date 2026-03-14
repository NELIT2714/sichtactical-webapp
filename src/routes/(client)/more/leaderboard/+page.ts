import type { PageLoad } from "./$types";
import { getLeaderboard } from "$lib/context/js/referral";

export const load: PageLoad = async ({ parent }) => {
	// Keep parent for shared data, avoid blocking on its promise to show skeleton fast
	await parent();

	const initPromise = (async () => {
		const leaderboard = await getLeaderboard();
		return { leaderboard };
	})();

	return {
		appData: initPromise,
	};
};
