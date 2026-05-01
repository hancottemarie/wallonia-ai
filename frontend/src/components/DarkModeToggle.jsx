import { useState, useEffect } from 'react';

export default function DarkModeToggle() {
	// 1. On initialise en vérifiant si le mode sombre est déjà actif
	const [isDark, setIsDark] = useState(() => {
		return document.documentElement.classList.contains('dark');
	});

	useEffect(() => {
		const root = window.document.documentElement;

		if (isDark) {
			root.classList.add('dark');
			root.setAttribute('data-theme', 'dark'); // Optionnel pour certains plugins
			root.style.colorScheme = 'dark';
		} else {
			root.classList.remove('dark');
			root.setAttribute('data-theme', 'light');
			root.style.colorScheme = 'light';
		}
	}, [isDark]);

	return (
		<button
			onClick={() => setIsDark(!isDark)}
			className="fixed top-6 right-6 z-[100] p-4 rounded-2xl shadow-2xl
                 bg-white dark:bg-slate-800 text-2xl hover:scale-110
                 active:scale-95 transition-all duration-300 border-2
                 border-slate-200 dark:border-slate-700 cursor-pointer"
		>
			{/* Si isDark est vrai, on montre le soleil pour repasser en clair */}
			{isDark ? '☀️' : '🌙'}
		</button>
	);
}
