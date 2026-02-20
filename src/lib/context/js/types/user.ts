export type TelegramData = {
	first_name: string;
	id_user_telegram_data: number;
	is_premium: boolean;
	language_code: string;
	last_name: string | null;
	phone_number: string;
	telegram_id: string;
	username: string;
};

export type User = {
	balance: number;
	call_sign: string | null;
	id_user: number;
	id_user_telegram_data: number;
	referral_code: string;
	telegram_data: TelegramData;
	xp_total: number;
};
