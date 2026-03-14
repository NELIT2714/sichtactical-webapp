import type { PageLoad } from "./$types";
import { getEvents } from "$lib/context/js/events";

export const load: PageLoad = async ({ parent }) => {
	// Keep parent reference (auth/theme) but avoid blocking on its promise to show skeleton instantly
	await parent();

	const initPromise = (async () => {
		try {
			const response = await getEvents();
			return { eventsResponse: response };
		} catch (error) {
			console.error("Error fetching data:", error);
			return { eventsResponse: null };
		}
	})();

	return {
		appData: initPromise
	};
};