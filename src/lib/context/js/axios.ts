import { authToken } from "$lib/context/js/auth";

import axios from "axios";
import { get } from "svelte/store";

const API_URL = import.meta.env.VITE_API_URL;
// const API_KEY = import.meta.env.VITE_API_KEY;

const API = axios.create({
	baseURL: API_URL,
	timeout: 10000,
	headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use(
	(config) => {
		const token = get(authToken);

		if (token) {
			config.headers = config.headers ?? {};
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => Promise.reject(error),
);

export { API };
