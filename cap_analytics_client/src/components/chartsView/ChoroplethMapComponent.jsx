// ChoroplethMapComponent.jsx

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

const ChoroplethMapComponent = ({
  geoJson,
  regionValues = {},
  dataKey = "",
  onCountryClick,
}) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!geoJson || !svgRef.current) return;

    const width = 900;
    const height = 500;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const projection = d3.geoMercator().fitSize([width, height], geoJson);
    const path = d3.geoPath().projection(projection);

    const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", (event) => {
      svg.select("g.map-layer").attr("transform", event.transform);
    });

    svg.call(zoom);

    const maxValue = d3.max(Object.values(regionValues));
    const colorScale = d3
      .scaleSequential()
      .domain([0, maxValue || 1])
      .interpolator(d3.interpolateBlues);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "map-tooltip")
      .style("position", "absolute")
      .style("padding", "6px 12px")
      .style("background", "#333")
      .style("color", "#fff")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    svg
      .append("g")
      .attr("class", "map-layer")
      .selectAll("path")
      .data(geoJson.features)
      .join("path")
      .attr("d", path)
      .attr("fill", (d) => {
        const isoCode =
          d.properties.ISO_A3 || d.id || d.properties["ISO3166-1-Alpha-3"];
        const value = regionValues[isoCode];
        return value != null ? colorScale(value) : "#e0e0e0";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.7)
      .on("mouseover", function (event, d) {
        const isoCode =
          d.properties.ISO_A3 || d.id || d.properties["ISO3166-1-Alpha-3"];
        const countryName = d.properties.name;
        const value = regionValues[isoCode];

        tooltip
          .html(
            `<strong>${countryName}</strong><br/>Charts: ${
              value != null ? value : "No data"
            }`
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`)
          .style("opacity", 1);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      })
      .on("click", (event, d) => {
        const isoCode =
          d.properties.ISO_A3 || d.id || d.properties["ISO3166-1-Alpha-3"];
        if (onCountryClick) onCountryClick(isoCode);
      });
  }, [geoJson, regionValues]);

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg ref={svgRef} width="100%" height="500px" />
    </div>
  );
};

export default ChoroplethMapComponent;
