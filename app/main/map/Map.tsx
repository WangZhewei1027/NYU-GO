"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import { useMemo } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import useShuttleData from "@/app/utils/useShuttleData";
import { routes } from "@/app/utils/utils";

// 🏷️ 提取路线字母，例如 "Route A" -> "A", "Express Bus C" -> "C"
const getRouteLetter = (route: string) => {
  const parts = route.split(" "); // 按空格拆分字符串
  if (parts.length < 2) return "?"; // 确保至少有两个单词
  const letterMatch = parts[1].match(/[A-Z]/i); // 查找第二个单词的第一个字母
  return letterMatch ? letterMatch[0].toUpperCase() : "?"; // 默认返回 "?"
};

// ✅ JSX 组件表示 Marker
const MarkerIcon = ({ letter }: { letter: string }) => (
  <div
    className={`w-8 h-8 flex items-center justify-center rounded-full bg-white border-2 ${routes[letter]?.borderColor} ${routes[letter]?.textColor} border-black`}
    style={{ boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.25)" }}
  >
    <span className="font-black">{letter}</span>
  </div>
);

export default function Map() {
  const shuttleData = useShuttleData();

  // ✅ **确保 Hook 调用顺序一致**
  const iconCache = useMemo(() => {
    const cache: { [key: string]: L.DivIcon } = {};
    return cache;
  }, []);

  return (
    <MapContainer
      center={[40.73, -73.99]} // 纽约中心点
      zoom={14}
      zoomAnimation={true}
      zoomAnimationThreshold={4}
      style={{ zIndex: 0 }}
      className="map-container"
      zoomControl={false}
    >
      {/* 🔥 使用 OpenStreetMap 作为地图 */}
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

      {/* 🔴 渲染 Shuttle 位置 */}
      {Object.entries(shuttleData).map(([busId, info]) => {
        const routeLetter = getRouteLetter(info.route);

        // ✅ **使用缓存的 icon，避免重复创建**
        if (!iconCache[routeLetter]) {
          iconCache[routeLetter] = L.divIcon({
            className: "custom-marker",
            html: ReactDOMServer.renderToString(
              <MarkerIcon letter={routeLetter} />
            ),
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          });
        }

        return (
          <Marker
            key={busId}
            position={[Number(info.latitude), Number(info.longitude)]}
            icon={iconCache[routeLetter]}
          >
            <Popup>
              🚌 {info.route}
              <br /># {busId}
              <br />
              📍 {Number(info.latitude)}, {Number(info.longitude)}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
