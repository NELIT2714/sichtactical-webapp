export const getDuration = (start: string, end: string) => {
	const [startH, startM] = start.split(":").map(Number);
	const [endH, endM] = end.split(":").map(Number);

	let hours = endH - startH;
	let minutes = endM - startM;

	if (minutes < 0) {
		minutes += 60;
		hours -= 1;
	}

	const hourWord = (h: number) => {
		if (h % 10 === 1 && h % 100 !== 11) return "час";
		if ([2, 3, 4].includes(h % 10) && ![12, 13, 14].includes(h % 100)) return "часа";
		return "часов";
	}

	const minuteWord = (m: number) => {
		if (m % 10 === 1 && m % 100 !== 11) return "минута";
		if ([2, 3, 4].includes(m % 10) && ![12, 13, 14].includes(m % 100)) return "минуты";
		return "минут";
	}

	let result = "";
	if (hours > 0) result += `${hours} ${hourWord(hours)}`;
	if (minutes > 0) result += `${hours > 0 ? " " : ""}${minutes} ${minuteWord(minutes)}`;

	return result || "0 минут";
}