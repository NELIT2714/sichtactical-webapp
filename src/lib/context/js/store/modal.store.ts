import { writable } from "svelte/store";
import type { SvelteComponent } from "svelte";

interface ModalState {
	component: typeof SvelteComponent | null;
	props?: Record<string, any>;
}

const createModalStore = () => {
	const { subscribe, set } = writable<ModalState>({ component: null });

	return {
		subscribe,

		open(component : any, props = {}) {
			set({ component, props });
		},

		close() {
			set({ component: null });
		}
	};
};

export const modal = createModalStore();
