"use client";
import React, { useRef } from "react";
import * as d3 from "d3";
import useD3Map from "./useD3Map";
import useShuttleLayer from "./useShuttleLayer";

export default function Map() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useD3Map(svgRef); // 负责 D3.js 地图缩放 & 加载
  useShuttleLayer(svgRef); // 负责加载公交车数据

  return <svg ref={svgRef} width="100%" height="100%"></svg>;
}
