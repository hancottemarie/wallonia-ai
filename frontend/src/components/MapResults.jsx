import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix pour les icônes par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapResults({ destinations }) {
  const center = [50.5010, 4.4768]; // Centre de la Belgique

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-inner border-4 border-white mb-12">
      <MapContainer center={center} zoom={8} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {destinations.map((city) => (
          <Marker key={city.id} position={[city.coordinates.lat, city.coordinates.lng]}>
            <Popup>
              <div className="font-bold">{city.name}</div>
              <div className="text-xs">{city.category}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
