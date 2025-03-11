/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import * as d3 from "d3";
import useBusWebSocket from "./useBusWebSocket";
import { latLonToSvg } from "./latLonToSvg";
import { getBusId2Route } from "./getBusInfo";

export default function useShuttleLayer(
  svgRef: React.RefObject<SVGSVGElement | null>
) {
  const shuttleData = useBusWebSocket(); // 获取实时公交数据
  const [busId2Route, setBusId2Route] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    getBusId2Route()
      .then(setBusId2Route)
      .catch((error) => console.error("❌ 获取线路数据失败:", error));
  }, []);

  // 监听 busId2Route 的变化
  useEffect(() => {
    console.log("🚍 线路数据更新:", busId2Route);
  }, [busId2Route]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const mapGroup = svg.select("g");
    if (!mapGroup) return;

    // 过滤出有线路信息的 Shuttle 数据
    const filteredData = shuttleData.filter(
      (bus) => busId2Route[bus.busId] !== undefined
    );

    // 选择所有 Shuttle
    const buses = mapGroup
      .selectAll(".shuttle")
      .data(filteredData, (d: any) => d.busId);

    // 🚍 更新位置
    buses.attr("transform", (d: any) => {
      const pos = latLonToSvg(
        d.latitude,
        d.longitude,
        svgRef.current?.clientWidth || 0,
        svgRef.current?.clientHeight || 0
      );
      return `translate(${pos.x}, ${pos.y})`;
    });

    // 🚍 添加新的 Shuttle
    const newBuses = buses.enter().append("g").attr("class", "shuttle");

    newBuses.append("circle").attr("r", 10).attr("fill", "red");

    newBuses
      .append("text")
      .attr("dy", -15)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("fill", "black");

    // 🚍 更新 Bus ID 文字
    mapGroup
      .selectAll(".shuttle text")
      .text((d: any) => busId2Route[d.busId] || "");

    // 🚍 移除不再需要的 Circles
    buses.exit().remove();
  }, [shuttleData, busId2Route]);

  return busId2Route; // 如果外部组件需要这个数据，可以返回
}
