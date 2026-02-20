import type { PageLoad } from "./$types";
import { getEvents } from "$lib/context/js/events";

export const load: PageLoad = async () => {
	try {
		const response = await getEvents();
		return { eventsResponse: response };
	} catch (error) {
		console.error("Error fetching data:", error);
		return { eventsResponse: null };
	}
};