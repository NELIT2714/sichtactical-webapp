import { writable } from "svelte/store";
import { API } from "$lib/context/js/axios";

export const eventsStore = writable([]);

export const getEvents = async () => {
	try {
		const responseEvents = await API.get("/v1/events")
		return responseEvents.data.status ? responseEvents.data.response : null;
	} catch (err) {
		return null;
	}
}

export const getEvent = async (eventID: number) => {
	try {
		const responseEvent = await API.get(`/v1/events/${eventID}`)
		console.log(responseEvent);
		return responseEvent.data.status ? responseEvent.data.event : null;
	} catch (err) {
		return null;
	}
}
