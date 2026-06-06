import { useEffect, useState } from "react";
import { getBusInfo, BusInfo } from "./getBusInfo";
import { useStore } from "@/app/store";

export default function useShuttleData() {
  const [shuttleData, setShuttleData] = useState<BusInfo>({});
  const setStoreShuttleData = useStore((state) => state.setShuttleData);

  // 启动时fetch第一次的所有shuttle数据
  useEffect(() => {
    let ws: WebSocket | null = null;
    let isMounted = true;

    const initializeShuttleData = async () => {
      try {
        const data = await getBusInfo();
        if (isMounted) {
          setShuttleData(data);
        }
      } catch (error) {
        console.error("❌ 首次获取公交数据失败:", error);
      }

      if (!isMounted) return;

      ws = new WebSocket("wss://nyu-go-backend-production.up.railway.app");

      ws.onopen = () => {
        console.log("✅ WebSocket 连接已建立");
      };

      ws.onerror = (event) => {
        console.error("❌ WebSocket 连接错误:", event);
      };

      ws.onmessage = (event) => {
        try {
          const data: {
            busId: number;
            latitude: number;
            longitude: number;
            course?: number;
          } = JSON.parse(event.data);

          setShuttleData((prev) => {
            const previousBusData = prev[data.busId];
            if (!previousBusData) {
              return prev;
            }

            return {
              ...prev,
              [data.busId]: {
                route: previousBusData.route,
                latitude: String(data.latitude),
                longitude: String(data.longitude),
                calculatedCourse:
                  data.course !== undefined && data.course !== null
                    ? String(data.course)
                    : previousBusData.calculatedCourse,
              },
            };
          });
        } catch (error) {
          console.error("❌ 解析 WebSocket 数据出错:", error);
        }
      };
    };

    void initializeShuttleData();

    return () => {
      isMounted = false;
      if (!ws) return;
      try {
        ws.close();
        console.log("❌ WebSocket 连接已关闭");
      } catch (e) {
        console.error("❌ WebSocket 关闭失败:", e);
      }
    };
  }, []);

  useEffect(() => {
    //console.log("🚍 更新后的公交数据:", shuttleData);
    setStoreShuttleData(shuttleData);
  }, [shuttleData, setStoreShuttleData]);

  return shuttleData;
}
