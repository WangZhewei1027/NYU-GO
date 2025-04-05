import stops from "@/app/utils/stops.json";
import stopNameIsSame from "./stopNameIsSame";

// 输出出发点和到达点的坐标，返回所需时间
export function calculateTime(
  shuttleLat: number,
  shuttleLon: number,
  stopLat: number,
  stopLon: number
): number {
  // 不同时段的平均车速（单位：km/h）
  const trafficSpeeds = [
    { startHour: 0, endHour: 6, speed: 35 }, // 夜间较快
    { startHour: 6, endHour: 9, speed: 20 }, // 早高峰
    { startHour: 9, endHour: 15, speed: 30 }, // 白天较快
    { startHour: 15, endHour: 19, speed: 18 }, // 晚高峰最慢
    { startHour: 19, endHour: 24, speed: 25 }, // 夜晚恢复
  ];

  // 获取当前小时
  const currentHour = new Date().getHours();

  // 选择合适的速度
  const speed =
    trafficSpeeds.find(
      (slot) => currentHour >= slot.startHour && currentHour < slot.endHour
    )?.speed || 25; // 如果找不到，默认速度 25km/h

  // 经纬度转大约距离（简单假设：每度纬度≈111km，经度≈85km在纽约）
  const latDistance = (shuttleLat - stopLat) * 111; // 纬度的影响
  const lonDistance = (shuttleLon - stopLon) * 85; // 纽约地区的经度影响
  const distance = Math.sqrt(latDistance ** 2 + lonDistance ** 2); // 欧几里得距离 (km)

  // 计算时间（单位：分钟）
  const estimatedTime = (distance / speed) * 60;

  return Math.round(estimatedTime); // 四舍五入返回分钟数
}

// 从stops.json中获取站点坐标
export function getStopPosition(stopName: string) {
  const stop = Object.values(stops.stops).find((stop) =>
    stopNameIsSame(stop.name, stopName)
  );
  if (stop) {
    return {
      latitude: stop.latitude,
      longitude: stop.longitude,
    };
  } else {
    console.error(`Stop ${stopName} not found`);
    return null;
  }
}
