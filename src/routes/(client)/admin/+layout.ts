import type { LayoutLoad } from "./$types";
import {
	adminGetEvents,
	adminGetUsers,
	adminGetNotifications,
	adminGetStats,
} from "$lib/context/js/admin";

export const load: LayoutLoad = async ({ parent }) => {
	const parentData = await parent();
	await parentData.appData;

	const adminData = (async () => {
		const [events, users, notifications, stats] = await Promise.all([
			adminGetEvents(),
			adminGetUsers(),
			adminGetNotifications(),
			adminGetStats(),
		]);
		return { events, users, notifications, stats };
	})();

	return { adminData };
};
