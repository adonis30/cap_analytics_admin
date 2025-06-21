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

    // ✅ Custom color scale - vibrant
    const values = Object.values(regionValues).map(Number).filter(Boolean);
    const maxValue = d3.max(values) || 1;
    const minValue = d3.min(values) || 0;

    const colorScale = d3.scaleSequential()
      .domain([minValue, maxValue])
      .interpolator(d3.interpolatePlasma); // Options: interpolateViridis, interpolateCool, interpolateInferno

    // ✅ Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "map-tooltip")
      .style("position", "absolute")
      .style("padding", "8px 14px")
      .style("background", "rgba(0,0,0,0.85)")
      .style("color", "#fff")
      .style("fontSize", "0.875rem")
      .style("borderRadius", "6px")
      .style("boxShadow", "0 2px 8px rgba(0,0,0,0.4)")
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

        const formattedKey = dataKey
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        const formattedValue =
          typeof value === "number"
            ? new Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 2,
              }).format(value)
            : "No data";

        tooltip
          .html(
            `<strong>${countryName}</strong><br/>${formattedKey}: ${formattedValue}`
          )
          .style("left", `${event.pageX + 12}px`)
          .style("top", `${event.pageY - 40}px`)
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
  }, [geoJson, regionValues, dataKey]);

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg ref={svgRef} width="100%" height="500px" />
    </div>
  );
};

export default ChoroplethMapComponent;
