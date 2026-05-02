import React, { useState, useEffect } from 'react';

const CityDetailDrawer = ({ city, isOpen, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (city && isOpen) {
      setLoading(true);
      setDetails(null);
      const cityNameEncoded = encodeURIComponent(city.name);

      fetch(`http://localhost:8000/city-details/${cityNameEncoded}?weather=${city.weather.condition}`)
        .then((res) => res.json())
        .then((data) => {
          setDetails(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Erreur détails IA:", err);
          setLoading(false);
        });
    }
  }, [city, isOpen]);

  // FONCTION DE SÉCURITÉ : Empêche React de planter si l'IA envoie un objet au lieu d'un texte
  const renderText = (value) => {
    if (typeof value === 'string' || typeof value === 'number') return value;
    if (typeof value === 'object' && value !== null) {
      // Si c'est un objet (comme celui de l'erreur), on essaie d'afficher ses propriétés textuelles
      return value.nom || value.lieu || value.name || value.description || "";
    }
    return "";
  };

  if (!city) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-full md:w-[450px] bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Header Photo avec fallback */}
        <div className="p-8 pt-10 h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar">
          <img
            src={`https://images.unsplash.com/photo-1588665555428-f685c4907481?auto=format&fit=crop&w=800&q=80&sig=${encodeURIComponent(city.name)}`}
            className="w-full h-full object-cover transition-opacity duration-700"
            alt={city.name}
            loading="lazy"
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = city.image_url;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/30 hover:bg-black/60 backdrop-blur-md p-2.5 rounded-full text-white transition-all z-10">✕</button>

          <div className="absolute bottom-8 left-8 right-8 text-white">
            <span className="bg-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">{city.province}</span>
            <h2 className="text-4xl font-black leading-tight drop-shadow-lg">{city.name}</h2>
          </div>
        </div>

        <div className="p-8 pt-10 h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Intro */}
              <section>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed italic border-l-4 border-blue-500 pl-4">
                  "{renderText(details?.intro_blog)}"
                </p>
              </section>

              {/* Météo */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl flex items-start gap-4 border border-blue-100 dark:border-blue-800">
                <span className="text-2xl mt-1">💡</span>
                <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
                  <span className="font-bold">Conseil :</span> {renderText(details?.meteo_conseil)}
                </p>
              </div>

              {/* Restaurants / Adresses */}
              <div>
                <h3 className="text-xl font-bold mb-5 text-slate-800 dark:text-white">🍴 Bonnes adresses</h3>
                <div className="space-y-4">
                  {details?.top_restos?.map((resto, i) => (
                    <div
                        key={i}
                        className="p-4 mb-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
                    >
                        <p className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {resto.nom || resto.name || "Établissement recommandé"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {resto.description || resto.specialite || ""}
                        </p>
                        {(resto.comment || resto.ambiance) && (
                        <p className="text-[11px] text-blue-500 dark:text-blue-400 italic mt-2 flex items-center gap-1">
                            <span>✨</span> {resto.comment || resto.ambiance}
                        </p>
                        )}
                    </div>
                    ))}
                </div>
              </div>

              {/* Secret Spot */}
              <div className="pb-10">
                <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">🕵️ Secret des Locaux</h3>
                <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    {renderText(details?.secret_spot)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CityDetailDrawer;
