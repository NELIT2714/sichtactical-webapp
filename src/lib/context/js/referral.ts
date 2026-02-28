import type { ReferralStats, LeaderboardResponse } from "$lib/context/js/types/referral";

// TODO: replace with API calls when backend is ready
// import { API } from "$lib/context/js/axios";

export const getReferralStats = async (): Promise<ReferralStats | null> => {
	return {
		referral_code: "SICH-X7K2",
		total_invited: 5,
		total_games_by_friends: 13,
		total_xp_earned: 2500,
		total_balance_earned: 75,
		friends: [
			{
				id_user: 101,
				call_sign: "SnakeEye",
				telegram_data: { first_name: "Андрій", last_name: "К.", username: "andriy_k" },
				games_played: 4,
				xp_total: 820,
				joined_at: "2026-01-10T12:00:00Z",
			},
			{
				id_user: 102,
				call_sign: null,
				telegram_data: { first_name: "Олег", last_name: "Мороз", username: "oleg_m" },
				games_played: 3,
				xp_total: 540,
				joined_at: "2026-01-15T09:30:00Z",
			},
			{
				id_user: 103,
				call_sign: "Ghost",
				telegram_data: { first_name: "Дмитро", last_name: null, username: "dmytro_gh" },
				games_played: 3,
				xp_total: 490,
				joined_at: "2026-01-20T17:00:00Z",
			},
			{
				id_user: 104,
				call_sign: null,
				telegram_data: { first_name: "Іван", last_name: "Петров", username: "ivan_p" },
				games_played: 2,
				xp_total: 300,
				joined_at: "2026-02-01T11:00:00Z",
			},
			{
				id_user: 105,
				call_sign: "Rookie",
				telegram_data: { first_name: "Сергій", last_name: null, username: "serhiy_r" },
				games_played: 1,
				xp_total: 100,
				joined_at: "2026-02-10T08:00:00Z",
			},
		],
	};
};

export const getLeaderboard = async (): Promise<LeaderboardResponse | null> => {
	return {
		my_rank: 4,
		entries: [
			{
				rank: 1,
				id_user: 201,
				call_sign: "Phantom",
				telegram_data: { first_name: "Олексій", last_name: "Б.", username: "phantom_ua" },
				games_played: 32,
				xp_total: 9800,
			},
			{
				rank: 2,
				id_user: 202,
				call_sign: "Viper",
				telegram_data: { first_name: "Назар", last_name: null, username: "viper_ua" },
				games_played: 27,
				xp_total: 7600,
			},
			{
				rank: 3,
				id_user: 203,
				call_sign: "Wolf",
				telegram_data: { first_name: "Тарас", last_name: "Г.", username: "wolf_ua" },
				games_played: 21,
				xp_total: 6100,
			},
			{
				rank: 4,
				id_user: 204,
				call_sign: "Nelit",
				telegram_data: { first_name: "Nelit", last_name: null, username: "nelit_dev" },
				games_played: 18,
				xp_total: 5200,
			},
			{
				rank: 5,
				id_user: 205,
				call_sign: "Shadow",
				telegram_data: { first_name: "Богдан", last_name: "С.", username: "shadow_ua" },
				games_played: 15,
				xp_total: 4300,
			},
			{
				rank: 6,
				id_user: 206,
				call_sign: null,
				telegram_data: { first_name: "Михайло", last_name: "Р.", username: "mykhailo_r" },
				games_played: 12,
				xp_total: 3500,
			},
			{
				rank: 7,
				id_user: 207,
				call_sign: "SnakeEye",
				telegram_data: { first_name: "Андрій", last_name: "К.", username: "andriy_k" },
				games_played: 10,
				xp_total: 2900,
			},
			{
				rank: 8,
				id_user: 208,
				call_sign: "Ghost",
				telegram_data: { first_name: "Дмитро", last_name: null, username: "dmytro_gh" },
				games_played: 8,
				xp_total: 2200,
			},
			{
				rank: 9,
				id_user: 209,
				call_sign: null,
				telegram_data: { first_name: "Олег", last_name: "Мороз", username: "oleg_m" },
				games_played: 6,
				xp_total: 1600,
			},
			{
				rank: 10,
				id_user: 210,
				call_sign: "Rookie",
				telegram_data: { first_name: "Сергій", last_name: null, username: "serhiy_r" },
				games_played: 4,
				xp_total: 900,
			},
		],
	};
};
