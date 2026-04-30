import MapResults from './components/MapResults';
import axios from 'axios';
import { useState } from 'react';
import TravelForm from './components/TravelForm';
import DarkModeToggle from './components/DarkModeToggle';

function App() {
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = async (formData) => {
		setLoading(true);
		try {
			const payload = { ...formData, search_query: searchQuery };
			const response = await axios.post('http://127.0.0.1:8000/recommend', payload);
			setResults(response.data);
		} catch (error) {
			console.error("Erreur Backend:", error);
			alert("Vérifie que ton serveur Python tourne sur le port 8000 !");
		} finally {
			setLoading(false);
		}
	};

	return (

		<div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
			<DarkModeToggle />

			<header className="text-center mb-10">
				<h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
					Wallonia<span className="text-blue-600">.ai</span>
				</h1>
				<p className="text-slate-500 dark:text-slate-400 font-medium mt-2 transition-colors">Expert AI travel recommendations</p>
			</header>

			{/* BARRE DE RECHERCHE */}
			<div className="max-w-md mx-auto mb-6 relative px-4">
				<input
					type="text"
					placeholder="Chercher une ville..."
					className="w-full px-6 py-4 rounded-2xl border-none shadow-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<span className="absolute right-8 top-4 opacity-30 text-xl dark:opacity-50">🔍</span>
			</div>

			<TravelForm onSearch={handleSearch} />

			<main className="max-w-5xl mx-auto mt-12 px-4">
				{loading && (
					<div className="text-center py-20">
						<div className="animate-bounce text-4xl mb-4">🏰</div>
						<div className="animate-pulse text-blue-600 dark:text-blue-400 font-bold text-xl">
							L'IA explore la Wallonie pour vous...
						</div>
					</div>
				)}

				{!loading && results.length > 0 && (
					<div className="animate-in fade-in duration-1000">
						{/* MESSAGE DE L'IA */}
						<div className="bg-slate-900 dark:bg-blue-950 text-white p-8 rounded-3xl mb-10 shadow-2xl border-b-4 border-blue-500 transition-colors">
							<div className="flex items-center gap-6">
								<span className="text-5xl">🤖</span>
								<div>
									<h3 className="font-bold text-xl mb-1 text-blue-400">Analyse de l'expert terminée</h3>
									<p className="text-slate-300 dark:text-blue-200 italic text-lg leading-relaxed">
										"Basé sur vos préférences, j'ai sélectionné {results.length} destinations pépites..."
									</p>
								</div>
							</div>
						</div>

						{/* SECTION CARTE */}
						<div className="mb-12">
							<h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3">
								<span className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg text-lg">📍</span> Localisation
							</h2>
							<MapResults destinations={results} />
						</div>

						{/* GRILLE DES RÉSULTATS */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
							{results.map((city) => (
								<div key={city.id} className="group bg-white dark:bg-slate-900 rounded-3xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">

									<div className="h-48 w-full overflow-hidden relative">
										<img
											src={city.image_url || "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff"}
											className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
											alt={city.name}
										/>
										<div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
											{city.province}
										</div>
									</div>

									<div className="p-6">
										<h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-2 transition-colors">
											<span>{city.category.includes('Musée') ? '🏛️' : '🌳'}</span>
											{city.name}
										</h3>

										<div className="inline-block bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded mb-4">
											Match: {city.match_score}%
										</div>

										<p className="text-slate-600 dark:text-slate-400 text-sm italic leading-relaxed line-clamp-3">
											"{city.ai_description}"
										</p>
									</div>

									<div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center transition-colors">
										<span className="text-xs font-black text-slate-400 dark:text-slate-500 tracking-tighter">
											BUDGET: {"$".repeat(city.budget_index || 1)}
										</span>
										<button className="text-blue-600 dark:text-blue-400 font-bold text-xs hover:underline uppercase transition-colors">
											Explorer →
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</main>
		</div>
	);
}

export default App;
