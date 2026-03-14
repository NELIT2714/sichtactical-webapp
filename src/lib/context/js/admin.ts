import type {
	AdminEvent,
	AdminEventForm,
	AdminEventStatus,
	AdminUser,
	AdminParticipant,
	AdminNotification,
	AdminNotifCategory,
	AdminNotifForm,
	AdminStats,
	AdminActivity,
} from "$lib/context/js/types/admin";

export type {
	AdminEvent,
	AdminEventForm,
	AdminEventStatus,
	AdminUser,
	AdminParticipant,
	AdminNotification,
	AdminNotifCategory,
	AdminNotifForm,
	AdminStats,
	AdminActivity,
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

export const MOCK_ACTIVITY: AdminActivity[] = [
	{ icon: "bi-person-plus-fill", color: "bg-blue-600", text: "Новый пользователь: Aleksander K.", time: "5 мин назад" },
	{ icon: "bi-calendar-check-fill", color: "bg-green-600", text: "Запись на ивент «Assault #12»", time: "12 мин назад" },
	{ icon: "bi-megaphone-fill", color: "bg-gradient-to-br from-red-500 to-pink-500", text: "Отправлено объявление «Новые правила»", time: "1 ч назад" },
	{ icon: "bi-calendar-plus-fill", color: "bg-indigo-600", text: "Создан ивент «Night Raid #5»", time: "3 ч назад" },
	{ icon: "bi-person-x-fill", color: "bg-red-600", text: "Отмена записи: Dmytro M.", time: "4 ч назад" },
];

export const MOCK_EVENTS: AdminEvent[] = [
	{ id_event: 1, name: "Assault #12", event_date: "2026-03-10", start_time: "10:00", end_time: "18:00", location: "Polygon Wschód", address: "", cost: "120 zł", members: 18, max_members: 20, status: "upcoming", short_description: "" },
	{ id_event: 2, name: "Night Raid #5", event_date: "2026-03-17", start_time: "20:00", end_time: "02:00", location: "Polygon Zachód", address: "", cost: "100 zł", members: 12, max_members: 20, status: "upcoming", short_description: "" },
	{ id_event: 3, name: "CQB Training", event_date: "2026-03-24", start_time: "09:00", end_time: "16:00", location: "CQB Arena", address: "", cost: "90 zł", members: 8, max_members: 15, status: "upcoming", short_description: "" },
	{ id_event: 4, name: "Urban Ops #3", event_date: "2026-03-31", start_time: "10:00", end_time: "17:00", location: "Industrial Zone", address: "", cost: "110 zł", members: 0, max_members: 18, status: "upcoming", short_description: "" },
	{ id_event: 5, name: "Assault #11", event_date: "2026-02-15", start_time: "10:00", end_time: "18:00", location: "Polygon Wschód", address: "", cost: "120 zł", members: 20, max_members: 20, status: "finished", short_description: "" },
	{ id_event: 6, name: "Winter Raid", event_date: "2026-01-20", start_time: "10:00", end_time: "16:00", location: "Forest Zone", address: "", cost: "100 zł", members: 15, max_members: 16, status: "finished", short_description: "" },
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
	{ id_user: 1, name: "Aleksander Kowalski", call_sign: "Wolf", phone: "+48 600 111 222", telegram: "@wolf_ak", games: 12, registered_at: "2026-03-01 14:22", attended: true },
	{ id_user: 2, name: "Dmytro Marchenko", call_sign: "Ghost", phone: "+48 601 333 444", telegram: "@ghost_dm", games: 7, registered_at: "2026-03-01 15:40", attended: false },
	{ id_user: 3, name: "Ivan Petrenko", call_sign: null, phone: "+48 602 555 666", telegram: "@ivan_p", games: 3, registered_at: "2026-03-02 09:12", attended: null },
	{ id_user: 4, name: "Marcin Wiśniewski", call_sign: "Eagle", phone: "+48 603 777 888", telegram: "@eagle_mw", games: 19, registered_at: "2026-03-02 11:05", attended: true },
	{ id_user: 5, name: "Oleg Bondarenko", call_sign: "Steel", phone: "+48 604 999 000", telegram: "@steel_ob", games: 5, registered_at: "2026-03-03 18:30", attended: null },
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

export const adminGetActivity = async (): Promise<AdminActivity[]> => {
	try {
		// const res = await API.get("/v1/admin/activity");
		// return res.data.status ? res.data.response : [];
		return MOCK_ACTIVITY;
	} catch {
		return [];
	}
};

export const adminGetEvents = async (): Promise<AdminEvent[]> => {
	try {
		// const res = await API.get("/v1/admin/events");
		// return res.data.status ? res.data.response : [];
		return MOCK_EVENTS;
	} catch {
		return [];
	}
};

export const adminCreateEvent = async (form: AdminEventForm): Promise<boolean> => {
	try {
		// const res = await API.post("/v1/admin/events", form);
		// return res.data.status;
		console.log("adminCreateEvent", form);
		return true;
	} catch {
		return false;
	}
};

export const adminUpdateEvent = async (id: number, form: AdminEventForm): Promise<boolean> => {
	try {
		// const res = await API.put(`/v1/admin/events/${id}`, form);
		// return res.data.status;
		console.log("adminUpdateEvent", id, form);
		return true;
	} catch {
		return false;
	}
};

export const adminDeleteEvent = async (id: number): Promise<boolean> => {
	try {
		// const res = await API.delete(`/v1/admin/events/${id}`);
		// return res.data.status;
		console.log("adminDeleteEvent", id);
		return true;
	} catch {
		return false;
	}
};

export const adminGetParticipants = async (_eventId: number): Promise<AdminParticipant[]> => {
	try {
		// const res = await API.get(`/v1/admin/events/${_eventId}/participants`);
		// return res.data.status ? res.data.response : [];
		return MOCK_PARTICIPANTS;
	} catch {
		return [];
	}
};

export const adminSetAttendance = async (_eventId: number, _userId: number, attended: boolean): Promise<boolean> => {
	try {
		// const res = await API.patch(`/v1/admin/events/${_eventId}/participants/${_userId}/attendance`, { attended });
		// return res.data.status;
		console.log("adminSetAttendance", _eventId, _userId, attended);
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
