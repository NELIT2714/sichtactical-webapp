import type { PageLoad } from "./$types";
import { getReferralStats } from "$lib/context/js/referral";

export const load: PageLoad = async ({ parent }) => {
	const parentData = await parent();

	const initPromise = (async () => {
		const referralStats = await getReferralStats();
		const rootData = await parentData.appData;
		return { referralStats, user: rootData.user };
	})();

	return {
		appData: initPromise
	};
};

