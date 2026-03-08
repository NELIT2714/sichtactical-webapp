<script lang="ts">
	import "bootstrap-icons/font/bootstrap-icons.css";
	import { fade, slide } from "svelte/transition";
	import { CATEGORY_CONFIG } from "$lib/context/js/notifications";

	// ─── Active Tab ───────────────────────────────────────────────────────────
	type Tab = "stats" | "events" | "users" | "notifications";
	let activeTab: Tab = "stats";

	// ─── Stats mock data ──────────────────────────────────────────────────────
	const stats = {
		totalUsers: 247,
		activeUsers: 183,
		totalEvents: 32,
		upcomingEvents: 4,
		totalGames: 28,
		avgPlayers: 18,
		totalRevenue: "8 540 zł",
		thisMonthRevenue: "1 280 zł",
	};

	const recentActivity = [
		{ icon: "bi-person-plus-fill", color: "bg-blue-600", text: "Новый пользователь: Aleksander K.", time: "5 мин назад" },
		{ icon: "bi-calendar-check-fill", color: "bg-green-600", text: "Запись на ивент «Assault #12»", time: "12 мин назад" },
		{ icon: "bi-megaphone-fill", color: "bg-gradient-to-br from-red-500 to-pink-500", text: "Отправлено объявление «Новые правила»", time: "1 ч назад" },
		{ icon: "bi-calendar-plus-fill", color: "bg-indigo-600", text: "Создан ивент «Night Raid #5»", time: "3 ч назад" },
		{ icon: "bi-person-x-fill", color: "bg-red-600", text: "Отмена записи: Dmytro M.", time: "4 ч назад" },
	];

	// ─── Events mock data ─────────────────────────────────────────────────────
	type EventStatus = "upcoming" | "active" | "finished";
	type MockEvent = {
		id: number;
		name: string;
		date: string;
		time: string;
		location: string;
		cost: string;
		members: number;
		max_members: number;
		status: EventStatus;
	};

	const mockEvents: MockEvent[] = [
		{ id: 1, name: "Assault #12", date: "2026-03-10", time: "10:00 - 18:00", location: "Polygon Wschód", cost: "120 zł", members: 18, max_members: 20, status: "upcoming" },
		{ id: 2, name: "Night Raid #5", date: "2026-03-17", time: "20:00 - 02:00", location: "Polygon Zachód", cost: "100 zł", members: 12, max_members: 20, status: "upcoming" },
		{ id: 3, name: "CQB Training", date: "2026-03-24", time: "09:00 - 16:00", location: "CQB Arena", cost: "90 zł", members: 8, max_members: 15, status: "upcoming" },
		{ id: 4, name: "Urban Ops #3", date: "2026-03-31", time: "10:00 - 17:00", location: "Industrial Zone", cost: "110 zł", members: 0, max_members: 18, status: "upcoming" },
		{ id: 5, name: "Assault #11", date: "2026-02-15", time: "10:00 - 18:00", location: "Polygon Wschód", cost: "120 zł", members: 20, max_members: 20, status: "finished" },
		{ id: 6, name: "Winter Raid", date: "2026-01-20", time: "10:00 - 16:00", location: "Forest Zone", cost: "100 zł", members: 15, max_members: 16, status: "finished" },
	];

	let eventFilter: "all" | EventStatus = "all";
	$: filteredEvents = eventFilter === "all" ? mockEvents : mockEvents.filter(e => e.status === eventFilter);

	// Event form modal
	let showEventModal = false;
	let eventModalMode: "create" | "edit" = "create";
	let editingEvent: MockEvent | null = null;

	type EventForm = {
		name: string; date: string; start_time: string; end_time: string;
		location: string; address: string; cost: string; max_members: string; short_description: string;
	};

	let eventForm: EventForm = { name: "", date: "", start_time: "", end_time: "", location: "", address: "", cost: "", max_members: "", short_description: "" };

	function openCreateEvent() {
		eventModalMode = "create";
		editingEvent = null;
		eventForm = { name: "", date: "", start_time: "", end_time: "", location: "", address: "", cost: "", max_members: "", short_description: "" };
		showEventModal = true;
	}

	function openEditEvent(ev: MockEvent) {
		eventModalMode = "edit";
		editingEvent = ev;
		const [start, end] = ev.time.split(" - ");
		eventForm = { name: ev.name, date: ev.date, start_time: start, end_time: end, location: ev.location, address: "", cost: ev.cost.replace(" zł", ""), max_members: String(ev.max_members), short_description: "" };
		showEventModal = true;
	}

	// Event participants modal
	let showParticipantsModal = false;
	let selectedEvent: MockEvent | null = null;

	type Participant = { id: number; name: string; call_sign: string | null; phone: string; telegram: string; games: number; registered_at: string };
	const mockParticipants: Participant[] = [
		{ id: 1, name: "Aleksander Kowalski", call_sign: "Wolf", phone: "+48 600 111 222", telegram: "@wolf_ak", games: 12, registered_at: "2026-03-01 14:22" },
		{ id: 2, name: "Dmytro Marchenko", call_sign: "Ghost", phone: "+48 601 333 444", telegram: "@ghost_dm", games: 7, registered_at: "2026-03-01 15:40" },
		{ id: 3, name: "Ivan Petrenko", call_sign: null, phone: "+48 602 555 666", telegram: "@ivan_p", games: 3, registered_at: "2026-03-02 09:12" },
		{ id: 4, name: "Marcin Wiśniewski", call_sign: "Eagle", phone: "+48 603 777 888", telegram: "@eagle_mw", games: 19, registered_at: "2026-03-02 11:05" },
		{ id: 5, name: "Oleg Bondarenko", call_sign: "Steel", phone: "+48 604 999 000", telegram: "@steel_ob", games: 5, registered_at: "2026-03-03 18:30" },
	];

	function openParticipants(ev: MockEvent) { selectedEvent = ev; showParticipantsModal = true; }

	function exportCSV(ev: MockEvent | null, participants: Participant[]) {
		if (!ev) return;
		const header = "Имя,Позывной,Телефон,Telegram,Игр,Дата записи";
		const rows = participants.map(p => [p.name, p.call_sign ?? "—", p.phone, p.telegram, p.games, p.registered_at].join(","));
		const csv = [header, ...rows].join("\n");
		const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${ev.name.replace(/\s+/g, "_")}_participants.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}

	// Delete event confirmation
	let showDeleteEventModal = false;
	let deletingEvent: MockEvent | null = null;
	function confirmDeleteEvent(ev: MockEvent) { deletingEvent = ev; showDeleteEventModal = true; }

	// ─── Users mock data ──────────────────────────────────────────────────────
	type MockUser = {
		id: number; name: string; call_sign: string | null; telegram: string;
		phone: string; games: number; xp: number; balance: string; is_admin: boolean; joined: string;
	};

	const mockUsers: MockUser[] = [
		{ id: 1, name: "Aleksander Kowalski", call_sign: "Wolf", telegram: "@wolf_ak", phone: "+48 600 111 222", games: 12, xp: 1450, balance: "80 zł", is_admin: true, joined: "2025-09-14" },
		{ id: 2, name: "Dmytro Marchenko", call_sign: "Ghost", telegram: "@ghost_dm", phone: "+48 601 333 444", games: 7, xp: 820, balance: "0 zł", is_admin: false, joined: "2025-10-03" },
		{ id: 3, name: "Ivan Petrenko", call_sign: null, telegram: "@ivan_p", phone: "+48 602 555 666", games: 3, xp: 340, balance: "40 zł", is_admin: false, joined: "2025-11-22" },
		{ id: 4, name: "Marcin Wiśniewski", call_sign: "Eagle", telegram: "@eagle_mw", phone: "+48 603 777 888", games: 19, xp: 2210, balance: "120 zł", is_admin: false, joined: "2025-08-01" },
		{ id: 5, name: "Oleg Bondarenko", call_sign: "Steel", telegram: "@steel_ob", phone: "+48 604 999 000", games: 5, xp: 590, balance: "20 zł", is_admin: false, joined: "2025-12-10" },
		{ id: 6, name: "Piotr Nowak", call_sign: "Fox", telegram: "@fox_pn", phone: "+48 605 111 222", games: 8, xp: 970, balance: "60 zł", is_admin: false, joined: "2025-10-17" },
	];

	let userSearch = "";
	$: filteredUsers = mockUsers.filter(u =>
		u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
		(u.call_sign ?? "").toLowerCase().includes(userSearch.toLowerCase()) ||
		u.telegram.toLowerCase().includes(userSearch.toLowerCase())
	);

	let showUserModal = false;
	let selectedUser: MockUser | null = null;
	function openUserDetail(u: MockUser) { selectedUser = u; showUserModal = true; }

	// ─── Notifications mock data ──────────────────────────────────────────────
	type NotifCategory = "EVENT" | "SIGNUP" | "ACHIEVEMENT" | "ANNOUNCEMENT" | "SYSTEM";
	type MockNotification = { id: number; category: NotifCategory; title: string; description: string; sent_to: number; created_at: string; };

	const mockNotifications: MockNotification[] = [
		{ id: 1, category: "ANNOUNCEMENT", title: "Новые правила площадки", description: "С 1 апреля вводятся обновлённые правила безопасности на полигоне.", sent_to: 247, created_at: "2026-03-01 10:00" },
		{ id: 2, category: "EVENT", title: "Регистрация открыта: Assault #12", description: "Открыта запись на игру 10 марта. Мест ограниченное количество!", sent_to: 247, created_at: "2026-02-25 12:00" },
		{ id: 3, category: "SYSTEM", title: "Плановое обслуживание", description: "Приложение будет недоступно 5 марта с 02:00 до 04:00.", sent_to: 247, created_at: "2026-02-24 09:00" },
		{ id: 4, category: "ACHIEVEMENT", title: "Достижения обновлены", description: "Добавлены новые ачивменты за серии игр.", sent_to: 183, created_at: "2026-02-20 16:30" },
	];

	let showNotifModal = false;
	let notifForm = { category: "ANNOUNCEMENT" as NotifCategory, title_ru: "", description_ru: "", title_pl: "", description_pl: "" };
	function openCreateNotif() { notifForm = { category: "ANNOUNCEMENT", title_ru: "", description_ru: "", title_pl: "", description_pl: "" }; showNotifModal = true; }

	let showDeleteNotifModal = false;
	let deletingNotif: MockNotification | null = null;
	function confirmDeleteNotif(n: MockNotification) { deletingNotif = n; showDeleteNotifModal = true; }

	const categoryLabels: Record<NotifCategory, string> = {
		EVENT: "Событие", SIGNUP: "Запись", ACHIEVEMENT: "Достижение", ANNOUNCEMENT: "Объявление", SYSTEM: "Система",
	};

	// ─── Helpers ──────────────────────────────────────────────────────────────
	function slotStatus(members: number, max: number): "available" | "few" | "full" {
		const p = (members / max) * 100;
		return p >= 100 ? "full" : p >= 70 ? "few" : "available";
	}

	const statusLabel: Record<EventStatus, string> = { upcoming: "Предстоит", active: "Активен", finished: "Завершён" };
	const statusClass: Record<EventStatus, string> = {
		upcoming: "bg-blue-500/15 text-blue-400 border-blue-500/30",
		active: "bg-green-500/15 text-green-400 border-green-500/30",
		finished: "bg-white/5 text-white/40 border-white/10",
	};

	const tabs: { id: Tab; icon: string; label: string }[] = [
		{ id: "stats", icon: "bi-bar-chart-line-fill", label: "Статистика" },
		{ id: "events", icon: "bi-calendar3", label: "Ивенты" },
		{ id: "users", icon: "bi-people-fill", label: "Юзеры" },
		{ id: "notifications", icon: "bi-megaphone-fill", label: "Нотиф." },
	];

	const filterOptions: { val: "all" | EventStatus; label: string }[] = [
		{ val: "all", label: "Все" },
		{ val: "upcoming", label: "Предстоит" },
		{ val: "finished", label: "Завершён" },
	];

	const categoryEntries: { cat: NotifCategory; lbl: string; icon: string; bgClass: string }[] = Object.entries(categoryLabels).map(([cat, lbl]) => ({
		cat: cat as NotifCategory,
		lbl,
		icon: CATEGORY_CONFIG[cat as NotifCategory].icon,
		bgClass: CATEGORY_CONFIG[cat as NotifCategory].bgClass,
	}));
</script>

<!-- ════════════════════ HEADER ════════════════════════════════════════════ -->
<header class="md:container md:mx-auto bg-[#1a1a2e] px-5 py-4 border-b border-white/5 sticky top-0 z-40">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-lg font-bold uppercase tracking-wide">Sich Tactical</h1>
			<p class="text-[11px] text-white/40 uppercase tracking-widest">Admin Panel</p>
		</div>
		<div class="w-9 h-9 bg-red-500/15 border border-red-500/25 rounded-full flex items-center justify-center">
			<i class="bi bi-shield-fill-exclamation text-red-400 text-base"></i>
		</div>
	</div>
	<!-- Tabs -->
	<div class="flex gap-1 mt-4 bg-white/[0.04] rounded-xl p-1">
		{#each tabs as tab}
			<button on:click={() => (activeTab = tab.id)}
				class="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-lg text-[10px] font-semibold transition-all duration-200 cursor-pointer
					{activeTab === tab.id ? 'bg-[#0a0a0f] text-white shadow-md' : 'text-white/40 hover:text-white/60'}">
				<i class="bi {tab.icon} text-sm leading-none"></i>
				{tab.label}
			</button>
		{/each}
	</div>
</header>

<main class="md:container md:mx-auto pb-6">

<!-- ════════════════════ TAB: STATS ════════════════════════════════════════ -->
{#if activeTab === "stats"}
<div class="px-4 pt-4 flex flex-col gap-4" transition:fade={{ duration: 180 }}>
	<div class="grid grid-cols-2 gap-3">
		<div class="bg-[#1a1a2e] rounded-2xl p-4 border border-blue-500/15 flex flex-col gap-1">
			<div class="text-[11px] text-white/40 uppercase tracking-wide">Всего юзеров</div>
			<div class="text-3xl font-bold text-white">{stats.totalUsers}</div>
			<div class="text-xs text-blue-400 flex items-center gap-1"><i class="bi bi-arrow-up-right"></i>+12 за месяц</div>
		</div>
		<div class="bg-[#1a1a2e] rounded-2xl p-4 border border-green-500/15 flex flex-col gap-1">
			<div class="text-[11px] text-white/40 uppercase tracking-wide">Активных</div>
			<div class="text-3xl font-bold text-green-400">{stats.activeUsers}</div>
			<div class="text-xs text-white/40 flex items-center gap-1"><i class="bi bi-person-check"></i>за 30 дней</div>
		</div>
		<div class="bg-[#1a1a2e] rounded-2xl p-4 border border-purple-500/15 flex flex-col gap-1">
			<div class="text-[11px] text-white/40 uppercase tracking-wide">Всего ивентов</div>
			<div class="text-3xl font-bold text-purple-400">{stats.totalEvents}</div>
			<div class="text-xs text-white/40 flex items-center gap-1"><i class="bi bi-calendar3"></i>{stats.upcomingEvents} предстоит</div>
		</div>
		<div class="bg-[#1a1a2e] rounded-2xl p-4 border border-yellow-500/15 flex flex-col gap-1">
			<div class="text-[11px] text-white/40 uppercase tracking-wide">Сыграно</div>
			<div class="text-3xl font-bold text-yellow-400">{stats.totalGames}</div>
			<div class="text-xs text-white/40 flex items-center gap-1"><i class="bi bi-people"></i>~{stats.avgPlayers} чел./игра</div>
		</div>
	</div>

	<!-- Revenue -->
	<div class="bg-[#1a1a2e] rounded-2xl p-4 border border-white/5">
		<div class="text-[11px] text-white/40 uppercase tracking-wide mb-3">Выручка</div>
		<div class="flex items-end justify-between">
			<div>
				<div class="text-[11px] text-white/40 mb-0.5">За всё время</div>
				<div class="text-2xl font-bold text-white">{stats.totalRevenue}</div>
			</div>
			<div class="text-right">
				<div class="text-[11px] text-white/40 mb-0.5">Этот месяц</div>
				<div class="text-xl font-bold text-green-400">{stats.thisMonthRevenue}</div>
			</div>
		</div>
		<div class="mt-4 flex items-end gap-1.5 h-16">
			{#each [40, 65, 55, 80, 70, 90, 60, 75, 85, 95, 72, 88] as h, i}
				<div class="flex-1 rounded-sm" style="height: {h}%; background: {i === 11 ? 'rgb(59 130 246)' : 'rgba(255,255,255,0.08)'}"></div>
			{/each}
		</div>
		<div class="flex justify-between mt-1">
			{#each ["Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек","Янв","Фев","Мар"] as m}
				<div class="text-[9px] text-white/25">{m}</div>
			{/each}
		</div>
	</div>

	<!-- Recent activity -->
	<div class="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden">
		<div class="px-4 py-3 border-b border-white/5">
			<div class="text-[11px] text-white/40 uppercase tracking-wide">Последняя активность</div>
		</div>
		{#each recentActivity as act}
			<div class="px-4 py-3 border-b border-white/[0.04] last:border-0 flex items-center gap-3">
				<div class="w-8 h-8 {act.color} rounded-lg flex items-center justify-center shrink-0">
					<i class="bi {act.icon} text-xs text-white"></i>
				</div>
				<div class="flex-1 min-w-0">
					<p class="text-xs text-white/80 truncate">{act.text}</p>
					<p class="text-[10px] text-white/35 mt-0.5">{act.time}</p>
				</div>
			</div>
		{/each}
	</div>

	<!-- Quick nav -->
	<div class="grid grid-cols-3 gap-2">
		<button on:click={() => (activeTab = "events")} class="bg-[#1a1a2e] border border-white/5 rounded-2xl p-3 flex flex-col items-center gap-2 active:scale-[0.97] transition-all cursor-pointer">
			<div class="w-10 h-10 bg-blue-500/15 border border-blue-500/20 rounded-xl flex items-center justify-center"><i class="bi bi-calendar3 text-blue-400 text-base"></i></div>
			<span class="text-[10px] text-white/60 font-medium">Ивенты</span>
		</button>
		<button on:click={() => (activeTab = "users")} class="bg-[#1a1a2e] border border-white/5 rounded-2xl p-3 flex flex-col items-center gap-2 active:scale-[0.97] transition-all cursor-pointer">
			<div class="w-10 h-10 bg-green-500/15 border border-green-500/20 rounded-xl flex items-center justify-center"><i class="bi bi-people-fill text-green-400 text-base"></i></div>
			<span class="text-[10px] text-white/60 font-medium">Юзеры</span>
		</button>
		<button on:click={() => (activeTab = "notifications")} class="bg-[#1a1a2e] border border-white/5 rounded-2xl p-3 flex flex-col items-center gap-2 active:scale-[0.97] transition-all cursor-pointer">
			<div class="w-10 h-10 bg-orange-500/15 border border-orange-500/20 rounded-xl flex items-center justify-center"><i class="bi bi-megaphone-fill text-orange-400 text-base"></i></div>
			<span class="text-[10px] text-white/60 font-medium">Нотификации</span>
		</button>
	</div>
</div>

<!-- ════════════════════ TAB: EVENTS ═══════════════════════════════════════ -->
{:else if activeTab === "events"}
<div class="px-4 pt-4 flex flex-col gap-3" transition:fade={{ duration: 180 }}>
	<div class="flex items-center justify-between">
		<div class="text-sm text-white/50">{filteredEvents.length} ивентов</div>
		<button on:click={openCreateEvent} class="cursor-pointer flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold active:scale-[0.97] transition-all">
			<i class="bi bi-plus-lg text-base leading-none"></i> Создать
		</button>
	</div>

	<div class="flex gap-1.5 flex-wrap">
		{#each filterOptions as opt}
			<button on:click={() => (eventFilter = opt.val)}
				class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer
					{eventFilter === opt.val ? 'bg-white/10 border-white/20 text-white' : 'bg-white/[0.03] border-white/5 text-white/40'}">
				{opt.label}
			</button>
		{/each}
	</div>

	{#each filteredEvents as ev (ev.id)}
		{@const ss = slotStatus(ev.members, ev.max_members)}
		<div class="bg-[#1a1a2e] rounded-2xl border border-white/[0.08] overflow-hidden" transition:slide={{ duration: 200 }}>
			<div class="p-4 flex flex-col gap-3">
				<div class="flex items-start justify-between gap-2">
					<div class="flex-1 min-w-0">
						<div class="font-semibold text-[15px] truncate">{ev.name}</div>
						<div class="text-xs text-white/40 mt-0.5">{ev.date} · {ev.time}</div>
					</div>
					<span class="px-2 py-1 rounded-lg text-[10px] font-semibold border shrink-0 {statusClass[ev.status]}">{statusLabel[ev.status]}</span>
				</div>
				<div class="flex flex-col gap-1.5">
					<div class="flex items-center gap-2 text-xs text-white/50"><i class="bi bi-geo-alt-fill text-white/30"></i><span>{ev.location}</span></div>
					<div class="flex items-center gap-2 text-xs text-white/50"><i class="bi bi-credit-card-fill text-white/30"></i><span>{ev.cost}</span></div>
				</div>
				<div class="flex flex-col gap-1">
					<div class="flex justify-between items-center">
						<span class="text-[11px] text-white/40">Участники</span>
						<span class="text-[11px] font-semibold slot-text {ss}">{ev.members}/{ev.max_members}</span>
					</div>
					<div class="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
						<div class="h-full rounded-full slot-bg {ss}" style="width: {Math.min((ev.members / ev.max_members) * 100, 100)}%"></div>
					</div>
				</div>
				<div class="flex gap-2 pt-1 border-t border-white/[0.06]">
					<button on:click={() => openParticipants(ev)}
						class="cursor-pointer flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white/[0.06] hover:bg-white/10 text-white/70 rounded-xl text-xs font-semibold transition-all active:scale-[0.97]">
						<i class="bi bi-people-fill"></i> Участники ({ev.members})
					</button>
					<button on:click={() => openEditEvent(ev)}
						class="cursor-pointer w-10 h-10 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl flex items-center justify-center transition-all active:scale-[0.97]">
						<i class="bi bi-pencil-fill text-blue-400 text-sm"></i>
					</button>
					<button on:click={() => confirmDeleteEvent(ev)}
						class="cursor-pointer w-10 h-10 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl flex items-center justify-center transition-all active:scale-[0.97]">
						<i class="bi bi-trash3-fill text-red-400 text-sm"></i>
					</button>
				</div>
			</div>
		</div>
	{/each}

	{#if filteredEvents.length === 0}
		<div class="py-16 text-center">
			<i class="bi bi-calendar-x text-4xl text-white/15 block mb-3"></i>
			<p class="text-white/40 text-sm">Ивентов нет</p>
		</div>
	{/if}
</div>

<!-- ════════════════════ TAB: USERS ════════════════════════════════════════ -->
{:else if activeTab === "users"}
<div class="px-4 pt-4 flex flex-col gap-3" transition:fade={{ duration: 180 }}>
	<div class="relative">
		<i class="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm"></i>
		<input bind:value={userSearch} type="text" placeholder="Поиск по имени, позывному, Telegram..."
			class="w-full bg-[#1a1a2e] border border-white/[0.08] rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-blue-500/50 transition-all"/>
	</div>
	<div class="text-[11px] text-white/35 uppercase tracking-wide">{filteredUsers.length} пользователей</div>

	<div class="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden">
		{#each filteredUsers as u (u.id)}
			<button on:click={() => openUserDetail(u)}
				class="w-full px-4 py-3.5 flex items-center gap-3 border-b border-white/[0.04] last:border-0 active:bg-white/5 transition-all cursor-pointer text-left">
				<div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm border-2
					{u.is_admin ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-white/8 border-white/10 text-white'}">
					{(u.call_sign ?? u.name).charAt(0).toUpperCase()}
				</div>
				<div class="flex-1 min-w-0">
					<div class="flex items-center gap-1.5">
						<span class="text-sm font-medium text-white truncate">{u.call_sign ?? u.name}</span>
						{#if u.is_admin}<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/15 text-red-400 border border-red-500/25 shrink-0">ADMIN</span>{/if}
					</div>
					<div class="text-xs text-white/40 truncate">{u.telegram} · {u.games} игр · {u.xp} XP</div>
				</div>
				<i class="bi bi-chevron-right text-white/20 text-sm shrink-0"></i>
			</button>
		{/each}
		{#if filteredUsers.length === 0}
			<div class="py-12 text-center">
				<i class="bi bi-search text-3xl text-white/15 block mb-2"></i>
				<p class="text-sm text-white/40">Ничего не найдено</p>
			</div>
		{/if}
	</div>
</div>

<!-- ════════════════════ TAB: NOTIFICATIONS ════════════════════════════════ -->
{:else if activeTab === "notifications"}
<div class="px-4 pt-4 flex flex-col gap-3" transition:fade={{ duration: 180 }}>
	<div class="flex items-center justify-between">
		<div class="text-sm text-white/50">{mockNotifications.length} уведомлений</div>
		<button on:click={openCreateNotif} class="cursor-pointer flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold active:scale-[0.97] transition-all">
			<i class="bi bi-plus-lg text-base leading-none"></i> Создать
		</button>
	</div>

	{#each mockNotifications as n (n.id)}
		{@const cfg = CATEGORY_CONFIG[n.category]}
		<div class="bg-[#1a1a2e] rounded-2xl border border-white/[0.08] overflow-hidden">
			<div class="p-4 flex gap-3 items-start">
				<div class="w-10 h-10 {cfg.bgClass} rounded-xl flex items-center justify-center shrink-0">
					<i class="bi {cfg.icon} text-sm text-white"></i>
				</div>
				<div class="flex-1 min-w-0">
					<div class="flex items-center gap-2 mb-0.5">
						<span class="text-sm font-semibold text-white truncate">{n.title}</span>
						<span class="px-2 py-0.5 rounded-md text-[9px] font-bold bg-white/5 text-white/40 border border-white/8 shrink-0">{categoryLabels[n.category]}</span>
					</div>
					<p class="text-xs text-white/55 leading-relaxed line-clamp-2">{n.description}</p>
					<div class="flex items-center gap-3 mt-2">
						<span class="text-[10px] text-white/30">{n.created_at}</span>
						<span class="text-[10px] text-white/30 flex items-center gap-1"><i class="bi bi-send-fill text-[9px]"></i>{n.sent_to} получателей</span>
					</div>
				</div>
			</div>
			<div class="h-px bg-white/[0.05] mx-4"></div>
			<div class="px-4 py-2.5 flex justify-end gap-2">
				<button on:click={() => confirmDeleteNotif(n)}
					class="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg text-xs font-semibold transition-all active:scale-[0.97]">
					<i class="bi bi-trash3-fill text-xs"></i> Удалить
				</button>
			</div>
		</div>
	{/each}
</div>
{/if}
</main>

<!-- ════════════════════ MODAL: EVENT UPSERT ═══════════════════════════════ -->
{#if showEventModal}
<div transition:fade={{ duration: 200 }} on:click|self={() => (showEventModal = false)} aria-hidden="true"
	class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center">
	<div on:click|stopPropagation aria-hidden="true"
		class="w-full max-w-lg bg-[#1a1a2e] border border-white/[0.08] rounded-t-3xl overflow-hidden max-h-[90vh] flex flex-col">
		<div class="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/[0.06]">
			<div>
				<h2 class="text-base font-bold">{eventModalMode === "create" ? "Создать ивент" : "Редактировать ивент"}</h2>
				<p class="text-xs text-white/40 mt-0.5">{eventModalMode === "create" ? "Заполните данные нового ивента" : editingEvent?.name}</p>
			</div>
			<button on:click={() => (showEventModal = false)} class="cursor-pointer w-8 h-8 bg-white/[0.06] rounded-full flex items-center justify-center active:scale-95 transition-all">
				<i class="bi bi-x-lg text-sm text-white/60"></i>
			</button>
		</div>
		<div class="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">
			<div class="flex flex-col gap-1.5">
				<label class="text-[11px] text-white/40 uppercase tracking-wide">Название</label>
				<input bind:value={eventForm.name} type="text" placeholder="Assault #13"
					class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-all"/>
			</div>
			<div class="grid grid-cols-2 gap-3">
				<div class="flex flex-col gap-1.5">
					<label class="text-[11px] text-white/40 uppercase tracking-wide">Дата</label>
					<input bind:value={eventForm.date} type="date" class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white outline-none transition-all [color-scheme:dark]"/>
				</div>
				<div class="flex flex-col gap-1.5">
					<label class="text-[11px] text-white/40 uppercase tracking-wide">Цена</label>
					<div class="relative">
						<input bind:value={eventForm.cost} type="number" placeholder="100"
							class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 pr-10 text-sm text-white placeholder:text-white/25 outline-none transition-all"/>
						<span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-white/30">zł</span>
					</div>
				</div>
			</div>
			<div class="grid grid-cols-2 gap-3">
				<div class="flex flex-col gap-1.5">
					<label class="text-[11px] text-white/40 uppercase tracking-wide">Начало</label>
					<input bind:value={eventForm.start_time} type="time" class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white outline-none transition-all [color-scheme:dark]"/>
				</div>
				<div class="flex flex-col gap-1.5">
					<label class="text-[11px] text-white/40 uppercase tracking-wide">Конец</label>
					<input bind:value={eventForm.end_time} type="time" class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white outline-none transition-all [color-scheme:dark]"/>
				</div>
			</div>
			<div class="flex flex-col gap-1.5">
				<label class="text-[11px] text-white/40 uppercase tracking-wide">Локация</label>
				<input bind:value={eventForm.location} type="text" placeholder="Polygon Wschód"
					class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-all"/>
			</div>
			<div class="flex flex-col gap-1.5">
				<label class="text-[11px] text-white/40 uppercase tracking-wide">Адрес</label>
				<input bind:value={eventForm.address} type="text" placeholder="ul. Strzelecka 1, Warszawa"
					class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-all"/>
			</div>
			<div class="flex flex-col gap-1.5">
				<label class="text-[11px] text-white/40 uppercase tracking-wide">Макс. участников</label>
				<input bind:value={eventForm.max_members} type="number" placeholder="20"
					class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-all"/>
			</div>
			<div class="flex flex-col gap-1.5">
				<label class="text-[11px] text-white/40 uppercase tracking-wide">Краткое описание (RU)</label>
				<textarea bind:value={eventForm.short_description} rows="3" placeholder="Городская тактическая игра..."
					class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-all resize-none"></textarea>
			</div>
		</div>
		<div class="px-5 py-4 border-t border-white/[0.06] flex flex-col gap-2">
			<button on:click={() => (showEventModal = false)}
				class="cursor-pointer w-full py-3.5 bg-blue-600 text-white rounded-xl text-[15px] font-semibold active:scale-[0.97] active:opacity-80 transition-all">
				{eventModalMode === "create" ? "Создать ивент" : "Сохранить изменения"}
			</button>
			<button on:click={() => (showEventModal = false)}
				class="cursor-pointer w-full py-3 bg-white/[0.06] text-white/60 rounded-xl text-[15px] font-semibold active:scale-[0.97] active:opacity-80 transition-all">
				Отмена
			</button>
		</div>
	</div>
</div>
{/if}

<!-- ════════════════════ MODAL: PARTICIPANTS ═══════════════════════════════ -->
{#if showParticipantsModal && selectedEvent}
<div transition:fade={{ duration: 200 }} on:click|self={() => (showParticipantsModal = false)} aria-hidden="true"
	class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center">
	<div on:click|stopPropagation aria-hidden="true"
		class="w-full max-w-lg bg-[#1a1a2e] border border-white/[0.08] rounded-t-3xl overflow-hidden max-h-[85vh] flex flex-col">
		<div class="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/[0.06]">
			<div>
				<h2 class="text-base font-bold">Участники</h2>
				<p class="text-xs text-white/40 mt-0.5">{selectedEvent.name} · {selectedEvent.date}</p>
			</div>
			<div class="flex items-center gap-2">
				<button on:click={() => exportCSV(selectedEvent, mockParticipants)}
					class="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-green-500/15 border border-green-500/25 text-green-400 rounded-lg text-xs font-semibold active:scale-[0.97] transition-all">
					<i class="bi bi-download text-xs"></i> CSV
				</button>
				<button on:click={() => (showParticipantsModal = false)} class="cursor-pointer w-8 h-8 bg-white/[0.06] rounded-full flex items-center justify-center active:scale-95 transition-all">
					<i class="bi bi-x-lg text-sm text-white/60"></i>
				</button>
			</div>
		</div>
		<div class="px-5 py-3 flex gap-4 border-b border-white/[0.05]">
			<div class="flex items-center gap-1.5">
				<div class="w-2 h-2 rounded-full slot-bg {slotStatus(selectedEvent.members, selectedEvent.max_members)}"></div>
				<span class="text-xs text-white/60 font-semibold">{selectedEvent.members} / {selectedEvent.max_members} мест</span>
			</div>
			<div class="text-xs text-white/35">·</div>
			<div class="text-xs text-white/40">{mockParticipants.length} записей</div>
		</div>
		<div class="overflow-y-auto flex-1">
			{#each mockParticipants as p (p.id)}
				<div class="px-4 py-3.5 border-b border-white/[0.04] last:border-0 flex items-start gap-3">
					<div class="w-9 h-9 bg-white/8 border border-white/10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm text-white">
						{(p.call_sign ?? p.name).charAt(0).toUpperCase()}
					</div>
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-1.5">
							<span class="text-sm font-medium text-white">{p.name}</span>
							{#if p.call_sign}<span class="text-xs text-white/40">«{p.call_sign}»</span>{/if}
						</div>
						<div class="text-xs text-white/40 mt-0.5">{p.telegram} · {p.phone}</div>
						<div class="text-[10px] text-white/25 mt-0.5">Записался: {p.registered_at} · {p.games} игр</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
{/if}

<!-- ════════════════════ MODAL: DELETE EVENT ═══════════════════════════════ -->
{#if showDeleteEventModal && deletingEvent}
<div transition:fade={{ duration: 200 }} on:click|self={() => (showDeleteEventModal = false)} aria-hidden="true"
	class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
	<div on:click|stopPropagation aria-hidden="true"
		class="w-full max-w-sm bg-[#1a1a2e] border border-white/[0.08] rounded-2xl overflow-hidden">
		<div class="flex flex-col items-center pt-7 pb-5 px-6 gap-4">
			<div class="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-2xl text-red-400">
				<i class="bi bi-calendar-x-fill"></i>
			</div>
			<div class="text-center flex flex-col gap-1.5">
				<div class="text-[17px] font-semibold text-white">Удалить ивент?</div>
				<div class="text-sm text-white/50 leading-relaxed">Вы уверены, что хотите удалить <span class="text-white/70 font-medium">«{deletingEvent.name}»</span>? Все записи участников будут отменены.</div>
			</div>
		</div>
		<div class="h-px bg-white/[0.06] mx-4"></div>
		<div class="px-4 py-3 flex items-center gap-2 text-xs text-white/40">
			<i class="bi bi-calendar-event-fill text-white/25"></i>
			{deletingEvent.date} · {deletingEvent.location}
		</div>
		<div class="h-px bg-white/[0.06] mx-4"></div>
		<div class="p-4 flex flex-col gap-2">
			<button on:click={() => (showDeleteEventModal = false)} class="cursor-pointer w-full py-3.5 bg-red-500 text-white rounded-xl text-[15px] font-semibold transition-all active:scale-[0.97]">Да, удалить</button>
			<button on:click={() => (showDeleteEventModal = false)} class="cursor-pointer w-full py-3 bg-white/[0.08] text-white rounded-xl text-[15px] font-semibold transition-all active:scale-[0.97] active:opacity-80">Назад</button>
		</div>
	</div>
</div>
{/if}

<!-- ════════════════════ MODAL: USER DETAIL ════════════════════════════════ -->
{#if showUserModal && selectedUser}
<div transition:fade={{ duration: 200 }} on:click|self={() => (showUserModal = false)} aria-hidden="true"
	class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center">
	<div on:click|stopPropagation aria-hidden="true"
		class="w-full max-w-lg bg-[#1a1a2e] border border-white/[0.08] rounded-t-3xl overflow-hidden max-h-[80vh] flex flex-col">
		<div class="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/[0.06]">
			<div class="flex items-center gap-3">
				<div class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2
					{selectedUser.is_admin ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-white/8 border-white/15 text-white'}">
					{(selectedUser.call_sign ?? selectedUser.name).charAt(0).toUpperCase()}
				</div>
				<div>
					<div class="flex items-center gap-2">
						<h2 class="text-base font-bold">{selectedUser.call_sign ?? selectedUser.name}</h2>
						{#if selectedUser.is_admin}<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/15 text-red-400 border border-red-500/25">ADMIN</span>{/if}
					</div>
					<p class="text-xs text-white/40">{selectedUser.name}</p>
				</div>
			</div>
			<button on:click={() => (showUserModal = false)} class="cursor-pointer w-8 h-8 bg-white/[0.06] rounded-full flex items-center justify-center active:scale-95 transition-all">
				<i class="bi bi-x-lg text-sm text-white/60"></i>
			</button>
		</div>
		<div class="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-3">
			<div class="grid grid-cols-3 gap-2">
				<div class="bg-blue-500/10 rounded-xl p-3 border border-blue-500/15 text-center">
					<div class="text-[10px] text-white/40 uppercase tracking-wide">Уровень</div>
					<div class="text-xl font-bold text-blue-400 mt-0.5">{Math.floor(selectedUser.xp / 200) + 1}</div>
				</div>
				<div class="bg-green-500/10 rounded-xl p-3 border border-green-500/15 text-center">
					<div class="text-[10px] text-white/40 uppercase tracking-wide">Игры</div>
					<div class="text-xl font-bold text-green-400 mt-0.5">{selectedUser.games}</div>
				</div>
				<div class="bg-purple-500/10 rounded-xl p-3 border border-purple-500/15 text-center">
					<div class="text-[10px] text-white/40 uppercase tracking-wide">XP</div>
					<div class="text-xl font-bold text-purple-400 mt-0.5">{selectedUser.xp}</div>
				</div>
			</div>
			<div class="bg-white/[0.03] rounded-2xl border border-white/[0.06] overflow-hidden">
				{#each [
					{ icon: "bi-telegram", label: "Telegram", value: selectedUser.telegram },
					{ icon: "bi-telephone-fill", label: "Телефон", value: selectedUser.phone },
					{ icon: "bi-wallet2", label: "Баланс", value: selectedUser.balance },
					{ icon: "bi-calendar-check-fill", label: "Дата входа", value: selectedUser.joined },
					{ icon: "bi-person-badge-fill", label: "ID", value: `#${selectedUser.id}` },
				] as row}
					<div class="px-4 py-3 flex items-center gap-3 border-b border-white/[0.04] last:border-0">
						<div class="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
							<i class="bi {row.icon} text-xs text-white/40"></i>
						</div>
						<div class="flex-1">
							<div class="text-[10px] text-white/30 uppercase tracking-wide">{row.label}</div>
							<div class="text-sm text-white/80">{row.value}</div>
						</div>
					</div>
				{/each}
			</div>
			<div class="flex flex-col gap-2 mt-1">
				<button class="cursor-pointer w-full py-3 bg-white/[0.06] text-white/60 rounded-xl text-sm font-semibold active:scale-[0.97] active:opacity-80 transition-all flex items-center justify-center gap-2">
					<i class="bi bi-shield-fill-check text-sm"></i>
					{selectedUser.is_admin ? "Снять права администратора" : "Назначить администратором"}
				</button>
				<button class="cursor-pointer w-full py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-semibold active:scale-[0.97] active:opacity-80 transition-all flex items-center justify-center gap-2">
					<i class="bi bi-ban text-sm"></i> Заблокировать пользователя
				</button>
			</div>
		</div>
	</div>
</div>
{/if}

<!-- ════════════════════ MODAL: CREATE NOTIFICATION ════════════════════════ -->
{#if showNotifModal}
<div transition:fade={{ duration: 200 }} on:click|self={() => (showNotifModal = false)} aria-hidden="true"
	class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center">
	<div on:click|stopPropagation aria-hidden="true"
		class="w-full max-w-lg bg-[#1a1a2e] border border-white/[0.08] rounded-t-3xl overflow-hidden max-h-[90vh] flex flex-col">
		<div class="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/[0.06]">
			<div>
				<h2 class="text-base font-bold">Новое уведомление</h2>
				<p class="text-xs text-white/40 mt-0.5">Будет отправлено всем пользователям</p>
			</div>
			<button on:click={() => (showNotifModal = false)} class="cursor-pointer w-8 h-8 bg-white/[0.06] rounded-full flex items-center justify-center active:scale-95 transition-all">
				<i class="bi bi-x-lg text-sm text-white/60"></i>
			</button>
		</div>
		<div class="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">
			<div class="flex flex-col gap-1.5">
				<p class="text-[11px] text-white/40 uppercase tracking-wide">Категория</p>
				<div class="grid grid-cols-2 gap-1.5">
					{#each categoryEntries as entry}
						<button on:click={() => (notifForm.category = entry.cat)}
							class="cursor-pointer flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all
								{notifForm.category === entry.cat ? 'bg-white/10 border-white/20 text-white' : 'bg-white/[0.03] border-white/[0.06] text-white/45'}">
							<div class="w-6 h-6 {entry.bgClass} rounded-md flex items-center justify-center shrink-0">
								<i class="bi {entry.icon} text-[10px] text-white"></i>
							</div>
							<span class="text-xs font-medium">{entry.lbl}</span>
						</button>
					{/each}
				</div>
			</div>
			<div class="bg-white/[0.02] rounded-xl border border-white/[0.05] p-3.5 flex flex-col gap-3">
				<div class="text-[10px] text-white/30 uppercase tracking-widest font-semibold flex items-center gap-1.5"><span class="text-base">🇷🇺</span> Русский</div>
				<div class="flex flex-col gap-1.5">
					<label class="text-[11px] text-white/40 uppercase tracking-wide">Заголовок</label>
					<input bind:value={notifForm.title_ru} type="text" placeholder="Новое событие!" class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-all"/>
				</div>
				<div class="flex flex-col gap-1.5">
					<label class="text-[11px] text-white/40 uppercase tracking-wide">Описание</label>
					<textarea bind:value={notifForm.description_ru} rows="2" placeholder="Открыта запись на игру..." class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-all resize-none"></textarea>
				</div>
			</div>
			<div class="bg-white/[0.02] rounded-xl border border-white/[0.05] p-3.5 flex flex-col gap-3">
				<div class="text-[10px] text-white/30 uppercase tracking-widest font-semibold flex items-center gap-1.5"><span class="text-base">🇵🇱</span> Polski</div>
				<div class="flex flex-col gap-1.5">
					<label class="text-[11px] text-white/40 uppercase tracking-wide">Tytuł</label>
					<input bind:value={notifForm.title_pl} type="text" placeholder="Nowe wydarzenie!" class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-all"/>
				</div>
				<div class="flex flex-col gap-1.5">
					<label class="text-[11px] text-white/40 uppercase tracking-wide">Opis</label>
					<textarea bind:value={notifForm.description_pl} rows="2" placeholder="Rejestracja na grę jest otwarta..." class="w-full bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-all resize-none"></textarea>
				</div>
			</div>
			<div class="flex items-start gap-2.5 p-3 bg-blue-500/5 border border-blue-500/15 rounded-xl">
				<i class="bi bi-info-circle-fill text-blue-400 text-sm mt-0.5 shrink-0"></i>
				<p class="text-xs text-white/50 leading-relaxed">Уведомление будет отправлено всем <span class="text-white/70 font-semibold">247 пользователям</span> приложения.</p>
			</div>
		</div>
		<div class="px-5 py-4 border-t border-white/[0.06] flex flex-col gap-2">
			<button on:click={() => (showNotifModal = false)}
				class="cursor-pointer w-full py-3.5 bg-blue-600 text-white rounded-xl text-[15px] font-semibold active:scale-[0.97] active:opacity-80 transition-all flex items-center justify-center gap-2">
				<i class="bi bi-send-fill text-sm"></i> Отправить уведомление
			</button>
			<button on:click={() => (showNotifModal = false)} class="cursor-pointer w-full py-3 bg-white/[0.06] text-white/60 rounded-xl text-[15px] font-semibold active:scale-[0.97] active:opacity-80 transition-all">Отмена</button>
		</div>
	</div>
</div>
{/if}

<!-- ════════════════════ MODAL: DELETE NOTIFICATION ════════════════════════ -->
{#if showDeleteNotifModal && deletingNotif}
<div transition:fade={{ duration: 200 }} on:click|self={() => (showDeleteNotifModal = false)} aria-hidden="true"
	class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
	<div on:click|stopPropagation aria-hidden="true"
		class="w-full max-w-sm bg-[#1a1a2e] border border-white/[0.08] rounded-2xl overflow-hidden">
		<div class="flex flex-col items-center pt-7 pb-5 px-6 gap-4">
			<div class="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-2xl text-red-400">
				<i class="bi bi-bell-slash-fill"></i>
			</div>
			<div class="text-center flex flex-col gap-1.5">
				<div class="text-[17px] font-semibold text-white">Удалить уведомление?</div>
				<div class="text-sm text-white/50 leading-relaxed">«<span class="text-white/70 font-medium">{deletingNotif.title}</span>» будет удалено. Это действие нельзя отменить.</div>
			</div>
		</div>
		<div class="h-px bg-white/[0.06] mx-4"></div>
		<div class="p-4 flex flex-col gap-2">
			<button on:click={() => (showDeleteNotifModal = false)} class="cursor-pointer w-full py-3.5 bg-red-500 text-white rounded-xl text-[15px] font-semibold transition-all active:scale-[0.97]">Да, удалить</button>
			<button on:click={() => (showDeleteNotifModal = false)} class="cursor-pointer w-full py-3 bg-white/[0.08] text-white rounded-xl text-[15px] font-semibold transition-all active:scale-[0.97] active:opacity-80">Назад</button>
		</div>
	</div>
</div>
{/if}

<style>
	:global(footer) { display: none !important; }
</style>
