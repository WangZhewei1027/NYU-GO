"use client";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import { useMemo } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import useShuttleData from "@/app/utils/useShuttleData";
import { routesColor } from "@/app/utils/utils";
import stops from "@/app/utils/stops.json";
import { useStore } from "@/app/store";
import StopMarkers from "./StopMakers";
import routeIdToLetterMap from "@/app/utils/map-settings/routeIdToLetterMap.json";

// 🏷️ 提取路线字母，例如 "Route A" -> "A", "Express Bus C" -> "C"
const getRouteLetter = (route: string) => {
  if (route === "Ferry Route") return "ferry"; // 特例处理 Ferry Route

  const pattern = /^Route\s[A-Z]$/;
  if (pattern.test(route)) {
    const parts = route.split(" "); // 按空格拆分字符串
    if (parts.length < 2) return "?"; // 确保至少有两个单词
    const letterMatch = parts[1].match(/[A-Z]/i); // 查找第二个单词的第一个字母
    return letterMatch ? letterMatch[0].toUpperCase() : "?"; // 默认返回 "?"
  }

  return "🚍"; // 如果不匹配，返回 "?"
};

const MarkerIcon = ({
  letter,
  heading = 0,
}: {
  letter: string;
  heading?: number;
}) => {
  return (
    <div
      className="relative w-8 h-8"
      style={{
        transform: `rotate(${heading}deg)`,
        transformOrigin: "center center",
        transition: "transform 0.3s ease-in-out",
      }}
    >
      {/* 小三角箭头 */}
      <div
        className="absolute top-[-6px] left-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-transparent border-b-black"
        style={{
          transform: "translateX(-50%)",
          zIndex: -1, // 确保小三角在圆形下方
          borderBottomColor: routesColor[letter]?.color || "#000", // 使用对应路线颜色
        }}
      ></div>

      {/* 圆形主体 + 反向旋转内容 */}
      <div
        className={`w-8 h-8 flex items-center justify-center rounded-full bg-white border-2 border-gray-800 text-black ${routesColor[letter]?.borderColor} ${routesColor[letter]?.textColor}`}
        style={{
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.45)",
          borderColor: routesColor[letter]?.color || "#000",
        }}
      >
        {/* 👇 反向旋转中间内容 */}
        <div style={{ transform: `rotate(${-heading}deg)` }}>
          {letter === "ferry" ? (
            <img src="/map/ferry.svg" alt="ferry" className="w-4 h-4" />
          ) : (
            <span
              className="font-bold text-lg"
              style={{ color: routesColor[letter]?.color || "#000" }}
            >
              {letter}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

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
      center={[40.7, -73.99]} // 纽约中心点
      zoom={14}
      zoomAnimation={true}
      zoomAnimationThreshold={1}
      maxZoom={18}
      minZoom={12}
      scrollWheelZoom={true}
      style={{ zIndex: 0 }}
      className="map-container"
      zoomControl={false}
    >
      {/* 🔥 使用 OpenStreetMap 作为地图 */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        updateWhenIdle={false}
        updateWhenZooming={false}
        keepBuffer={8}
      />

      <StopMarkers />

      {/* 🔵 渲染路线 Polyline */}
      {Object.entries(stops.routePoints).map(
        ([routeId, points], routeIndex) => {
          const routeLetter =
            routeIdToLetterMap[routeId as keyof typeof routeIdToLetterMap];
          const color = routesColor[routeLetter]?.color;

          return points.map((pointList, index) => {
            const latLngs = pointList.map((p) => [
              Number(p.lat),
              Number(p.lng),
            ]);

            return (
              <Polyline
                key={`${routeId}-${index}`}
                positions={latLngs as [number, number][]}
                color={color || "#333"} // 可自定义颜色
                weight={color ? 4 : 2.5} // 线宽
                opacity={color ? 0.8 : 0.4} // 透明度
                dashArray={!color ? "5, 10" : undefined} // 虚线效果
              >
                <Popup closeButton={false} autoPan={true}>
                  <div className="mb-2">
                    <span className="font-bold text-base">
                      Route {routeLetter}
                    </span>
                  </div>
                </Popup>
              </Polyline>
            );
          });
        }
      )}

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
              <MarkerIcon
                letter={routeLetter}
                heading={Number(info.calculatedCourse)}
              />
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
            <Popup closeButton={false} autoPan={true}>
              <div className="mb-2">
                <span className="font-bold text-base">{info.route}</span>
                <span> ({busId})</span>
              </div>
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
