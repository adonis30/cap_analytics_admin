// components/filters/CountryChoroplethFilter.jsx
import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const getColor = (value) => {
  return value > 75 ? '#084594'
       : value > 50 ? '#2171b5'
       : value > 25 ? '#4292c6'
       : value > 10 ? '#6baed6'
       : value > 0  ? '#9ecae1'
       : '#c6dbef';
};

const CountryChoroplethFilter = ({ geoJson, regionValues = {}, onCountrySelect }) => {
  const styleFeature = (feature) => {
    const regionCode = feature?.properties?.ISO_A3;
    const value = regionValues[regionCode] || 0;

    return {
      fillColor: getColor(value),
      weight: 1,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  const onEachFeature = (feature, layer) => {
    const name = feature.properties?.ADMIN;
    const code = feature.properties?.ISO_A3;
    layer.bindTooltip(`${name}`, { sticky: true });

    layer.on({
      click: () => {
        onCountrySelect(code);
      },
    });
  };

  return (
    <MapContainer center={[0, 20]} zoom={2} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <GeoJSON
        data={geoJson}
        style={styleFeature}
        onEachFeature={onEachFeature}
      />
    </MapContainer>
  );
};

export default CountryChoroplethFilter;
