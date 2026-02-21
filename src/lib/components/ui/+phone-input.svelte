<script lang="ts">
	import { onMount } from "svelte";
	import { AsYouType } from "libphonenumber-js";

	export let value: string = "";
	export let placeholder: string = "";
	export let maxLength: number = 15;
	export let styles: string = "";
	export let inputID: string = "";
	export let inputName: string = "";
	export let req: boolean = false;
	export let readonly : boolean = false;

	let inputEl: HTMLInputElement;
	let focused = false;

	const format = (raw: string) => {
		const digits = raw.replace(/[^\d+]/g, "");
		const formatter = new AsYouType();
		formatter.input(digits);
		return formatter.formattedOutput || digits;
	};

	const onFocus = () => {
		focused = true;
		if (!value.startsWith("+")) {
			value = "+";
			inputEl.value = "+";
		}
		setTimeout(() => {
			const pos = inputEl.value.length;
			inputEl.setSelectionRange(pos, pos);
		});
	};

	const onBlur = () => {
		focused = false;
		if (value === "+" || value === "") {
			value = "";
			inputEl.value = "";
		}
	};

	const onInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		let digits = target.value.replace(/[^\d+]/g, "");
		if (!digits.startsWith("+")) digits = "+" + digits;
		digits = digits.slice(0, maxLength);
		value = digits;
		target.value = format(digits);
	};

	const onKeyDown = (e: KeyboardEvent) => {
		const target = e.target as HTMLInputElement;
		const selectionLength = target.selectionEnd! - target.selectionStart!;
		if ((e.key === "Backspace" || e.key === "Delete") && selectionLength > 0) {
			e.preventDefault();
			value = "+";
			inputEl.value = "+";
			setTimeout(() => inputEl.setSelectionRange(1, 1));
			return;
		}
		const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];
		if (allowed.includes(e.key)) return;
		if (e.ctrlKey || e.metaKey) return;
		if (!/^[0-9]$/.test(e.key)) e.preventDefault();
		else if (value.replace(/\D/g, "").length >= maxLength - 1) e.preventDefault();
	};

	const onPaste = (e: ClipboardEvent) => {
		const txt = e.clipboardData?.getData("text") ?? "";
		let digits = (txt.match(/[0-9+]/g) || []).join("");
		if (!digits.startsWith("+")) digits = "+" + digits;
		digits = digits.slice(0, maxLength);
		e.preventDefault();
		value = digits;
		inputEl.value = format(digits);
		setTimeout(() => inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length));
	};

	onMount(() => {
		if (value) inputEl.value = format(value);
	});

	$: if (inputEl && !focused) {
		inputEl.value = value ? format(value) : "";
	}
</script>

<input
	type="tel"
	class={styles}
	placeholder={focused ? "" : placeholder}
	id={inputID}
	name={inputName}
	required={req}
	readonly={readonly}
	on:click
	bind:this={inputEl}
	on:focus={onFocus}
	on:blur={onBlur}
	on:input={onInput}
	on:keydown={onKeyDown}
	on:paste={onPaste}
/>
