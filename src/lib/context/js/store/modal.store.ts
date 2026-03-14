import { writable } from "svelte/store";
import type { SvelteComponent } from "svelte";

interface ModalState {
	component: typeof SvelteComponent | null;
	props?: Record<string, any>;
	type?: "center" | "bottom";
}

const createModalStore = () => {
	const { subscribe, set } = writable<ModalState>({ component: null });

	return {
		subscribe,

		open(component: any, props = {}, type: "center" | "bottom" = "center") {
			set({ component, props, type });
		},

		openBottom(component: any, props = {}) {
			set({ component, props, type: "bottom" });
		},

		close() {
			set({ component: null });
		}
	};
};

export const modal = createModalStore();
