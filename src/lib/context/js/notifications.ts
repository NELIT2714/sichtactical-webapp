import { API } from "$lib/context/js/axios";
import type { NotificationsResponse } from "$lib/context/js/types/notification";

export const getNotifications = async (): Promise<NotificationsResponse | null> => {
	try {
		const responseNotifications = await API.get("/v1/notifications")
		return responseNotifications.data.status ? responseNotifications.data.response : null;
	} catch (err) {
		return null;
	}
}