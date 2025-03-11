import { useEffect, useState } from "react";

interface ShuttleData {
  busId: number;
  latitude: number;
  longitude: number;
}

export default function useBusWebSocket() {
  const [shuttleData, setShuttleData] = useState<ShuttleData[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://nyu-go-backend-production.up.railway.app");

    ws.onopen = () => {
      console.log("✅ WebSocket 连接已建立");
    };

    ws.onmessage = (event) => {
      try {
        const data: ShuttleData = JSON.parse(event.data);
        //console.log("🚍 收到公交数据:", data);
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

    return () => {
      ws.close();
      console.log("❌ WebSocket 连接已关闭");
    };
  }, []);

  return shuttleData;
}
