export type AdminEventStatus = "upcoming" | "active" | "finished";

export type AdminLocale = "ru" | "pl";

export type AdminEventLocation = {
	id_location?: number;
	name: string;
	address: string;
	google_maps?: string;
};

export type AdminEventData = {
	name: string;
	short_description: string;
	description: string;
};

export type AdminEventRule = {
	id_event_rule?: number;
	text: string;
	position: number;
};

export type AdminEventProgramItem = {
	id_event_program?: number;
	text: string;
	position: number;
};

export type AdminEvent = {
	id_event: number;
	name: string;
	event_date: string;
	start_time: string;
	end_time: string;
	location: AdminEventLocation;
	address: string;
	cost: string;
	members: number;
	max_members: number;
	status: AdminEventStatus;
	short_description: string;
	event_data?: Record<string, AdminEventData>;
	event_rules?: Record<string, AdminEventRule[]>;
	event_program?: Record<string, AdminEventProgramItem[]>;
	participants?: AdminParticipant[];
};

export type AdminEventMemberRaw = {
	id_event_member: number;
	full_name: string;
	call_sign: string | null;
	phone_number: string;
	registered: boolean;
	registration_timestamp: string;
	update_timestamp: string;
	equipment?: string | null;
	attended?: boolean | null;
};

export type AdminEventRaw = {
	id_event: number;
	event_date: string;
	start_time: string;
	end_time: string;
	max_members: number;
	members: number;
	cost: number;
	registered?: boolean;
	registration?: boolean;
	location?: {
		id_location?: number;
		name?: string;
		address?: string;
		google_maps?: string;
	} | null;
	event_data?: Record<string, AdminEventData>;
	event_rules?: Record<string, AdminEventRule[]>;
	event_program?: Record<string, AdminEventProgramItem[]>;
	event_members?: AdminEventMemberRaw[];
};

export type AdminEventsResponseRaw = {
	events: AdminEventRaw[];
	total_elements: number;
	total_pages: number;
	page: number;
	size: number;
};

export type AdminEventForm = {
	event_date: string;
	start_time: string;
	end_time: string;
	max_members: string;
	cost: string;
	location: AdminEventLocation;
	event_data: Record<string, AdminEventData>;
	event_rules: Record<string, AdminEventRule[]>;
	event_program: Record<string, AdminEventProgramItem[]>;
};

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

export type AdminParticipant = {
	id_event_member: number;
	name: string;
	call_sign: string | null;
	phone: string;
	telegram: string;
	games: number;
	registered_at: string;
	attended: boolean | null;
};

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
