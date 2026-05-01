import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Création d'icônes Emoji ultra-fiables (DivIcon)
const createEmojiIcon = (emoji) => L.divIcon({
  html: `<div style="font-size: 26px; display: flex; justify-content: center; align-items: center; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">${emoji}</div>`,
  className: 'custom-marker',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const icons = {
  Musée: createEmojiIcon('🏛️'),
  Nature: createEmojiIcon('🌳'),
  Culture: createEmojiIcon('🏰'),
  default: createEmojiIcon('📍')
};

export default function MapResults({ destinations }) {
  const center = [50.4674, 4.8719]; // Namur

  const getIcon = (category) => {
    if (!category) return icons.default;
    const cat = category.toLowerCase();
    if (cat.includes('musée')) return icons.Musée;
    if (cat.includes('nature') || cat.includes('pierre')) return icons.Nature;
    if (cat.includes('culture') || cat.includes('armée')) return icons.Culture;
    return icons.default;
  };

  return (
    <div className="h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 mb-12 relative">
      <MapContainer
        center={center}
        zoom={8}
        scrollWheelZoom={true} // <-- ZOOM ROULETTE ACTIVÉ
        style={{ height: '100%', width: '100%', zIndex: 10 }}
      >
        <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {destinations.map((city) => (
          <Marker
            key={city.id}
            position={[city.coordinates.lat, city.coordinates.lng]}
            icon={getIcon(city.category)}
          >
            {/* Correction du texte du Popup : on force la couleur pour éviter le blanc sur blanc */}
            <Popup minWidth={150}>
                <div className="text-slate-900 text-center p-1">
                    <div className="font-bold text-sm leading-tight mb-1">{city.name}</div>
                    <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wide">
                        {city.category}
                    </div>
                    <div className="text-[10px] mt-1 text-slate-500 italic">
                        Match: {city.match_score}%
                    </div>
                </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
