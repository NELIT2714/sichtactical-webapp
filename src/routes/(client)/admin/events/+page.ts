import type { PageLoad } from "./$types";
import { adminGetEvents } from "$lib/context/js/admin";

export const load: PageLoad = async ({ parent }) => {
	const parentData = await parent();

	const initPromise = (async () => {
		try {
			await parentData.authReady;
			const response = await adminGetEvents();
			return { eventsResponse: response };
		} catch (error) {
			console.error("Error fetching data:", error);
			return { eventsResponse: null };
		}
	})();

	return { parentData, appData: initPromise };
};
