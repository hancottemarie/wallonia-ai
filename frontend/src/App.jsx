import MapResults from './components/MapResults';
import axios from 'axios';
import { useState } from 'react';
import TravelForm from './components/TravelForm';
import DarkModeToggle from './components/DarkModeToggle';
import { exportToPDF } from './utils/exportPdf';
import CityDetailDrawer from './components/CityDetailDrawer';

// Imports D&D
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './components/SortableItem';

function App() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [itinerary, setItinerary] = useState([]);
    const [inspectedCity, setInspectedCity] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleSearch = async (formData) => {
        setLoading(true);
        try {
            const payload = { ...formData, search_query: searchQuery };
            const response = await axios.post('http://127.0.0.1:8000/recommend', payload);
            const dataWithIds = response.data.map((dest, index) => ({
                ...dest,
                id: dest.id || `city-${index}-${dest.name}`
            }));
            setResults(dataWithIds);
        } catch (error) {
            console.error("Erreur Backend:", error);
            alert("Vérifie ton serveur Python !");
        } finally {
            setLoading(false);
        }
    };

    function handleDragEnd(event) {
        const { active, over } = event;
        if (active.id !== over.id) {
            setItinerary((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    const addToItinerary = (city) => {
        if (!itinerary.find(item => item.id === city.id)) {
            setItinerary([...itinerary, city]);
            setIsPanelOpen(true);
        }
    };

    const removeFromItinerary = (id) => {
        setItinerary(itinerary.filter(item => item.id !== id));
    };

    return (
        <div className="flex min-h-screen w-full transition-colors duration-500 bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-white overflow-x-hidden">

            {/* [MENU GAUCHE] - City Details */}
            <CityDetailDrawer
                city={inspectedCity}
                isOpen={!!inspectedCity}
                onClose={() => setInspectedCity(null)}
            />

            {/* ZONE PRINCIPALE - Gère le slide bilatéral */}
            <div className={`transition-all duration-500 ease-in-out flex-1 flex flex-col
                ${isPanelOpen ? 'mr-[30%] opacity-50 scale-[0.98] pointer-events-none' : 'mr-0'}
                ${inspectedCity ? 'ml-[450px]' : 'ml-0'}`}
            >

                <DarkModeToggle />

                {/* Bouton Sac à dos - Se déplace si le menu de gauche est ouvert */}
                <button
                    onClick={() => setIsPanelOpen(!isPanelOpen)}
                    className={`fixed top-20 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-500
                    ${inspectedCity ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                    {isPanelOpen ? '➡️' : '🎒'}
                </button>

                <header className="text-center mb-10 pt-10">
                    <h1 className="text-5xl font-black tracking-tight">Wallonia<span className="text-blue-600">.ai</span></h1>
                </header>

                <div className="max-w-md mx-auto mb-6 relative px-4 text-slate-900">
                    <input
                        type="text"
                        placeholder="Chercher une ville..."
                        className="w-full px-6 py-4 rounded-2xl outline-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <TravelForm onSearch={handleSearch} />

                <main className="max-w-5xl mx-auto mt-12 px-4 flex-1">
                    {loading ? (
                         <div className="text-center py-20 animate-pulse text-blue-600 font-bold">L'IA explore la Wallonie...</div>
                    ) : (
                        results.length > 0 && (
                            <>
                                <div className="mb-12"><MapResults destinations={results} /></div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
                                    {results.map((city) => (
                                        <div key={city.id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                            <div
                                                className="h-40 bg-slate-200 relative cursor-pointer group"
                                                onClick={() => setInspectedCity(city)}
                                            >
                                                <img src={city.image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={city.name} />
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="bg-white/90 text-black text-[10px] font-bold px-3 py-1.5 rounded-full shadow-xl">DÉCOUVRIR 🔍</span>
                                                </div>
                                                <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase">
                                                    {city.province}
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                {city.weather && (
                                                    <div className="flex items-center gap-2 mb-3 bg-blue-50/50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-800/50 w-full overflow-hidden">
                                                        <img src={`https://openweathermap.org/img/wn/${city.weather.icon}.png`} alt="weather icon" className="w-6 h-6 object-contain shrink-0" />
                                                        <span className="text-sm font-black text-blue-600 dark:text-blue-400 shrink-0">{city.weather.temp}°C</span>
                                                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 capitalize hidden sm:inline flex-1 truncate min-w-0">• {city.weather.desc}</span>
                                                    </div>
                                                )}
                                                <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">{city.name}</h3>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => addToItinerary(city)}
                                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-xs font-bold shadow-md hover:shadow-blue-500/20 transition-all active:scale-95"
                                                    >
                                                        + Ajouter 🎒
                                                    </button>
                                                    <button
                                                        onClick={() => setInspectedCity(city)}
                                                        className="px-4 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-slate-700 transition-all border border-blue-100 dark:border-slate-700"
                                                    >
                                                        ℹ️
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )
                    )}
                </main>
            </div>

            {/* [PANNEAU DROITE] - Sac à dos / Itinéraire */}
            <aside className={`fixed right-0 top-0 h-full bg-white dark:bg-slate-900 z-50 shadow-2xl transition-all duration-500 flex flex-col ${isPanelOpen ? 'w-[30%]' : 'w-0 overflow-hidden'}`}>
                <div className="p-8 flex-1 overflow-y-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black">Mon <span className="text-blue-600">Roadtrip</span></h2>
                        <button onClick={() => setIsPanelOpen(false)} className="text-2xl hover:rotate-90 transition-transform">✕</button>
                    </div>

                    {itinerary.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                             <p className="text-slate-400 text-center">Votre sac est vide 🎒</p>
                        </div>
                    ) : (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={itinerary.map(i => i.id)} strategy={verticalListSortingStrategy}>
                                <div className="space-y-4">
                                    {itinerary.map((item, index) => (
                                        <SortableItem key={item.id} id={item.id} city={item} index={index} onRemove={removeFromItinerary} />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </div>

                {itinerary.length > 0 && (
                    <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                        <button onClick={() => exportToPDF(itinerary)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
                            📄 EXPORTER LE RÉCIT (PDF)
                        </button>
                    </div>
                )}
            </aside>
        </div>
    );
}

export default App;
