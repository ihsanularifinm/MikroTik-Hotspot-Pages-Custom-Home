document.addEventListener('DOMContentLoaded', () => {
	const themeToggleButton = document.getElementById('theme-toggle');
	if (!themeToggleButton) return;

	const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
	const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

	const applyTheme = () => {
		if (localStorage.getItem('color-theme') === 'dark' || !('color-theme' in localStorage)) {
			document.documentElement.classList.add('dark');
			if (themeToggleLightIcon) themeToggleLightIcon.classList.remove('hidden');
			if (themeToggleDarkIcon) themeToggleDarkIcon.classList.add('hidden');
		} else {
			document.documentElement.classList.remove('dark');
			if (themeToggleDarkIcon) themeToggleDarkIcon.classList.remove('hidden');
			if (themeToggleLightIcon) themeToggleLightIcon.classList.add('hidden');
		}
	};

	themeToggleButton.addEventListener('click', () => {
		const isDark = document.documentElement.classList.toggle('dark');
		localStorage.setItem('color-theme', isDark ? 'dark' : 'light');

		if (themeToggleDarkIcon) themeToggleDarkIcon.classList.toggle('hidden');
		if (themeToggleLightIcon) themeToggleLightIcon.classList.toggle('hidden');
	});

	applyTheme();
});
