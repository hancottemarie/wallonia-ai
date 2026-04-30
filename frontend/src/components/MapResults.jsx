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
  const center = [50.4674, 4.8719]; // On centre sur Namur

  return (
    <div className="h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-8 border-white mb-12">
      <MapContainer center={center} zoom={8} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {destinations.map((city) => (
          <Marker
            key={city.id}
            position={[city.coordinates.lat, city.coordinates.lng]}
            icon={icons[city.category] || icons.default} // Sélection dynamique du logo
          >
			<Popup>
				<div className="text-center p-1">
					<div className="text-2xl mb-1">
						{city.category.includes('Musée') ? '🏛️' : '📍'}
					</div>
					<strong className="text-blue-900 text-lg block leading-tight">{city.name}</strong>
					<span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
						{city.category}
					</span>
					<div className="mt-2 py-1 px-2 bg-blue-50 rounded-lg text-blue-600 font-bold text-sm">
						SCORE: {city.match_score}%
					</div>
				</div>
			</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
