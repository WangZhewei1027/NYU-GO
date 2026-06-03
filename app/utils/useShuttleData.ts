import { use, useEffect, useState } from "react";
import { getBusInfo, BusInfo } from "./getBusInfo";
import { useStore, StoreState } from "@/app/store";

export default function useShuttleData() {
  const [shuttleData, setShuttleData] = useState<BusInfo>({});

  const store: StoreState = useStore() as StoreState;

  // 启动时fetch第一次的所有shuttle数据
  useEffect(() => {
    let ws: WebSocket;

    getBusInfo()
      .then((data) => {
        console.log("🚍 首次获取到的公交数据:", data);
        setShuttleData(data);
      })
      .then(() => {
        ws = new WebSocket("wss://nyu-go-backend-production.up.railway.app");

        ws.onopen = () => {
          console.log("✅ WebSocket 连接已建立");
        };

        ws.onmessage = (event) => {
          try {
            const data: {
              busId: number;
              latitude: number;
              longitude: number;
              course?: number;
            } = JSON.parse(event.data);

            //console.log("🚍 收到公交数据:", data);
            setShuttleData((prev) => {
              if (prev[data.busId]) {
                const busId = data.busId;
                const route = prev[busId].route;
                const calculatedCourse =
                  data.course !== undefined && data.course !== null
                    ? String(data.course)
                    : prev[busId].calculatedCourse;

                return {
                  ...prev,
                  [busId]: {
                    route,
                    latitude: String(data.latitude),
                    longitude: String(data.longitude),
                    calculatedCourse,
                  },
                };
              } else {
                return prev;
              }
            });
          } catch (error) {
            console.error("❌ 解析 WebSocket 数据出错:", error);
          }
        };
      });

    return () => {
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
    store.setShuttleData(shuttleData);
  }, [shuttleData]);

  return shuttleData;
}
