import React, { useState, useEffect } from 'react';

const CityDetailDrawer = ({ city, isOpen, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // Charger les données de l'IA quand on sélectionne une ville
  useEffect(() => {
    if (city && isOpen) {
      setLoading(true);
      // Appel à ta nouvelle route FastAPI
      fetch(`http://localhost:8000/city-details/${city.name}?weather=${city.weather.condition}`)
        .then(res => res.json())
        .then(data => {
          setDetails(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [city, isOpen]);

  if (!city) return null;

  return (
    <>
      {/* Overlay de fond */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />
      )}

      {/* Le Tiroir (Drawer) */}
      <div className={`fixed inset-y-0 left-0 z-50 w-full md:w-[450px] bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Header avec Photo Dynamique */}
        <div className="relative h-72 w-full overflow-hidden">
          <img
            src={`https://source.unsplash.com/800x600/?${city.name},landmark,architecture`}
            className="w-full h-full object-cover"
            alt={city.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-colors">
            ✕
          </button>
          <div className="absolute bottom-6 left-6 text-white">
            <h2 className="text-4xl font-bold">{city.name}</h2>
            <p className="text-blue-300 font-medium">Province de {city.province}</p>
          </div>
        </div>

        <div className="p-6 h-[calc(100vh-288px)] overflow-y-auto custom-scrollbar">

          {loading ? (
            /* --- POINT 4 : SKELETON LOADER --- */
            <div className="animate-pulse space-y-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              </div>
            </div>
          ) : (
            /* --- CONTENU GÉNÉRÉ PAR L'IA --- */
            <div className="space-y-8">
              {/* Intro Style Blog */}
              <section>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  "{details?.intro_blog}"
                </p>
              </section>

              {/* Météo Contextuelle */}
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-2xl flex items-center gap-4 border border-blue-100 dark:border-blue-800">
                <span className="text-3xl">💡</span>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <span className="font-bold">Le conseil du jour :</span> {details?.meteo_conseil}
                </p>
              </div>

              {/* Recommendations */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    🍴 Bonnes adresses
                  </h3>
                  <div className="space-y-3">
                    {details?.top_restos?.map((resto, i) => (
                      <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-yellow-500">
                        <p className="font-bold text-gray-900 dark:text-white">{resto.nom}</p>
                        <p className="text-xs text-gray-500">{resto.specialite} • {resto.ambiance}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    🕵️ Le Secret des Locaux
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900">
                    {details?.secret_spot}
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
