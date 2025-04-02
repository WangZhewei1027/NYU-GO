import { useState, useEffect } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import stops from "@/app/utils/stops.json";

// 根据 zoom 计算透明度
const getStopIconOpacity = (zoom: number) => {
  const minZoom = 11; // 当 zoom 小于等于 13 时完全消失
  const maxZoom = 16; // 当 zoom 大于等于 14 时完全显示
  if (zoom <= minZoom) return 0;
  if (zoom >= maxZoom) return 1;
  // 在 minZoom 与 maxZoom 之间线性过渡
  return (zoom - minZoom) / (maxZoom - minZoom);
};

// 修改后的 StopIcon，接收 opacity 作为参数
const StopIcon = ({ opacity = 1 }: { opacity?: number }) => (
  <div
    className="w-2 h-2 flex items-center justify-center rounded-full bg-white border-2 border-gray-500"
    style={{ opacity }}
  ></div>
);

// 创建一个组件来管理所有站点标记
const StopMarkers = () => {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    const onZoomEnd = () => {
      setZoom(map.getZoom());
    };
    map.on("zoomend", onZoomEnd);
    return () => {
      map.off("zoomend", onZoomEnd);
    };
  }, [map]);

  // 根据当前 zoom 计算 StopIcon 的透明度
  const opacity = getStopIconOpacity(zoom);

  return (
    <>
      {Object.values(stops.stops).map((stop) => (
        <Marker
          key={stop.id}
          position={[stop.latitude, stop.longitude]}
          icon={L.divIcon({
            className: "custom-stop",
            html: ReactDOMServer.renderToString(<StopIcon opacity={opacity} />),
            iconSize: [10, 10],
            iconAnchor: [5, 5],
          })}
        >
          <Popup>
            {stop.name} ({stop.id})
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default StopMarkers;
