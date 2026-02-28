export type ReferralFriend = {
	id_user: number;
	call_sign: string | null;
	telegram_data: {
		first_name: string;
		last_name: string | null;
		username: string;
	};
	games_played: number;
	xp_total: number;
	joined_at: string;
};

export type ReferralStats = {
	referral_code: string;
	total_invited: number;
	total_games_by_friends: number;
	total_xp_earned: number;
	total_balance_earned: number;
	friends: ReferralFriend[];
};

export type LeaderboardEntry = {
	rank: number;
	id_user: number;
	call_sign: string | null;
	telegram_data: {
		first_name: string;
		last_name: string | null;
		username: string;
	};
	games_played: number;
	xp_total: number;
};

export type LeaderboardResponse = {
	entries: LeaderboardEntry[];
	my_rank: number | null;
};

