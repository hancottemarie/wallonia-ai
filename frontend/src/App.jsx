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
      alert("Lance ton serveur Python (uvicorn) !");
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

      {/* Petit message de chargement sympa */}
      {loading && (
        <div className="text-center mt-12 animate-pulse text-blue-600 font-bold">
          L'IA explore la Wallonie pour vous... 🏰
        </div>
      )}

      <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {results.map((city) => (
          <div key={city.id} className="group bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">

            <div className="bg-blue-600 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 inline-block m-4 rounded-full">
              {city.province}
            </div>

            <div className="px-6 pb-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                {city.name}
              </h3>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  Match: {city.match_score}%
                </span>
                <span className="text-xs text-slate-400">
                  {city.category}
                </span>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed italic border-l-2 border-blue-100 pl-4 py-1">
                {city.ai_description}
              </p>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400">
                BUDGET: {"$".repeat(city.budget_index || 1)}
              </span>
              <button className="text-blue-600 text-xs font-bold uppercase tracking-wider hover:underline">
                Explore →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div> // <-- La fermeture manquante était ici !
  );
}

export default App;
