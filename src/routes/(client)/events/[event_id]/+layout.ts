import type { LayoutLoad } from "./$types";
import { getEvent } from "$lib/context/js/events";
import { redirect } from "@sveltejs/kit";

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent();
	const rootData = await parentData.appData;

	const eventID: number = parseInt(params.event_id, 10);
	if (isNaN(eventID)) throw redirect(302, "/events");

	const eventPromise = (async () => {
		try {
			const event = await getEvent(eventID);
			return { event };
		} catch (error) {
			console.error(`Ошибка загрузки события ${eventID}:`, error);
			return { event: null };
		}
	})();

	return {
		eventPromise, user: rootData.user
	};
};