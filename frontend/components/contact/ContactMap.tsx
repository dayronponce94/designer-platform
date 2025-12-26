'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { FiMapPin, FiGlobe, FiMessageSquare } from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para iconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
    iconUrl: '/leaflet/images/marker-icon.png',
    shadowUrl: '/leaflet/images/marker-shadow.png',
});

// Definición de países por idioma (excluyendo Estados Unidos)
const countriesByLanguage = {
    español: [
        { name: 'España', capital: 'Madrid', coordinates: [40.4168, -3.7038], flag: '🇪🇸', color: '#FF6B6B' },
        { name: 'México', capital: 'Ciudad de México', coordinates: [19.4326, -99.1332], flag: '🇲🇽', color: '#4ECDC4' },
        { name: 'Colombia', capital: 'Bogotá', coordinates: [4.7110, -74.0721], flag: '🇨🇴', color: '#45B7D1' },
        { name: 'Argentina', capital: 'Buenos Aires', coordinates: [-34.6037, -58.3816], flag: '🇦🇷', color: '#96CEB4' },
        { name: 'Perú', capital: 'Lima', coordinates: [-12.0464, -77.0428], flag: '🇵🇪', color: '#FFEAA7' },
        { name: 'Chile', capital: 'Santiago', coordinates: [-33.4489, -70.6693], flag: '🇨🇱', color: '#DDA0DD' },
        { name: 'Cuba', capital: 'La Habana', coordinates: [23.1136, -82.3666], flag: '🇨🇺', color: '#98D8C8' },
    ],
    portugués: [
        { name: 'Portugal', capital: 'Lisboa', coordinates: [38.7223, -9.1393], flag: '🇵🇹', color: '#FFD166' },
        { name: 'Brasil', capital: 'Brasilia', coordinates: [-15.7801, -47.9292], flag: '🇧🇷', color: '#06D6A0' },
        { name: 'Angola', capital: 'Luanda', coordinates: [-8.8390, 13.2894], flag: '🇦🇴', color: '#118AB2' },
        { name: 'Mozambique', capital: 'Maputo', coordinates: [-25.9692, 32.5732], flag: '🇲🇿', color: '#EF476F' },
    ],
    inglés: [
        { name: 'Reino Unido', capital: 'Londres', coordinates: [51.5074, -0.1278], flag: '🇬🇧', color: '#7209B7' },
        { name: 'Canadá', capital: 'Ottawa', coordinates: [45.4215, -75.6972], flag: '🇨🇦', color: '#3A86FF' },
        { name: 'Australia', capital: 'Canberra', coordinates: [-35.2809, 149.1300], flag: '🇦🇺', color: '#FF006E' },
        { name: 'Nueva Zelanda', capital: 'Wellington', coordinates: [-41.2865, 174.7762], flag: '🇳🇿', color: '#8338EC' },
        { name: 'Irlanda', capital: 'Dublín', coordinates: [53.3498, -6.2603], flag: '🇮🇪', color: '#FFBE0B' },
        { name: 'Sudáfrica', capital: 'Pretoria', coordinates: [-25.7479, 28.2293], flag: '🇿🇦', color: '#FB5607' },
    ]
};

// Configuración del mapa
const DEFAULT_CENTER: [number, number] = [20, 0];
const DEFAULT_ZOOM = 2;
const MAP_HEIGHT = '600px';

export default function ContactMap() {
    const [mounted, setMounted] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<'español' | 'portugués' | 'inglés'>('español');
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const customIcon = (color: string) => {
        return L.divIcon({
            className: 'custom-marker',
            html: `
        <div style="
          background: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          transform: translate(-50%, -50%);
          transition: all 0.3s ease;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
          </svg>
        </div>
      `,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
        });
    };

    const getCountryCount = (language: keyof typeof countriesByLanguage) => {
        return countriesByLanguage[language].length;
    };

    if (!mounted) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 h-full">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
                    <div className="h-[400px] bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 h-full">
            {/* Cabecera */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                    <FiGlobe className="mr-3 text-blue-600" />
                    Nuestra Comunidad Global
                </h2>
                <p className="text-gray-600">
                    Servimos a clientes en todo el mundo. Selecciona un idioma para ver los países donde trabajamos.
                </p>
            </div>

            {/* Selector de idioma */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {Object.entries(countriesByLanguage).map(([language, countries]) => (
                    <button
                        key={language}
                        onClick={() => setSelectedLanguage(language as keyof typeof countriesByLanguage)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${selectedLanguage === language
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <div className="font-bold text-gray-900 capitalize">{language}</div>
                                <div className="text-sm text-gray-600">{getCountryCount(language as keyof typeof countriesByLanguage)} países</div>
                            </div>
                            <div className="text-2xl">
                                {language === 'español' ? '🇪🇸' : language === 'portugués' ? '🇵🇹' : '🇬🇧'}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Mapa */}
            <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 mb-6">
                <div style={{ height: MAP_HEIGHT, width: '100%' }}>
                    <MapContainer
                        center={DEFAULT_CENTER}
                        zoom={DEFAULT_ZOOM}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                        className="rounded-lg"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* Marcadores para el idioma seleccionado */}
                        {countriesByLanguage[selectedLanguage].map((country) => (
                            <Marker
                                key={country.name}
                                position={country.coordinates as [number, number]}
                                icon={customIcon(country.color)}
                                eventHandlers={{
                                    mouseover: () => setHoveredCountry(country.name),
                                    mouseout: () => setHoveredCountry(null),
                                }}
                            >
                                <Popup className="custom-popup">
                                    <div className="p-2 min-w-[200px]">
                                        <div className="flex items-center mb-3">
                                            <span className="text-2xl mr-3">{country.flag}</span>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg">{country.name}</h3>
                                                <p className="text-gray-600">{country.capital}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <FiMessageSquare className="text-blue-500 mr-2" />
                                                <span className="text-gray-700">Idioma principal: <strong>{selectedLanguage}</strong></span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Horario aproximado: {country.coordinates[1] > 0 ? 'GMT+' : 'GMT'}{Math.floor(country.coordinates[1] / 15)}
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-gray-200">
                                            <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                                Ver clientes en {country.name}
                                            </button>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {/* Leyenda del mapa */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
                    <div className="flex items-center mb-2">
                        <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm font-medium">Países de habla {selectedLanguage}</span>
                    </div>
                    <p className="text-xs text-gray-600">
                        Haz click en cualquier marcador para ver más detalles sobre el país.
                    </p>
                </div>
            </div>

            {/* Lista de países */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Países seleccionados ({selectedLanguage})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {countriesByLanguage[selectedLanguage].map((country) => (
                        <div
                            key={country.name}
                            className={`flex items-center p-3 rounded-lg border transition-all cursor-pointer ${hoveredCountry === country.name
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                            onMouseEnter={() => setHoveredCountry(country.name)}
                            onMouseLeave={() => setHoveredCountry(null)}
                        >
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-xl mr-3"
                                style={{ backgroundColor: country.color + '20', color: country.color }}
                            >
                                {country.flag}
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">{country.name}</div>
                                <div className="text-sm text-gray-600">{country.capital}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Información adicional */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <div className="flex items-center">
                    <FiMapPin className="text-blue-600 mr-3 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-gray-900">Diseñadora Principal</h4>
                        <p className="text-gray-700">
                            Verónica está ubicada en <strong>Porto, Portugal</strong> 🇵🇹 y trabaja con clientes en todos estos países.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}