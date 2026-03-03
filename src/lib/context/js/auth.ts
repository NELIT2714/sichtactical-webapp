import { get, writable } from "svelte/store";
import { API } from "$lib/context/js/axios";

export const authToken = writable(null);

interface TelegramUser {
	id: number;
	first_name: string;
	last_name?: string;
	username?: string;
	language_code: string;
	is_premium?: boolean;
}

export const upsertUser = async (initData: string, user: TelegramUser) => {
	return API.post("/v1/users/app", {
		user_telegram_id: user.id,
		first_name: user.first_name,
		last_name: user.last_name ?? "",
		username: user.username ?? "",
		language_code: user.language_code,
		is_premium: user.is_premium ?? false,
		init_data: initData
	});
};

export const getToken = async (initData: string) => {
	const response = await API.post("/v1/users/init",
		null,
		{ headers: { "x-telegram-data": initData } }
	);

	if (!response.data.status) {
		throw new Error("Auth failed");
	}

	authToken.set(response.data.token);
	return response.data.token;
};

let initPromise: Promise<void> | null = null;

export const ensureAuth = (tg: any): Promise<void> => {
	const token = get(authToken);

	if (token) return Promise.resolve();
	if (initPromise) return initPromise;

	initPromise = (async () => {
		if (!tg) throw new Error("Telegram WebApp not found");

		const initData = tg.initData;
		const user = tg.initDataUnsafe?.user;

		if (!initData || !user) throw new Error("Invalid Telegram data");

		await upsertUser(initData, user);
		await getToken(initData);
	})();

	return initPromise;
};