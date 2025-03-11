"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import useShuttleData from "./useShuttleData";

export default function Map() {
  const shuttleData = useShuttleData();

  return (
    <MapContainer
      center={[40.73, -73.99]} // 纽约中心点
      zoom={14}
      zoomAnimation={true} // ✅ 启用缩放动画
      zoomAnimationThreshold={4} // ✅ 设置动画的阈值（默认4）
      style={{ zIndex: 0 }}
      className="map-container"
    >
      {/* 🔥 使用 OpenStreetMap 作为地图 */}
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

      {/* 🔴 画出 Shuttle 位置 */}
      {Object.entries(shuttleData).map(([busId, info]) => (
        <Marker
          key={busId}
          position={[Number(info.latitude), Number(info.longitude)]}
        >
          <Popup>
            🚌 {info.route} {busId}
            <br />
            📍 {Number(info.latitude)}, {Number(info.longitude)}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
