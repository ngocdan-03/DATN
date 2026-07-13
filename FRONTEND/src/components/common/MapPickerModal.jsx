import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: icon,
    shadowUrl: iconShadow,
});

export default function MapPickerModal({ onSelect, onClose, initialLat, initialLng }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    const [searchText, setSearchText] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState(
        initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
    );
    const [selectedAddress, setSelectedAddress] = useState('');
    const [searching, setSearching] = useState(false);

    const provider = useRef(new OpenStreetMapProvider({
        params: { 'accept-language': 'vi', countrycodes: 'vn' },
    }));

    // Khởi tạo map 1 lần
    useEffect(() => {
        if (mapInstanceRef.current) return;

        const startCenter = selectedPosition
            ? [selectedPosition.lat, selectedPosition.lng]
            : [16.0471, 108.2068];

        const map = L.map(mapRef.current).setView(startCenter, 13);
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Nếu có vị trí ban đầu → đặt marker sẵn
        if (selectedPosition) {
            placeMarker(selectedPosition.lat, selectedPosition.lng);
        }

        // Click trên bản đồ → đặt marker tại vị trí đó
        map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            placeMarker(lat, lng);
            setSelectedAddress(''); // địa chỉ chưa biết, chỉ có toạ độ
        });

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    // Đặt / di chuyển marker, cho kéo thả
    const placeMarker = (lat, lng) => {
        const map = mapInstanceRef.current;

        if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
        } else {
            const marker = L.marker([lat, lng], { draggable: true }).addTo(map);

            marker.on('dragend', () => {
                const pos = marker.getLatLng();
                setSelectedPosition({ lat: pos.lat, lng: pos.lng });
                setSelectedAddress(''); // sau khi kéo thì địa chỉ không còn chính xác
            });

            markerRef.current = marker;
        }

        map.setView([lat, lng], 16);
        setSelectedPosition({ lat, lng });
    };

    // Gõ tìm kiếm — debounce
    useEffect(() => {
        if (!searchText.trim()) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            setSearching(true);
            try {
                const results = await provider.current.search({ query: searchText });
                setSuggestions(results.slice(0, 5));
            } catch (err) {
                console.error('Lỗi tìm kiếm địa chỉ:', err);
                setSuggestions([]);
            } finally {
                setSearching(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [searchText]);

    // Chọn 1 gợi ý từ danh sách
    const handleSelectSuggestion = (result) => {
        const lat = result.y;
        const lng = result.x;

        placeMarker(lat, lng);
        setSelectedAddress(result.label);
        setSearchText(result.label);
        setSuggestions([]);
    };

    // Xác nhận chọn vị trí
    const handleConfirm = () => {
        if (!selectedPosition) return;

        onSelect({
            latitude: selectedPosition.lat,
            longitude: selectedPosition.lng,
            address: selectedAddress || `${selectedPosition.lat.toFixed(6)}, ${selectedPosition.lng.toFixed(6)}`
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

                {/* Thanh tìm kiếm + nút đóng */}
                <div className="relative border-b border-slate-200 p-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Nhập địa chỉ để tìm vị trí..."
                            className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-600"
                        />
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Danh sách gợi ý */}
                    {(suggestions.length > 0 || searching) && (
                        <div className="absolute left-4 right-16 top-full z-[1100] mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                            {searching && (
                                <div className="px-4 py-3 text-sm text-slate-400">Đang tìm...</div>
                            )}
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => handleSelectSuggestion(s)}
                                    className="block w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-blue-50"
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bản đồ */}
                <div className="relative flex-1">
                    <div ref={mapRef} className="h-full w-full" />

                    {!selectedPosition && (
                        <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center">
                            <div className="rounded-full bg-black/70 px-4 py-1.5 text-xs font-medium text-white">
                                Tìm địa chỉ hoặc nhấn vào bản đồ để chọn vị trí
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer — hiển thị toạ độ + nút xác nhận */}
                <div className="flex items-center justify-between gap-4 border-t border-slate-200 p-4">
                    <div className="flex-1 text-sm">
                        {selectedPosition ? (
                            <>
                                <p className="font-semibold text-slate-900">
                                    {selectedAddress || 'Vị trí đã chọn'}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
                                </p>
                            </>
                        ) : (
                            <p className="text-slate-400">Chưa chọn vị trí</p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!selectedPosition}
                        className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        Xác nhận vị trí
                    </button>
                </div>
            </div>
        </div>
    );
}