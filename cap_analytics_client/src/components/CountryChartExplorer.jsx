import React, { useState, useMemo } from 'react';
import worldGeoJson from 'utils/world-geo.json';
import CountryChoroplethFilter from 'components/filters/CountryChoroplethFilter';
import ChartPreview from 'scenes/charts/ChartPreview';

import { useGetChartMetadataQuery } from 'state/api';

const CountryChartExplorer = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const { data: chartMetadataList = [] } = useGetChartMetadataQuery();

  const regionValues = useMemo(() => {
    const counts = {};
    chartMetadataList.forEach((meta) => {
      if (meta.country) {
        counts[meta.country] = (counts[meta.country] || 0) + 1;
      }
    });
    return counts;
  }, [chartMetadataList]);

  const filteredCharts = useMemo(() => {
    if (!selectedCountry) return [];
    return chartMetadataList.filter((meta) => meta.country === selectedCountry);
  }, [selectedCountry, chartMetadataList]);

  return (
    <div>
      <h2>Explore Charts by Country</h2>
      <CountryChoroplethFilter
        geoJson={worldGeoJson}
        regionValues={regionValues}
        onCountrySelect={setSelectedCountry}
      />

      {selectedCountry && (
        <>
          <h3 style={{ marginTop: '2rem' }}>
            Charts for {selectedCountry}
          </h3>
          {filteredCharts.map((meta) => (
            <ChartPreview
              key={meta._id}
              metadata={meta}
              chartType={meta.chartType}
              // Load chart data dynamically if needed
              data={[]} // or use RTK query per metadata._id
            />
          ))}
        </>
      )}
    </div>
  );
};

export default CountryChartExplorer;
