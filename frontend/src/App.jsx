import MapResults from './components/MapResults';
import axios from 'axios';
import { useState } from 'react';
import TravelForm from './components/TravelForm';
import DarkModeToggle from './components/DarkModeToggle';
import { exportToPDF } from './utils/exportPdf';

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

    // [CONFIG] Capteurs pour le Drag & Drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleSearch = async (formData) => {
        setLoading(true);
        try {
            const payload = { ...formData, search_query: searchQuery };
            const response = await axios.post('http://127.0.0.1:8000/recommend', payload);

            // [SÉCURITÉ ID] : On s'assure que chaque résultat a un ID unique
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

    // [LOGIQUE] Gestion de la fin du déplacement
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

            {/* ZONE PRINCIPALE */}
            <div className={`transition-all duration-500 ease-in-out flex-1 ${isPanelOpen ? 'mr-[30%] opacity-50 scale-[0.98] pointer-events-none' : 'mr-0'}`}>

                <DarkModeToggle />

                <button
                    onClick={() => setIsPanelOpen(!isPanelOpen)}
                    className="fixed top-20 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
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

                <main className="max-w-5xl mx-auto mt-12 px-4">
                    {loading ? (
                         <div className="text-center py-20 animate-pulse text-blue-600 font-bold">L'IA explore la Wallonie...</div>
                    ) : (
                        results.length > 0 && (
                            <>
                                <div className="mb-12"><MapResults destinations={results} /></div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
                                    {results.map((city) => (
                                        <div key={city.id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-800">
                                            <div className="h-40 bg-slate-200">
                                                <img src={city.image_url} className="w-full h-full object-cover" alt={city.name} />
                                            </div>
                                            <div className="p-6">
                                                <h3 className="font-bold mb-2">{city.name}</h3>
                                                <button onClick={() => addToItinerary(city)} className="w-full bg-blue-600 text-white py-2 rounded-xl text-xs font-bold">
                                                    + Ajouter au plan
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )
                    )}
                </main>
            </div>

            {/* [PANNEAU LATÉRAL] : Intégration du DndContext ici */}
            <aside className={`fixed right-0 top-0 h-full bg-white dark:bg-slate-900 z-50 shadow-2xl transition-all duration-500 flex flex-col ${isPanelOpen ? 'w-[30%]' : 'w-0 overflow-hidden'}`}>
                <div className="p-8 flex-1 overflow-y-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black">Mon <span className="text-blue-600">Roadtrip</span></h2>
                        <button onClick={() => setIsPanelOpen(false)}>✕</button>
                    </div>

                    {itinerary.length === 0 ? (
                        <p className="text-slate-400 text-center py-10">Votre sac est vide 🎒</p>
                    ) : (
                        // WRAPPER DRAG & DROP
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={itinerary.map(i => i.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-4">
                                    {itinerary.map((item, index) => (
                                        <SortableItem
                                            key={item.id}
                                            id={item.id}
                                            city={item}
                                            index={index}
                                            onRemove={removeFromItinerary}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </div>

                {itinerary.length > 0 && (
                    <div className="p-8 border-t border-slate-100 dark:border-slate-800">
                        <button onClick={() => exportToPDF(itinerary)} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold">
                            📄 EXPORTER LE PDF
                        </button>
                    </div>
                )}
            </aside>
        </div>
    );
}

export default App;
