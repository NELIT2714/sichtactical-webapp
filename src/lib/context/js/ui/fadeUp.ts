export function fadeUp(node: HTMLElement, options?: { delayStep?: number }) {
	const delayStep = options?.delayStep ?? 1000;

	const children = Array.from(node.children) as HTMLElement[];

	children.forEach((child, i) => {
		child.classList.add('animate-fade-up');
		child.style.animationDelay = `${i * delayStep}ms`;
	});

	return {
		destroy() {
			children.forEach((child) => {
				child.classList.remove('animate-fade-up');
				child.style.animationDelay = '';
			});
		},
	};
}
