import { API } from "$lib/context/js/axios";
import type {
	NotificationCategory,
	NotificationItem,
	NotificationsResponse,
	CategoryConfig,
	DateGroup,
} from "$lib/context/js/types/notification";

export type {
	NotificationCategory,
	NotificationItem,
	NotificationsResponse,
	CategoryConfig,
	DateGroup,
};

// ─── Config ──────────────────────────────────────────────────────────────────

export const CATEGORY_CONFIG: Record<NotificationCategory, CategoryConfig> = {
	EVENT: {
		icon: 'bi-calendar-event-fill',
		bgClass: 'bg-blue-600',
		label: 'Событие',
	},
	SIGNUP: {
		icon: 'bi-person-check-fill',
		bgClass: 'bg-gradient-to-br from-teal-500 to-cyan-600',
		label: 'Запись',
	},
	ACHIEVEMENT: {
		icon: 'bi-trophy-fill',
		bgClass: 'bg-gradient-to-br from-yellow-500 to-orange-500',
		label: 'Достижение',
	},
	ANNOUNCEMENT: {
		icon: 'bi-megaphone-fill',
		bgClass: 'bg-gradient-to-br from-red-500 to-pink-500',
		label: 'Объявление',
	},
	SYSTEM: {
		icon: 'bi-shield-fill-check',
		bgClass: 'bg-gradient-to-br from-green-500 to-emerald-600',
		label: 'Система',
	},
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getDaysWord = (days: number): string => {
	const mod10 = days % 10;
	const mod100 = days % 100;
	if (mod10 === 1 && mod100 !== 11) return 'день';
	if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'дня';
	return 'дней';
};

export const groupNotificationsByDate = (notifications: NotificationItem[]): DateGroup[] => {
	const now = new Date();
	const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const groups: Map<string, NotificationItem[]> = new Map();

	for (const notif of notifications) {
		const date = new Date(notif.created_at);
		const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		const diffDays = Math.round((todayStart.getTime() - dateStart.getTime()) / (1000 * 60 * 60 * 24));

		const label =
			diffDays === 0 ? 'Сегодня' :
			diffDays === 1 ? 'Вчера' :
			`${diffDays} ${getDaysWord(diffDays)} назад`;

		if (!groups.has(label)) groups.set(label, []);
		groups.get(label)!.push(notif);
	}

	return Array.from(groups.entries()).map(([label, notifications]) => ({ label, notifications }));
};

export const formatNotificationTime = (isoString: string): string => {
	return new Date(isoString).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
};

// ─── API ─────────────────────────────────────────────────────────────────────

export const getNotifications = async (): Promise<NotificationsResponse | null> => {
	try {
		const res = await API.get("/v1/notifications");
		return res.data.status ? res.data.response : null;
	} catch {
		return null;
	}
};

export const getAnnouncementNotifications = async (): Promise<NotificationItem[]> => {
	const response = await getNotifications();
	if (!response) return [];
	return response.notifications.slice(0, 3);
};
