import { useEffect } from "react";
import * as d3 from "d3";
import { mapBounds } from "./latLonToSvg";

export default function useD3Map(
  svgRef: React.RefObject<SVGSVGElement | null>
) {
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const mapGroup = svg.append("g");

    svg.attr("viewBox", `0 0 1400 1200`);

    // 加载 SVG 地图
    d3.xml("/nyu-map.svg").then((xml) => {
      mapGroup.node()?.appendChild(xml.documentElement);
    });

    // D3 处理缩放 & 拖动
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3]) // 限制缩放范围
      .on("zoom", (event) => {
        mapGroup.attr("transform", event.transform);
      });

    svg.call(zoom);
  }, []);
}
