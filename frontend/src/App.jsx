import MapResults from './components/MapResults';
import axios from 'axios';
import { useState } from 'react';
import TravelForm from './components/TravelForm';
import DarkModeToggle from './components/DarkModeToggle';
import { exportToPDF } from './utils/exportPdf';

function App() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // [MODIF] : États pour le panneau latéral et l'itinéraire
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [itinerary, setItinerary] = useState([]);

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

    // [MODIF] : Fonction pour ajouter à l'itinéraire (en attendant le drag & drop)
    const addToItinerary = (city) => {
        if (!itinerary.find(item => item.id === city.id)) {
            setItinerary([...itinerary, city]);
            setIsPanelOpen(true); // Ouvre le panneau automatiquement à l'ajout
        }
    };

    return (
        // [MODIF] : Ajout de "flex" et "overflow-x-hidden" pour gérer le slide
        <div className="flex min-h-screen w-full transition-colors duration-500 bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-white overflow-x-hidden">

            {/* ZONE PRINCIPALE : Elle rétrécit quand le panneau est ouvert */}
            <div className={`transition-all duration-500 ease-in-out flex-1 ${isPanelOpen ? 'mr-[30%] opacity-50 scale-[0.98] pointer-events-none' : 'mr-0'}`}>

                <DarkModeToggle />

                {/* BOUTON FLOTTANT POUR OUVRIR LE PANNEAU */}
                <button
                    onClick={() => setIsPanelOpen(!isPanelOpen)}
                    className="fixed top-20 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
                >
                    {isPanelOpen ? '➡️' : '🎒'}
                </button>

                <header className="text-center mb-10 pt-10">
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
                        className="w-full px-6 py-4 rounded-2xl outline-none transition-all bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-lg focus:ring-2 focus:ring-blue-500"
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
                            <div className="p-8 rounded-3xl mb-10 shadow-xl border-b-4 border-blue-500 bg-white dark:bg-blue-950">
                                <div className="flex items-center gap-6">
                                    <span className="text-5xl">🤖</span>
                                    <div>
                                        <h3 className="font-bold text-xl mb-1 text-blue-600 dark:text-blue-400">Analyse terminée</h3>
                                        <p className="italic text-lg leading-relaxed">"Voici mes pépites pour votre voyage..."</p>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION CARTE */}
                            <div className="mb-12">
                                <MapResults destinations={results} />
                            </div>

                            {/* GRILLE DES RÉSULTATS */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 pb-20">
                                {results.map((city) => (
                                    <div key={city.id} className="group bg-white dark:bg-slate-900 rounded-3xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                                        <div className="h-48 w-full overflow-hidden relative">
                                            <img src={city.image_url || "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={city.name} />
                                            <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                                                {city.province}
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold mb-2">{city.name}</h3>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 italic">"{city.ai_description}"</p>
                                        </div>
                                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                                            {/* [MODIF] : Bouton pour ajouter au panneau latéral */}
                                            <button
                                                onClick={() => addToItinerary(city)}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                                            >
                                                + Ajouter au plan
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* [MODIF] : LE PANNEAU LATÉRAL (SLIDE OVER) */}
            <aside className={`fixed right-0 top-0 h-full bg-white dark:bg-slate-900 z-50 shadow-[-20px_0_50px_rgba(0,0,0,0.2)] transition-all duration-500 ease-in-out border-l border-slate-200 dark:border-slate-800 flex flex-col ${isPanelOpen ? 'w-[30%]' : 'w-0 overflow-hidden'}`}>
                <div className="p-8 flex-1 overflow-y-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black">Mon <span className="text-blue-600">Roadtrip</span></h2>
                        <button onClick={() => setIsPanelOpen(false)} className="text-2xl">✕</button>
                    </div>

                    {itinerary.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                            <p className="text-slate-400">Glissez ou ajoutez des pépites ici pour créer votre itinéraire 🎒</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {itinerary.map((item, index) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm">{item.name}</h4>
                                        <p className="text-[10px] text-slate-500">{item.province}</p>
                                    </div>
                                    <button onClick={() => setItinerary(itinerary.filter(i => i.id !== item.id))} className="text-red-400 text-xs">Retirer</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* BOUTON PDF DANS LE PANNEAU */}
                {itinerary.length > 0 && (
                    <div className="p-8 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                        <button
                            onClick={() => exportToPDF(itinerary)}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            <span>📄</span> EXPORTER LE ROADTRIP
                        </button>
                    </div>
                )}
            </aside>
        </div>
    );
}

export default App;
