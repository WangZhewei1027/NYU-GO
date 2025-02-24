"use client";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import getBusId2Route from "@/app/utils/id2route";

// Shuttle 数据结构
interface ShuttleData {
  busId: number;
  latitude: number;
  longitude: number;
  course: number;
  paxLoad: number;
  more: {
    eventCode: number;
    hdop: number;
    rssi: number;
    satellites: number;
  };
}

export default function Map() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [shuttleData, setShuttleData] = useState<ShuttleData[]>([]);
  const [busId2Route, setBusId2Route] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    getBusId2Route()
      .then((data) => {
        console.log("🚀 线路数据:", data);
        setBusId2Route(data);
      })
      .catch((error) => {
        console.error("❌ 获取线路数据失败:", error);
      });
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // 1️⃣ 创建地图的 `g` 组（所有地图 & Shuttle 都在这里）
    const mapGroup = svg.append("g");

    // 2️⃣ 加载 SVG 地图
    d3.xml("/nyu-map.svg").then((xml) => {
      mapGroup.node()?.appendChild(xml.documentElement);
    });

    // 3️⃣ D3 处理缩放 & 拖动（影响 mapGroup）
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3]) // 限制缩放范围
      .on("zoom", (event) => {
        mapGroup.attr("transform", event.transform);
      });

    if (svgRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      svg.call(zoom as any);
    }

    // 4️⃣ 连接 WebSocket，监听 Shuttle 位置数据
    const ws = new WebSocket("ws://nyu-go-backend-production.up.railway.app");

    ws.onopen = () => console.log("✅ WebSocket 连接成功");
    ws.onmessage = (event) => {
      try {
        const data: ShuttleData = JSON.parse(event.data);
        console.log("🚀 WebSocket 数据:", data);
        setShuttleData((prev) => {
          const index = prev.findIndex((bus) => bus.busId === data.busId);
          if (index !== -1) {
            prev[index] = data;
            return [...prev];
          } else {
            return [...prev, data];
          }
        });
      } catch (error) {
        console.error("❌ 解析 WebSocket 数据出错:", error);
      }
    };

    return () => ws.close();
  }, []);

  // 🚀 在地图上绘制 Shuttle
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const mapGroup = svg.select("g"); // 确保 Shuttle 和地图在同一层级

    const filteredData = shuttleData.filter((bus) => {
      return busId2Route[bus.busId] !== undefined;
    });

    // 选择所有 Shuttle Circles
    const buses = mapGroup
      .selectAll(".shuttle")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .data(filteredData, (d: any) => d.busId);

    // 更新 Shuttle 位置
    buses
      .attr("cx", (d) => latLonToSvg(d.latitude, d.longitude).x)
      .attr("cy", (d) => latLonToSvg(d.latitude, d.longitude).y);

    // 添加新的 Shuttle Circles
    const newBuses = buses
      .enter()
      .append("g") // 🔥 新增 `g` 组，让 `circle` 和 `text` 绑定
      .attr("class", "shuttle");

    newBuses.append("circle").attr("r", 10).attr("fill", "red");

    newBuses
      .append("text") // 🔥 添加 `text`，显示 Bus ID
      .attr("dy", -15) // 让 `text` 在 `circle` 上方
      .attr("text-anchor", "middle") // 居中对齐
      .attr("font-size", "14px")
      .attr("fill", "black");

    // 更新 `g` 组内的 `circle` 和 `text`
    mapGroup
      .selectAll(".shuttle")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .attr("transform", (d: any) => {
        const pos = latLonToSvg(d.latitude, d.longitude);
        return `translate(${pos.x}, ${pos.y})`;
      })
      .select("text")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .text((d: any) => `${busId2Route[d.busId]}`);

    // 移除不再需要的 Circles
    buses.exit().remove();
  }, [shuttleData, busId2Route]);

  // 📌 经纬度转换为 SVG 坐标
  function latLonToSvg(lat: number, lon: number) {
    const mapBounds = {
      minLat: 40.78,
      maxLat: 40.64,
      minLon: -74.02,
      maxLon: -73.89,
    };
    const svg = svgRef.current;
    const width = svg ? svg.clientWidth : 1400;
    const height = svg ? svg.clientHeight : 1200;

    return {
      x:
        ((lon - mapBounds.minLon) / (mapBounds.maxLon - mapBounds.minLon)) *
        width,
      y:
        (1 - (lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) *
        height,
    };
  }

  return <svg ref={svgRef} width="100%" height="100%" />;
}
