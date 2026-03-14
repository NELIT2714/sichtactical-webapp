import type { LayoutLoad } from "./$types";
import {
	adminGetEvents,
	adminGetUsers,
	adminGetNotifications,
} from "$lib/context/js/admin";

export const load: LayoutLoad = async ({ parent }) => {
	const parentData = await parent();
	await parentData.appData;

	const adminData = (async () => {
		const [events, users, notifications] = await Promise.all([
			adminGetEvents(),
			adminGetUsers(),
			adminGetNotifications(),
		]);
		return { events, users, notifications };
	})();

	return { adminData };
};
