import { useState, useEffect } from 'react';

export default function DarkModeToggle() {
	// On récupère la préférence au chargement
	const [darkMode, setDarkMode] = useState(() => {
		return localStorage.getItem('theme') === 'dark';
	});

	useEffect(() => {
		const root = window.document.documentElement;
		console.log("Classe avant :", root.className); // Debug
		if (darkMode) {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}
		console.log("Classe après :", root.className); // Debug
	}, [darkMode]);

	return (
		<button
			onClick={() => setDarkMode(!darkMode)}
			className="fixed top-6 right-6 z-[100] p-3 rounded-2xl shadow-2xl
                 bg-white text-slate-800 border border-slate-200
                 dark:bg-slate-800 dark:text-yellow-400 dark:border-slate-700
                 hover:scale-110 active:scale-95 transition-all duration-300"
			title={darkMode ? "Passer au mode clair" : "Passer au mode sombre"}
		>
			<div className="text-2xl flex items-center justify-center w-8 h-8">
				{darkMode ? (
					/* Soleil pour le mode sombre (pour revenir au clair) */
					<span>☀️</span>
				) : (
					/* Lune pour le mode clair (pour passer au sombre) */
					<span>🌙</span>
				)}
			</div>
		</button>
	);
}
