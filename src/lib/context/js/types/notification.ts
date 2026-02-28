export type NotificationCategory = 'EVENT' | 'SIGNUP' | 'ACHIEVEMENT' | 'ANNOUNCEMENT' | 'SYSTEM';

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

export type DateGroup = {
	label: string;
	notifications: NotificationItem[];
};
