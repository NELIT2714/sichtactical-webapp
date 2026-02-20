export const validateFullName = (value: string) => {
	if (!value || value.trim().length < 3) return "Введите имя и фамилию";
	return "";
};

export const validatePhone = (value: string) => {
	const phoneRegex = /^\+[\d]{1,14}$/;

	if (!value) return "Введите номер телефона";
	if (!phoneRegex.test(value)) return "Некорректный номер телефона";
	return "";
};

export const validateRules = (value: boolean) => {
	return value ? "" : "Необходимо принять правила";
};