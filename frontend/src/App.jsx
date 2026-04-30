import MapResults from './components/MapResults';
import axios from 'axios';
import { useState } from 'react';
import TravelForm from './components/TravelForm';

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/recommend', formData);
      setResults(response.data);
    } catch (error) {
      console.error("Erreur backend :", error);
      alert("Lance ton serveur Python !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Wallonia<span className="text-blue-600">.ai</span>
        </h1>
        <p className="text-slate-500 font-medium">Expert AI travel recommendations</p>
      </header>

      <TravelForm onSearch={handleSearch} />

      {/* Zone d'affichage des résultats */}
      <main className="max-w-5xl mx-auto mt-12 px-4">

        {loading && (
          <div className="text-center py-12 animate-pulse text-blue-600 font-bold">
            L'IA explore la Wallonie pour vous... 🏰
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            {/* 1. MESSAGE DE L'IA (Le "Chat") */}
            <div className="bg-blue-900 text-white p-6 rounded-2xl mb-8 shadow-lg border-l-8 border-blue-400 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🤖</span>
                <div>
                  <h3 className="font-bold text-lg mb-1">Analyse de l'expert terminée</h3>
                  <p className="text-blue-100 italic">
                    "Basé sur vos préférences, j'ai sélectionné 3 destinations qui capturent l'essence
                    {results[0].category === 'Culture' ? ' culturelle' : ' authentique'} de la Wallonie
                    tout en respectant votre budget. Voici votre itinéraire sur mesure :"
                  </p>
                </div>
              </div>
            </div>

            {/* 2. LA CARTE INTERACTIVE */}
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              📍 Localisation des pépites
            </h2>
            <MapResults destinations={results} />

            {/* 3. LA GRILLE DE CARTES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {results.map((city) => (
                <div key={city.id} className="group bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="bg-blue-600 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 inline-block m-4 rounded-full">
                    {city.province}
                  </div>
                  <div className="px-6 pb-6">
                    <h3 className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors flex items-center gap-2">
  						{/* On ajoute l'icône ici */}
  						<span>
    						{city.category.includes('Musée') ? '🏛️' :
							city.category.includes('Nature') ? '🌳' :
							city.category.includes('Aventure') ? '🧗' : '📍'}
						</span>
						{city.name}
					</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        Match: {city.match_score}%
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm italic border-l-2 border-blue-100 pl-4">
                      {city.ai_description}
                    </p>
                  </div>
                  <div className="px-6 py-4 bg-slate-50 flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                     <span className="text-slate-400">BUDGET: {"$".repeat(city.budget_index || 1)}</span>
                     <span className="text-blue-600">Détails →</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
