export type NotificationCategory = 'EVENT' | 'SIGNUP' | 'ACHIEVEMENT' | 'ANNOUNCEMENT' | 'SYSTEM' | 'BONUS';

export type NotificationLocalizedData = {
	title: string;
	description: string;
	content: string;
};

export type NotificationItem = {
	id_notification: number;
	category: NotificationCategory;
	created_at: string;
	updated_at: string | null;
	notification_data: Record<string, NotificationLocalizedData>;
};

export type NotificationsResponse = {
	notifications: NotificationItem[];
	total_elements: number;
	total_pages: number;
	page: number;
	size: number;
};

export type CategoryConfig = {
	icon: string;
	bgClass: string;
	label: string;
};

export const CATEGORY_CONFIG: Record<NotificationCategory, CategoryConfig> = {
	EVENT: {
		icon: 'bi-calendar-event-fill',
		bgClass: 'bg-blue-600',
		label: 'Событие',
	},
	SIGNUP: {
		icon: 'bi-person-check-fill',
		bgClass: 'bg-gradient-to-br from-cyan-500 to-blue-600',
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
	BONUS: {
		icon: 'bi-star-fill',
		bgClass: 'bg-gradient-to-br from-purple-500 to-indigo-600',
		label: 'Бонус',
	},
};

export type DateGroup = {
	label: string;
	notifications: NotificationItem[];
};

export function groupNotificationsByDate(notifications: NotificationItem[]): DateGroup[] {
	const now = new Date();
	const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const yesterdayStart = new Date(todayStart);
	yesterdayStart.setDate(yesterdayStart.getDate() - 1);

	const groups: Map<string, NotificationItem[]> = new Map();

	for (const notif of notifications) {
		const date = new Date(notif.created_at);
		const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());

		const diffMs = todayStart.getTime() - dateStart.getTime();
		const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

		let label: string;
		if (diffDays === 0) {
			label = 'Сегодня';
		} else if (diffDays === 1) {
			label = 'Вчера';
		} else {
			label = `${diffDays} ${getDaysWord(diffDays)} назад`;
		}

		if (!groups.has(label)) {
			groups.set(label, []);
		}
		groups.get(label)!.push(notif);
	}

	return Array.from(groups.entries()).map(([label, notifications]) => ({ label, notifications }));
}

function getDaysWord(days: number): string {
	const mod10 = days % 10;
	const mod100 = days % 100;
	if (mod10 === 1 && mod100 !== 11) return 'день';
	if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'дня';
	return 'дней';
}

export function formatNotificationTime(isoString: string): string {
	const date = new Date(isoString);
	return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}
