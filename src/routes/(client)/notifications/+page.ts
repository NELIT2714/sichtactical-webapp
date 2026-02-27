import type { PageLoad } from "./$types";
import { getNotifications } from "$lib/context/js/notifications";

export const load: PageLoad = async ({ parent }) => {
	const parentData = await parent();
	await parentData.appData;

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
	}
};