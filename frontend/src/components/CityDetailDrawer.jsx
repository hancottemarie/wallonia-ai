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

  // LE BOUCLIER : Extrait du texte peu importe la structure de l'objet
  const renderText = (value) => {
    if (!value) return "";
    if (typeof value === 'string' || typeof value === 'number') return value;
    if (typeof value === 'object') {
      // Cherche n'importe quelle clé contenant du texte
      return value.description || value.texte || value.contenu || value.lieu || value.nom || "";
    }
    return "";
  };

  if (!city) return null;

  return (
    <>
	  <div className={`fixed inset-y-0 left-0 z-50 w-full md:w-[450px] bg-white dark:bg-slate-900 shadow-2xl
		  transform transition-transform duration-500 ease-in-out
		  ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
	>
        {/* HEADER PHOTO : Utilisation d'un service différent pour éviter le blocage CORS */}
        <div className="relative h-80 w-full overflow-hidden bg-slate-200">
          <img
            src={`https://loremflickr.com/800/600/${encodeURIComponent(city.name)},belgium/all`}
            className="w-full h-full object-cover transition-opacity duration-700"
            alt={city.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = city.image_url;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/30 hover:bg-black/60 backdrop-blur-md p-2.5 rounded-full text-white transition-all z-10">✕</button>

          <div className="absolute bottom-8 left-8 right-8 text-white">
            <span className="bg-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">
              {city.province}
            </span>
            <h2 className="text-4xl font-black leading-tight drop-shadow-lg">{city.name}</h2>
          </div>
        </div>

        <div className="p-8 pt-10 h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* INTRO */}
              {details?.intro_blog && (
                <section>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed italic border-l-4 border-blue-500 pl-4">
                    "{renderText(details.intro_blog)}"
                  </p>
                </section>
              )}

              {/* CONSEIL : Détection multi-clés pour éviter le vide de image_a2a61c.png */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl flex items-start gap-4 border border-blue-100 dark:border-blue-800">
                <span className="text-2xl mt-1">💡</span>
                <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
                  <span className="font-bold">Conseil :</span> {renderText(details?.meteo_conseil || details?.conseil || details?.astuce)}
                </p>
              </div>

              {/* RESTAURANTS */}
              <div>
                <h3 className="text-xl font-bold mb-5 text-slate-800 dark:text-white flex items-center gap-2">
                  <span>🍴</span> Bonnes adresses
                </h3>
                <div className="space-y-4">
                  {details?.top_restos?.map((resto, i) => (
                    <div key={i} className="p-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all group">
                      <p className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {renderText(resto.nom || resto.name || resto.lieu)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {renderText(resto.description || resto.specialite)}
                      </p>
                      {(resto.adresse || resto.comment || resto.ambiance) && (
                        <p className="text-[11px] text-blue-500 dark:text-blue-400 italic mt-2 flex items-center gap-1">
                          <span>📍</span> {renderText(resto.adresse || resto.comment || resto.ambiance)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* SECRET SPOT */}
              {details?.secret_spot && (
                <div className="pb-10">
                  <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
                    <span>🕵️</span> Secret des Locaux
                  </h3>
                  <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                      {renderText(details.secret_spot)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CityDetailDrawer;
