import type { PageLoad } from "./$types";
import { getNotifications } from "$lib/context/js/notifications";

export const load: PageLoad = async ({ parent }) => {
	// Parent may supply theme/auth, but don't await its data to keep UI responsive
	await parent();

	const initPromise = (async () => {
		try {
			const response = await getNotifications();
			return { notificationsResponse: response };
		} catch (error) {
			console.error("Error fetching data:", error);
			return { notificationsResponse: null };
		}
	})();

	return {
		appData: initPromise
	};
};