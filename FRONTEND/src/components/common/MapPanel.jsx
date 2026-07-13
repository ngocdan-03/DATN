import React, { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";

import PostCard from "../user/home/PostCard"; // <-- đúng đường dẫn tới PostCard

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

function FitBounds({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (!coords || coords.length === 0) return;
    const bounds = L.latLngBounds(coords);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [coords, map]);
  return null;
}

export default function MapPanel({ open = false, onClose = () => {}, items = [] }) {
  // hooks must run unconditionally at top
  const markers = useMemo(
    () =>
      items
        .filter((it) => it.latitude && it.longitude)
        .map((it) => ({
          id: it.id,
          lat: it.latitude,
          lng: it.longitude,
          item: it, // keep full item to render PostCard
        })),
    [items]
  );

  const center = markers.length ? [markers[0].lat, markers[0].lng] : [16.0544, 108.2022];

  if (!open) return null;

  return (
    <aside className="sticky top-24 h-[calc(100vh-8rem)] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-[#041627]">Bản đồ</h3>
        <button
          onClick={onClose}
          className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Đóng
        </button>
      </div>

      <div className="h-[calc(100%-57px)]">
        <MapContainer center={center} zoom={13} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <FitBounds coords={markers.map((m) => [m.lat, m.lng])} />
          {markers.map((m) => (
            <Marker key={m.id} position={[m.lat, m.lng]}>
              <Popup minWidth={260}>
                <div className="p-1">
                  <PostCard item={m.item} />
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </aside>
  );
}