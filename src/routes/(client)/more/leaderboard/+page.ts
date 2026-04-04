import type { PageLoad } from "./$types";
import { getLeaderboard } from "$lib/context/js/referral";

export const load: PageLoad = async ({ parent }) => {
	const parentData = await parent();

	const initPromise = (async () => {
		await parentData.authReady;
		const leaderboard = await getLeaderboard();
		return { leaderboard };
	})();

	return {
		appData: initPromise,
	};
};
