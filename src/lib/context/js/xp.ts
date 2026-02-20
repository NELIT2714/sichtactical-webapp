export const BASE_XP = 100;

export const xpTotalForLevel = (level: number): number => {
	const l = Math.max(1, Math.floor(level));
	const z = l - 1;
	return BASE_XP * z * (z + 1) / 2;
}

export const xpForNextLevel = (level: number): number => {
	const l = Math.max(1, Math.floor(level));
	const z = l - 1;
	return BASE_XP * (z + 1);
}

export const computeLevelFromXP = (xp: number): number => {
	const xpSafe = Math.max(0, Math.floor(xp));
	const discriminant = 1 + 8 * xpSafe / BASE_XP;
	const lvlZeroBased = Math.floor((Math.sqrt(discriminant) - 1) / 2);
	return Math.max(1, lvlZeroBased + 1);
}

export const progressForXP = (xp: number) => {
	const level = computeLevelFromXP(xp);
	const xpTotalCurrent = xpTotalForLevel(level);
	const experience = Math.max(0, xp - xpTotalCurrent);
	const experienceToNextLevel = xpForNextLevel(level);
	const levelProgress = experienceToNextLevel > 0 ? (experience / experienceToNextLevel) * 100 : 0;
	return { level, experience, experienceToNextLevel, levelProgress };
}
