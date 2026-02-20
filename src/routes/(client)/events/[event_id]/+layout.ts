import type { LayoutLoad } from "./$types";
import { getEvent } from "$lib/context/js/events";
import { redirect } from "@sveltejs/kit";

export const load: LayoutLoad = async ({ params, parent }) => {
	await parent();

	const eventID : number = parseInt(params.event_id, 10);
	if (isNaN(eventID)) return redirect(302, "/events");

	const event = await getEvent(eventID);
	return { event };
};