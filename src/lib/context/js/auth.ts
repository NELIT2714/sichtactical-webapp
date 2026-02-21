import { get, writable } from "svelte/store";
import { API } from "$lib/context/js/axios";
import type { User } from "$lib/context/js/types/user";
// "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMDMzNjQxODY5IiwidXNlcl9pZCI6NCwidGVsZWdyYW1faWQiOiIxMDMzNjQxODY5IiwiaWF0IjoxNzcxMTkwMTQ5LCJleHAiOjE3NzIwNTQxNDl9.Q_uFzjz7w0ig7djkSnSqKIezgfyiaXijiVDW2RrLNONHJHsv4TRUvovY-iFY4TLNpyCtlkjpo3GuuHYoJ02vlg"
export const authToken = writable(null);


interface TelegramUser {
	id: number;
	first_name: string;
	last_name?: string;
	username?: string;
	language_code: string;
	is_premium?: boolean;
}

export const createUser = async (initData: string, user: TelegramUser) => {
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

export const getToken = async (initData: string, telegramId: string) => {
	const response = await API.post("/v1/users/init",
		{ user_telegram_id: telegramId },
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

		await createUser(initData, user);
		await getToken(initData, user.id.toString());
	})();

	return initPromise;
};