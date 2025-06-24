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
import stops from "@/app/utils/stops.json";
import { useStore } from "@/app/store";
import StopMarkers from "./StopMakers";

// 🏷️ 提取路线字母，例如 "Route A" -> "A", "Express Bus C" -> "C"
const getRouteLetter = (route: string) => {
  const pattern = /^Route\s[A-Z]$/;
  if (pattern.test(route)) {
    const parts = route.split(" "); // 按空格拆分字符串
    if (parts.length < 2) return "?"; // 确保至少有两个单词
    const letterMatch = parts[1].match(/[A-Z]/i); // 查找第二个单词的第一个字母
    return letterMatch ? letterMatch[0].toUpperCase() : "?"; // 默认返回 "?"
  }

  return "🚍"; // 如果不匹配，返回 "?"
};

// ✅ JSX 组件表示 Marker
const MarkerIcon = ({ letter }: { letter: string }) => (
  <div
    className={`w-8 h-8 flex items-center justify-center rounded-full bg-white border-2 border-black text-black ${routes[letter]?.borderColor} ${routes[letter]?.textColor} `}
    style={{
      boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.25)",
      transition: "transform 0.3s ease-in-out",
    }}
  >
    <span className="font-black">{letter}</span>
  </div>
);

const StopIcon = () => (
  <div
    className={`w-2 h-2 flex items-center justify-center rounded-full bg-white border-2 border-gray-500`}
    style={
      {
        //boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.25)",
      }
    }
  ></div>
);

const UserLocation = () => (
  <div
    className={`w-2 h-2 flex items-center justify-center rounded-full bg-blue-400 border-2 border-blue-600`}
    style={{
      boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.25)",
    }}
  ></div>
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

      <StopMarkers />

      {/* 🔴 渲染 Shuttle 位置 */}
      {Object.entries(shuttleData).map(([busId, info]) => {
        if (!info.latitude || !info.longitude || !info.route) {
          return null; // 确保数据完整
        }
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
            zIndexOffset={1000}
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

      {/* 🔴 渲染 User 位置 */}
      <Marker
        position={[
          useStore.getState().location.latitude,
          useStore.getState().location.longitude,
        ]}
        icon={L.divIcon({
          className: "custom-user-location",
          html: ReactDOMServer.renderToString(<UserLocation />),
          iconSize: [10, 10],
          iconAnchor: [5, 5],
        })}
        zIndexOffset={2000} // 确保用户位置在最上层
      >
        <Popup>
          📍 Your Location
          <br />
          Latitude: {useStore.getState().location.latitude.toFixed(4)},
          Longitude: {useStore.getState().location.longitude.toFixed(4)}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
