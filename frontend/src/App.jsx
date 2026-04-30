import axios from 'axios';
import { useState } from 'react';
import TravelForm from './components/TravelForm';

function App() {
  const [results, setResults] = useState([]); // Pour stocker les villes reçues
  const [loading, setLoading] = useState(false);

  const handleSearch = async (formData) => {
    setLoading(true);
    try {
      // On envoie les infos au serveur Python (port 8000 par défaut)
      const response = await axios.post('http://127.0.0.1:8000/recommend', formData);
      setResults(response.data);
      console.log("Résultats de la Wallonie :", response.data);
    } catch (error) {
      console.error("Erreur lors de la connexion au backend :", error);
      alert("N'oublie pas de lancer ton serveur Python (uvicorn) !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900">Wallonia.ai</h1>
        <p className="text-slate-500">Expert AI travel recommendations</p>
      </header>

      <TravelForm onSearch={handleSearch} />

      {/* Zone de résultats (on l'améliorera après) */}
      <div className="max-w-4xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {results.map((city) => (
          <div key={city.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800">{city.name}</h3>
            <p className="text-sm text-blue-600 font-semibold mb-2">{city.province} - Score: {city.match_score}</p>
            <p className="text-slate-600 italic">"{city.ai_description}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
