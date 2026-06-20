import type {
	AdminEvent,
	AdminEventRaw,
	AdminEventsResponseRaw,
	AdminEventForm,
	AdminEventLocation,
	AdminEventStatus,
	AdminLocale,
	AdminEventData,
	AdminEventRule,
	AdminEventProgramItem,
	AdminUser,
	AdminParticipant,
	AdminEventMemberRaw,
	AdminNotification,
	AdminNotifCategory,
	AdminNotifForm,
	AdminStats,
	AdminActivity,
} from "$lib/context/js/types/admin";
import { API } from "$lib/context/js/axios";

export type {
	AdminEvent,
	AdminEventForm,
	AdminEventLocation,
	AdminEventStatus,
	AdminUser,
	AdminParticipant,
	AdminNotification,
	AdminNotifCategory,
	AdminNotifForm,
	AdminStats,
	AdminActivity,
};

let eventMembersCache = new Map<number, AdminEventMemberRaw[]>();

const toTimeHM = (value: string | null | undefined) => {
	if (!value) return "";
	return value.length >= 5 ? value.slice(0, 5) : value;
};

const toCostString = (value: number | string | null | undefined) => {
	if (value === null || value === undefined) return "";
	const normalized = Number(value);
	if (!Number.isNaN(normalized)) {
		return Number.isInteger(normalized) ? String(normalized) : normalized.toFixed(2);
	}
	return String(value);
};

const toEventPayload = (form: AdminEventForm, idEvent?: number) => ({
	// payload matches backend DTO (JSON keys stay camel/mixed as in API contract)
	...(idEvent !== undefined ? { id_event: idEvent } : {}),
	event_date: form.event_date || null,
	start_time: form.start_time || null,
	end_time: form.end_time || null,
	max_members: form.max_members ? Number(form.max_members) : null,
	cost: form.cost ? Number(form.cost) : null,
	location: {
		id_location: form.location.id_location ?? null,
		name: form.location.name,
		address: form.location.address,
		google_maps: form.location.google_maps ?? null,
	},
	event_data: form.event_data,
	event_rules: form.event_rules,
	event_program: form.event_program,
});

const resolveEventStatus = (eventDate: string, startTime: string, endTime: string): AdminEventStatus => {
	const now = new Date();
	const start = new Date(`${eventDate}T${startTime || "00:00:00"}`);
	const end = new Date(`${eventDate}T${endTime || "23:59:59"}`);

	if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
		if (now >= start && now <= end) return "active";
		if (now > end) return "finished";
	}

	return "upcoming";
};

type CivilDateTime = {
	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
	second: number;
};

const getWarsawCivilDateTime = (date = new Date()): CivilDateTime => {
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Europe/Warsaw",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	}).formatToParts(date);

	const pick = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value ?? 0);

	return {
		year: pick("year"),
		month: pick("month"),
		day: pick("day"),
		hour: pick("hour"),
		minute: pick("minute"),
		second: pick("second"),
	};
};

const parseCivilDateTime = (dateStr: string, timeStr: string): CivilDateTime | null => {
	const [year, month, day] = dateStr.split("-").map(Number);
	const [hour, minute, second = 0] = timeStr.split(":").map(Number);

	if ([year, month, day, hour, minute, second].some((value) => Number.isNaN(value))) {
		return null;
	}

	return { year, month, day, hour, minute, second };
};

const civilDateTimeToMs = (value: CivilDateTime) => Date.UTC(value.year, value.month - 1, value.day, value.hour, value.minute, value.second);

export const isAttendanceEditable = (eventDate: string, startTime: string, now = new Date()): boolean => {
	const start = parseCivilDateTime(eventDate, startTime || "00:00:00");
	if (!start) return false;

	const windowStart = civilDateTimeToMs(start) - 30 * 60 * 1000;
	const windowEnd = civilDateTimeToMs({ ...start, hour: 23, minute: 59, second: 59 });
	const current = civilDateTimeToMs(getWarsawCivilDateTime(now));

	return current >= windowStart && current <= windowEnd;
};

const mapMemberToParticipant = (member: AdminEventMemberRaw): AdminParticipant => ({
	id_event_member: member.id_event_member,
	name: member.full_name,
	call_sign: member.call_sign,
	phone: member.phone_number,
	telegram: "—",
	games: 0,
	registered_at: member.registration_timestamp,
	attended: member.attended ?? null,
});

const mapRawEventToAdminEvent = (event: AdminEventRaw): AdminEvent => {
	const ruData = event.event_data?.ru;
	const participants = (event.event_members ?? []).map(mapMemberToParticipant);
	const location = event.location ?? null;

	return {
		id_event: event.id_event,
		name: ruData?.name ?? `Event #${event.id_event}`,
		event_date: event.event_date,
		start_time: toTimeHM(event.start_time),
		end_time: toTimeHM(event.end_time),
		location: location
			? {
				id_location: location.id_location,
				name: location.name ?? "",
				address: location.address ?? "",
				google_maps: location.google_maps ?? "",
			}
			: { name: "", address: "", google_maps: "" },
		address: location?.address ?? "",
		cost: toCostString(event.cost),
		members: event.members ?? participants.length,
		max_members: event.max_members,
		status: resolveEventStatus(event.event_date, event.start_time, event.end_time),
		short_description: ruData?.short_description ?? "",
		event_data: event.event_data,
		event_rules: event.event_rules,
		event_program: event.event_program,
		participants,
	};
};

// ─── Mock data (replace with API calls) ──────────────────────────────────────
export const MOCK_STATS: AdminStats = {
	totalUsers: 247,
	activeUsers: 183,
	totalEvents: 32,
	upcomingEvents: 4,
	totalGames: 28,
	avgPlayers: 18,
	totalRevenue: "8 540 zł",
	thisMonthRevenue: "1 280 zł",
};

export const MOCK_EVENTS: AdminEvent[] = [
	{ id_event: 1, name: "Assault #12", event_date: "2026-03-10", start_time: "10:00", end_time: "18:00", location: { name: "Polygon Wschód", address: "", google_maps: "" }, address: "", cost: "120 zł", members: 18, max_members: 20, status: "upcoming", short_description: "" },
	{ id_event: 2, name: "Night Raid #5", event_date: "2026-03-17", start_time: "20:00", end_time: "02:00", location: { name: "Polygon Zachód", address: "", google_maps: "" }, address: "", cost: "100 zł", members: 12, max_members: 20, status: "upcoming", short_description: "" },
	{ id_event: 3, name: "CQB Training", event_date: "2026-03-24", start_time: "09:00", end_time: "16:00", location: { name: "CQB Arena", address: "", google_maps: "" }, address: "", cost: "90 zł", members: 8, max_members: 15, status: "upcoming", short_description: "" },
	{ id_event: 4, name: "Urban Ops #3", event_date: "2026-03-31", start_time: "10:00", end_time: "17:00", location: { name: "Industrial Zone", address: "", google_maps: "" }, address: "", cost: "110 zł", members: 0, max_members: 18, status: "upcoming", short_description: "" },
	{ id_event: 5, name: "Assault #11", event_date: "2026-02-15", start_time: "10:00", end_time: "18:00", location: { name: "Polygon Wschód", address: "", google_maps: "" }, address: "", cost: "120 zł", members: 20, max_members: 20, status: "finished", short_description: "" },
	{ id_event: 6, name: "Winter Raid", event_date: "2026-01-20", start_time: "10:00", end_time: "16:00", location: { name: "Forest Zone", address: "", google_maps: "" }, address: "", cost: "100 zł", members: 15, max_members: 16, status: "finished", short_description: "" },
];

export const MOCK_USERS: AdminUser[] = [
	{ id_user: 1, name: "Aleksander Kowalski", call_sign: "Wolf", telegram: "@wolf_ak", phone: "+48 600 111 222", games: 12, xp: 1450, balance: "80 zł", is_admin: true, joined: "2025-09-14" },
	{ id_user: 2, name: "Dmytro Marchenko", call_sign: "Ghost", telegram: "@ghost_dm", phone: "+48 601 333 444", games: 7, xp: 820, balance: "0 zł", is_admin: false, joined: "2025-10-03" },
	{ id_user: 3, name: "Ivan Petrenko", call_sign: null, telegram: "@ivan_p", phone: "+48 602 555 666", games: 3, xp: 340, balance: "40 zł", is_admin: false, joined: "2025-11-22" },
	{ id_user: 4, name: "Marcin Wiśniewski", call_sign: "Eagle", telegram: "@eagle_mw", phone: "+48 603 777 888", games: 19, xp: 2210, balance: "120 zł", is_admin: false, joined: "2025-08-01" },
	{ id_user: 5, name: "Oleg Bondarenko", call_sign: "Steel", telegram: "@steel_ob", phone: "+48 604 999 000", games: 5, xp: 590, balance: "20 zł", is_admin: false, joined: "2025-12-10" },
	{ id_user: 6, name: "Piotr Nowak", call_sign: "Fox", telegram: "@fox_pn", phone: "+48 605 111 222", games: 8, xp: 970, balance: "60 zł", is_admin: false, joined: "2025-10-17" },
];

export const MOCK_PARTICIPANTS: AdminParticipant[] = [
	{ id_event_member: 1, name: "Aleksander Kowalski", call_sign: "Wolf", phone: "+48 600 111 222", telegram: "@wolf_ak", games: 12, registered_at: "2026-03-01 14:22", attended: true },
	{ id_event_member: 2, name: "Dmytro Marchenko", call_sign: "Ghost", phone: "+48 601 333 444", telegram: "@ghost_dm", games: 7, registered_at: "2026-03-01 15:40", attended: false },
	{ id_event_member: 3, name: "Ivan Petrenko", call_sign: null, phone: "+48 602 555 666", telegram: "@ivan_p", games: 3, registered_at: "2026-03-02 09:12", attended: null },
	{ id_event_member: 4, name: "Marcin Wiśniewski", call_sign: "Eagle", phone: "+48 603 777 888", telegram: "@eagle_mw", games: 19, registered_at: "2026-03-02 11:05", attended: true },
	{ id_event_member: 5, name: "Oleg Bondarenko", call_sign: "Steel", phone: "+48 604 999 000", telegram: "@steel_ob", games: 5, registered_at: "2026-03-03 18:30", attended: null },
];

export const MOCK_NOTIFICATIONS: AdminNotification[] = [
	{ id_notification: 1, category: "ANNOUNCEMENT", title: "Новые правила площадки", description: "С 1 апреля вводятся обновлённые правила безопасности на полигоне.", sent_to: 247, created_at: "2026-03-01 10:00" },
	{ id_notification: 2, category: "EVENT", title: "Регистрация открыта: Assault #12", description: "Открыта запись на игру 10 марта. Мест ограниченное количество!", sent_to: 247, created_at: "2026-02-25 12:00" },
	{ id_notification: 3, category: "SYSTEM", title: "Плановое обслуживание", description: "Приложение будет недоступно 5 марта с 02:00 до 04:00.", sent_to: 247, created_at: "2026-02-24 09:00" },
	{ id_notification: 4, category: "ACHIEVEMENT", title: "Достижения обновлены", description: "Добавлены новые ачивменты за серии игр.", sent_to: 183, created_at: "2026-02-20 16:30" },
];

// ─── API functions (ready for real backend) ───────────────────────────────────
export const adminGetStats = async (): Promise<AdminStats | null> => {
	try {
		// const res = await API.get("/v1/admin/stats");
		// return res.data.status ? res.data.response : null;
		return MOCK_STATS;
	} catch {
		return null;
	}
};

export const adminGetEvents = async (): Promise<AdminEvent[]> => {
	try {
		const res = await API.get<{ status: boolean; response: AdminEventsResponseRaw }>("/v1/admin/events");
		if (!res.data?.status) return [];

		const rawEvents = res.data.response?.events ?? [];
		eventMembersCache = new Map(rawEvents.map((event) => [event.id_event, event.event_members ?? []]));

		return rawEvents.map(mapRawEventToAdminEvent);
	} catch {
		return MOCK_EVENTS;
	}
};

export const adminCreateEvent = async (form: AdminEventForm): Promise<boolean> => {
	try {
		const res = await API.post<{ status: boolean; response?: { event_id?: number } }>("/v1/admin/events", toEventPayload(form));
		return !!res.data?.status;
	} catch {
		return false;
	}
};

export const adminUpdateEvent = async (id: number, form: AdminEventForm): Promise<boolean> => {
	try {
		const res = await API.post<{ status: boolean }>("/v1/admin/events", toEventPayload(form, id));
		return !!res.data?.status;
	} catch {
		return false;
	}
};

export const adminDeleteEvent = async (id: number): Promise<boolean> => {
	try {
		await API.delete(`/v1/admin/events/${id}`);
		return true;
	} catch {
		return false;
	}
};

export const adminGetParticipants = async (eventId: number): Promise<AdminParticipant[]> => {
	try {
		const cachedMembers = eventMembersCache.get(eventId);
		if (cachedMembers && cachedMembers.length > 0) {
			return cachedMembers.map(mapMemberToParticipant);
		}

		const res = await API.get<{ status: boolean; response: { event_members?: AdminEventMemberRaw[] } | AdminEventMemberRaw[] }>(`/v1/admin/events/${eventId}/participants`);
		if (!res.data?.status) return [];

		const response = res.data.response;
		const members = Array.isArray(response) ? response : (response.event_members ?? []);
		return members.map(mapMemberToParticipant);
	} catch {
		return MOCK_PARTICIPANTS;
	}
};

export const adminSetAttendance = async (eventId: number, eventMemberId: number, attended: boolean): Promise<boolean> => {
	try {
		const res = await API.post<{ status: boolean }>(`/v1/admin/events/${eventId}/attendance`, {
			id_event_member: eventMemberId,
			attended,
		});
		if (!res.data?.status) return false;

		const cachedMembers = eventMembersCache.get(eventId);
		if (cachedMembers) {
			eventMembersCache.set(
				eventId,
				cachedMembers.map((member) => member.id_event_member === eventMemberId ? { ...member, registered: attended } : member)
			);
		}

		return true;
	} catch {
		return false;
	}
};

export const adminGetUsers = async (): Promise<AdminUser[]> => {
	try {
		// const res = await API.get("/v1/admin/users");
		// return res.data.status ? res.data.response : [];
		return MOCK_USERS;
	} catch {
		return [];
	}
};

export const adminSetAdmin = async (userId: number, isAdmin: boolean): Promise<boolean> => {
	try {
		// const res = await API.patch(`/v1/admin/users/${userId}/role`, { is_admin: isAdmin });
		// return res.data.status;
		console.log("adminSetAdmin", userId, isAdmin);
		return true;
	} catch {
		return false;
	}
};

export const adminBanUser = async (userId: number): Promise<boolean> => {
	try {
		// const res = await API.post(`/v1/admin/users/${userId}/ban`);
		// return res.data.status;
		console.log("adminBanUser", userId);
		return true;
	} catch {
		return false;
	}
};

export const adminGetNotifications = async (): Promise<AdminNotification[]> => {
	try {
		// const res = await API.get("/v1/admin/notifications");
		// return res.data.status ? res.data.response : [];
		return MOCK_NOTIFICATIONS;
	} catch {
		return [];
	}
};

export const adminCreateNotification = async (form: AdminNotifForm): Promise<boolean> => {
	try {
		// const res = await API.post("/v1/admin/notifications", form);
		// return res.data.status;
		console.log("adminCreateNotification", form);
		return true;
	} catch {
		return false;
	}
};

export const adminDeleteNotification = async (id: number): Promise<boolean> => {
	try {
		// const res = await API.delete(`/v1/admin/notifications/${id}`);
		// return res.data.status;
		console.log("adminDeleteNotification", id);
		return true;
	} catch {
		return false;
	}
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function exportParticipantsCSV(eventName: string, participants: AdminParticipant[]) {
	const header = "Имя,Позывной,Телефон,Telegram,Игр,Дата записи";
	const rows = participants.map(p =>
		[p.name, p.call_sign ?? "—", p.phone, p.telegram, p.games, p.registered_at].join(",")
	);
	const csv = [header, ...rows].join("\n");
	const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${eventName.replace(/\s+/g, "_")}_participants.csv`;
	a.click();
	URL.revokeObjectURL(url);
}

export function slotStatus(members: number, max: number): "available" | "few" | "full" {
	const p = (members / max) * 100;
	return p >= 100 ? "full" : p >= 70 ? "few" : "available";
}

export function createEmptyEventForm(locales: AdminLocale[]): AdminEventForm {
	const eventData = Object.fromEntries(
		locales.map((locale) => [locale, { name: "", short_description: "", description: "" }])
	) as Record<string, AdminEventData>;

	const eventRules = Object.fromEntries(
		locales.map((locale) => [locale, []])
	) as Record<string, AdminEventRule[]>;

	const eventProgram = Object.fromEntries(
		locales.map((locale) => [locale, []])
	) as Record<string, AdminEventProgramItem[]>;

	return {
		event_date: "",
		start_time: "",
		end_time: "",
		max_members: "",
		cost: "",
		location: {
			id_location: undefined,
			name: "",
			address: "",
			google_maps: "",
		},
		event_data: eventData,
		event_rules: eventRules,
		event_program: eventProgram,
	};
}

export function mapEventToForm(event: AdminEvent, locales: AdminLocale[]): AdminEventForm {
	const initial = createEmptyEventForm(locales);
	const location = {
		id_location: event.location.id_location,
		name: event.location.name ?? "",
		address: event.location.address ?? event.address ?? "",
		google_maps: event.location.google_maps ?? "",
	};

	const eventData = locales.reduce((acc, locale) => {
		acc[locale] = {
			name: event.event_data?.[locale]?.name ?? (locale === "ru" ? event.name : ""),
			short_description: event.event_data?.[locale]?.short_description ?? (locale === "ru" ? event.short_description : ""),
			description: event.event_data?.[locale]?.description ?? "",
		};
		return acc;
	}, {} as Record<string, AdminEventData>);

	const eventRules = locales.reduce((acc, locale) => {
		acc[locale] = (event.event_rules?.[locale] ?? []).map((rule, index) => ({
			...rule,
			text: rule.text ?? "",
			position: index + 1,
		}));
		return acc;
	}, {} as Record<string, AdminEventRule[]>);

	const eventProgram = locales.reduce((acc, locale) => {
		acc[locale] = (event.event_program?.[locale] ?? []).map((item, index) => ({
			...item,
			text: item.text ?? "",
			position: index + 1,
		}));
		return acc;
	}, {} as Record<string, AdminEventProgramItem[]>);

	return {
		...initial,
		event_date: event.event_date ?? "",
		start_time: event.start_time ?? "",
		end_time: event.end_time ?? "",
		max_members: String(event.max_members ?? ""),
		cost: String(event.cost ?? ""),
		location,
		event_data: eventData,
		event_rules: eventRules,
		event_program: eventProgram,
	};
}

