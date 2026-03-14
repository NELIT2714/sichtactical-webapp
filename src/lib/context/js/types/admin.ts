// ─── Admin Event ──────────────────────────────────────────────────────────────
export type AdminEventStatus = "upcoming" | "active" | "finished";

export type AdminEvent = {
	id_event: number;
	name: string;
	event_date: string;
	start_time: string;
	end_time: string;
	location: string;
	address: string;
	cost: string;
	members: number;
	max_members: number;
	status: AdminEventStatus;
	short_description: string;
};

export type AdminEventForm = {
	name: string;
	date: string;
	start_time: string;
	end_time: string;
	location: string;
	address: string;
	cost: string;
	max_members: string;
	short_description: string;
};

// ─── Admin User ───────────────────────────────────────────────────────────────
export type AdminUser = {
	id_user: number;
	name: string;
	call_sign: string | null;
	telegram: string;
	phone: string;
	games: number;
	xp: number;
	balance: string;
	is_admin: boolean;
	joined: string;
};

// ─── Admin Participant ────────────────────────────────────────────────────────
export type AdminParticipant = {
	id_user: number;
	name: string;
	call_sign: string | null;
	phone: string;
	telegram: string;
	games: number;
	registered_at: string;
	attended: boolean | null;
};

// ─── Admin Notification ───────────────────────────────────────────────────────
export type AdminNotifCategory = "EVENT" | "SIGNUP" | "ACHIEVEMENT" | "ANNOUNCEMENT" | "SYSTEM";

export type AdminNotification = {
	id_notification: number;
	category: AdminNotifCategory;
	title: string;
	description: string;
	sent_to: number;
	created_at: string;
};

export type AdminNotifForm = {
	category: AdminNotifCategory;
	title_ru: string;
	description_ru: string;
	title_pl: string;
	description_pl: string;
};

// ─── Admin Stats ──────────────────────────────────────────────────────────────
export type AdminStats = {
	totalUsers: number;
	activeUsers: number;
	totalEvents: number;
	upcomingEvents: number;
	totalGames: number;
	avgPlayers: number;
	totalRevenue: string;
	thisMonthRevenue: string;
};

export type AdminActivity = {
	icon: string;
	color: string;
	text: string;
	time: string;
};
