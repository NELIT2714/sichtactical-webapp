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

export const hasEventStarted = (eventDate: string, startTime: string): boolean => {
	const nowUtc = new Date();
	const warsawTimeStr = new Intl.DateTimeFormat("en-EN", {
		timeZone: "Europe/Warsaw",
		hour12: false,
		hour: "2-digit",
		minute: "2-digit",
	}).format(nowUtc);

	const [hours, minutes] = warsawTimeStr.split(":").map(Number);
	const nowTimeStr = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
	const todayStr = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(nowUtc); // "YYYY-MM-DD"

	if (eventDate < todayStr) return true;
	return eventDate === todayStr && startTime <= nowTimeStr;
};