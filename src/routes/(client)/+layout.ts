import type { LayoutLoad } from "./$types";
import { API } from "$lib/context/js/axios";
import { createUser, getToken } from "$lib/context/js/auth";

export const ssr = false;

export const load: LayoutLoad = async () => {
	try {
		// @ts-ignore
		// const tg = window.Telegram?.WebApp;
		const tg = {
			"initData": "query_id=AAGNH5w9AAAAAI0fnD1nrJkO&user=%7B%22id%22%3A1033641869%2C%22first_name%22%3A%22Nelit%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22nelit_dev%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FSvhwdFKVz4CojRE9K3PUhf-jVhOp5tZ353hQGrkO6Ak.svg%22%7D&auth_date=1771580271&signature=goARAdi0rI5e28WpaxCWuou3CMuhV1F1jdLG7zKNAepWLjsREuPx-SUZmsOhPEgZQSiCC1VB2BrBwFbDdcUuAg&hash=27d5b321becea86988efe7dbfd068578b698d62db97c1556b4aa5b6158a8c312",
			"initDataUnsafe": {
				"query_id": "AAGNH5w9AAAAAI0fnD1nrJkO",
				"user": {
					"id": 1033641869,
					"first_name": "Nelit",
					"last_name": "",
					"username": "nelit_dev",
					"language_code": "ru",
					"allows_write_to_pm": true,
					"photo_url": "https://t.me/i/userpic/320/SvhwdFKVz4CojRE9K3PUhf-jVhOp5tZ353hQGrkO6Ak.svg"
				},
				"auth_date": "1771580271",
				"signature": "goARAdi0rI5e28WpaxCWuou3CMuhV1F1jdLG7zKNAepWLjsREuPx-SUZmsOhPEgZQSiCC1VB2BrBwFbDdcUuAg",
				"hash": "27d5b321becea86988efe7dbfd068578b698d62db97c1556b4aa5b6158a8c312"
			},
			"version": "9.1",
			"platform": "tdesktop",
			"colorScheme": "dark",
			"themeParams": {
				"accent_text_color": "#79e8da",
				"bg_color": "#282e33",
				"bottom_bar_bg_color": "#282e33",
				"button_color": "#3fc1b0",
				"button_text_color": "#ffffff",
				"destructive_text_color": "#f57474",
				"header_bg_color": "#282e33",
				"hint_color": "#82868a",
				"link_color": "#4be1c3",
				"secondary_bg_color": "#313b43",
				"section_bg_color": "#282e33",
				"section_header_text_color": "#4be1c3",
				"section_separator_color": "#242a2e",
				"subtitle_text_color": "#82868a",
				"text_color": "#f5f5f5"
			},
			"isExpanded": true,
			"viewportHeight": 590,
			"viewportStableHeight": 590,
			"safeAreaInset": {
				"top": 0,
				"bottom": 0,
				"left": 0,
				"right": 0
			},
			"contentSafeAreaInset": {
				"top": 0,
				"bottom": 0,
				"left": 0,
				"right": 0
			},
			"isClosingConfirmationEnabled": false,
			"isVerticalSwipesEnabled": true,
			"isFullscreen": false,
			"isOrientationLocked": false,
			"isActive": true,
			"headerColor": "#1a1a2e",
			"backgroundColor": "#282e33",
			"bottomBarColor": "#282e33",
			"BackButton": {
				"isVisible": false
			},
			"MainButton": {
				"type": "main",
				"text": "Continue",
				"color": "#3fc1b0",
				"textColor": "#ffffff",
				"isVisible": false,
				"isProgressVisible": false,
				"isActive": true,
				"hasShineEffect": false
			},
			"SecondaryButton": {
				"type": "secondary",
				"text": "Cancel",
				"color": "#282e33",
				"textColor": "#3fc1b0",
				"isVisible": false,
				"isProgressVisible": false,
				"isActive": true,
				"hasShineEffect": false,
				"position": "left"
			},
			"SettingsButton": {
				"isVisible": false
			},
			"HapticFeedback": {},
			"CloudStorage": {},
			"DeviceStorage": {},
			"SecureStorage": {},
			"BiometricManager": {
				"isInited": false,
				"isBiometricAvailable": false,
				"biometricType": "unknown",
				"isAccessRequested": false,
				"isAccessGranted": false,
				"isBiometricTokenSaved": false,
				"deviceId": ""
			},
			"Accelerometer": {
				"isStarted": false,
				"x": null,
				"y": null,
				"z": null
			},
			"DeviceOrientation": {
				"isStarted": false,
				"absolute": false,
				"alpha": null,
				"beta": null,
				"gamma": null
			},
			"Gyroscope": {
				"isStarted": false,
				"x": null,
				"y": null,
				"z": null
			},
			"LocationManager": {
				"isInited": false,
				"isLocationAvailable": false,
				"isAccessRequested": false,
				"isAccessGranted": false
			}
		};

		if (!tg) {
			return { user: null, event: null };
		}

		const initData = tg.initData;
		const user = tg.initDataUnsafe?.user;

		await createUser(initData, user);
		await getToken(initData, user.id.toString());

		const [userMeResponse, eventResponse] = await Promise.all([
			API.get("/v1/users/me"),
			API.get("/v1/events/1")
		]);

		return {
			user: userMeResponse.data.status ? userMeResponse.data.user : null,
			event: eventResponse.data.status ? eventResponse.data.event : null
		};

	} catch (error) {
		console.error("Layout init error:", error);
		return { user: null, event: null };
	}
};