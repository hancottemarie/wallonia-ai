import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// On définit nos icônes personnalisées (logos indicateurs)
const icons = {
  Musée: new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2237/2237920.png', // Icône de musée
    iconSize: [35, 35],
    iconAnchor: [17, 35],
  }),
  Nature: new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/628/628283.png', // Icône d'arbre
    iconSize: [35, 35],
    iconAnchor: [17, 35],
  }),
  default: new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Icône de pin classique
    iconSize: [35, 35],
    iconAnchor: [17, 35],
  })
};

export default function MapResults({ destinations }) {
  const center = [50.4674, 4.8719];

  const getDestinationIcon = (category) => {
    if (!category) return icons.default;

    const cat = category.toLowerCase();

    if (cat.includes('musée') || cat.includes('culture')) return icons.Musée;
    if (cat.includes('nature') || cat.includes('parc') || cat.includes('forêt')) return icons.Nature;

    return icons.default;
  };

  return (
    <div className="h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800 mb-12 transition-colors">
      <MapContainer center={center} zoom={8} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {destinations.map((city) => (
          <Marker
            key={city.id}
            position={[city.coordinates.lat, city.coordinates.lng]}
            // Utilisation de la nouvelle fonction
            icon={getDestinationIcon(city.category)}
          >
            <Popup>
                {/* ... ton code Popup reste identique */}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
