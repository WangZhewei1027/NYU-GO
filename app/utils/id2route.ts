// **Shuttle Bus 数据结构**
interface ShuttleBus {
  deviceId: number;
  created: string; // 时间，例如 "12:02 AM"
  createdTime: string; // 也是时间
  paxLoad: number; // 乘客数量
  bus: string; // 车辆编号（字符串）
  busId: number; // 车辆 ID
  userId: string; // 用户 ID
  routeBlockId: string; // 路线 Block ID
  latitude: string; // 纬度（字符串）
  longitude: string; // 经度（字符串）
  calculatedCourse: string; // 方向角度（字符串）
  outOfService: number; // 是否运营中 (0 = 运营中, 1 = 停运)
  more: string; // 额外信息
  speed?: string; // 速度（可选，因为有的 bus 没有 speed）
  totalCap: number; // 载客容量
  color: string; // 车辆颜色
  busName: string; // 车辆名称
  busType?: string | null; // 车辆类型（可能为空）
  snapDistance?: number; // 与路线的匹配距离（可选）
  routeId: string; // 路线 ID
  route: string; // 线路名称
  outdated: number; // 是否过期 (0 = 最新, 1 = 过期)
}

// **Shuttle Buses 数据结构（多个公交车）**
interface ShuttleBuses {
  [key: string]: ShuttleBus[]; // 使用 busId 作为 key
}

// **时间数据**
interface ShuttleTime {
  [key: string]: string; // 用户 ID -> 时间
}

// **最终的数据结构**
interface ShuttleData {
  buses: ShuttleBuses; // 所有公交数据
  excludedRoutes: number[]; // 被排除的路线
  time: ShuttleTime; // 线路更新时间
}

export default async function getBusId2Route(): Promise<{
  [key: string]: string;
}> {
  const data: { [key: number]: string } = {};

  const response: ShuttleData = await fetch(
    "https://nyu-go-backend-production.up.railway.app/shuttle-data"
  )
    .then((response) => response.json())
    .catch((error) => {
      console.error("❌ 请求失败:", error);
      throw new Error("Failed to fetch shuttle data");
    });

  console.log("📡 Shuttle 数据:", response);

  for (const [key, value] of Object.entries(response.buses)) {
    const busId = value[0].busId;
    const stops = value[0].route;
    data[busId] = stops;
  }

  return data;
}
