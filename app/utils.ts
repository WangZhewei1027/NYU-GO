import Papa from "papaparse";

export const stops: string[] = [
  "715 Broadway Departure",
  "Broadway & Broome St.",
  "80 Lafayette",
  "Metro Tech Way",
  "6 MetroTech Arrival",
  "6 MetroTech Departure",
  "Cadman Plaza & Clark St.",
  "Cleveland & Spring St.",
  "715 Broadway Arrival",
];

const specialStops: string[] = ["6 MetroTech", "715 Broadway"];

// 日期和文件名生成
function getFilenameForRoute(route: string): string {
  const date = new Date();
  const dayOfWeek = date.getDay();

  let _dayOfWeek = "mt";
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    _dayOfWeek = "w";
  } else if (dayOfWeek === 5) {
    _dayOfWeek = "f";
  }

  return `/route_${route}_${_dayOfWeek}.csv`;
}

// CSV 文件读取和解析
async function fetchAndParseCSV<T>(filename: string): Promise<T[]> {
  try {
    const response = await fetch(filename);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${filename}`);
    }
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse<T>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: (error: Error) => reject(error),
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      console.warn(`Error fetching or parsing CSV: ${error.message}`);
    } else {
      console.warn(`Error fetching or parsing CSV: ${error}`);
    }
    return [];
  }
}

export async function getRemainingTime(
  route: string,
  currentLocation: string
): Promise<number> {
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();

  const filename = getFilenameForRoute(route);
  const data = await fetchAndParseCSV<{ [stop: string]: string }>(filename);

  if (data.length > 0) {
    for (const entry of data) {
      for (const [key, value] of Object.entries(entry)) {
        let _stop = currentLocation;
        if (specialStops.includes(currentLocation)) {
          _stop = currentLocation + " Departure";
        }

        if (key.toLowerCase().includes(_stop.toLowerCase())) {
          const [time, period] = value.split(" ");
          // eslint-disable-next-line prefer-const
          let [entryHour, entryMinute] = time.split(":").map(Number);
          if (period === "PM" && entryHour !== 12) {
            entryHour += 12;
          } else if (period === "AM" && entryHour === 12) {
            entryHour = 0;
          }
          const remainingMinutes =
            (entryHour - hour) * 60 + (entryMinute - minute);
          if (remainingMinutes >= 0) {
            return remainingMinutes;
          }
        }
      }
    }
  }

  console.log(`Route ${route}: No valid time found`);
  return -1; // Return -1 if no valid time is found
}

export async function getSchedule(
  route: string,
  stopFrom: string,
  stopTo: string
): Promise<{ fromSchedule: string[]; toSchedule: string[] }> {
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();

  const filename = getFilenameForRoute(route);
  const data = await fetchAndParseCSV<{ [stop: string]: string }>(filename);

  let _stopFrom = stopFrom;
  let _stopTo = stopTo;

  if (specialStops.includes(stopFrom)) {
    _stopFrom = stopFrom + " Departure";
  }
  if (specialStops.includes(stopTo)) {
    _stopTo = stopTo + " Arrival";
  }

  const fromSchedule: string[] = [];
  const toSchedule: string[] = [];

  if (data.length > 0) {
    for (const entry of data) {
      for (const [key, value] of Object.entries(entry)) {
        if (key.toLowerCase().includes(_stopFrom.toLowerCase())) {
          fromSchedule.push(value);
        }
        if (key.toLowerCase().includes(_stopTo.toLowerCase())) {
          toSchedule.push(value);
        }
      }
    }
  }

  return { fromSchedule, toSchedule };
}

function convertTimeToMinutes(item: string): number {
  const [time, period] = item.split(" ");
  // eslint-disable-next-line prefer-const
  let [entryHour, entryMinute] = time.split(":").map(Number);
  if (period === "PM" && entryHour !== 12) {
    entryHour += 12;
  } else if (period === "AM" && entryHour === 12) {
    entryHour = 0;
  }
  return entryHour * 60 + entryMinute;
}

export async function getRecentSchedule(
  route: string,
  stopFrom: string,
  stopTo: string
): Promise<{ fromSchedule: string[]; toSchedule: string[] }> {
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();

  const { fromSchedule, toSchedule } = await getSchedule(
    route,
    stopFrom,
    stopTo
  );

  let recentFromSchedule: string[] = [];
  let recentToSchedule: string[] = [];

  let i = 0;

  const currentMinutes = hour * 60 + minute;

  for (let index = 0; index < fromSchedule.length; index++) {
    const item = fromSchedule[index];
    const mins = convertTimeToMinutes(item);

    if (mins >= currentMinutes) {
      i = index;
      break;
    }
  }

  recentFromSchedule = fromSchedule.slice(i, i + 3);
  recentToSchedule = toSchedule.slice(i, i + 3);

  return { fromSchedule: recentFromSchedule, toSchedule: recentToSchedule };
}

interface Route {
  promo: string;
  borderColor?: string;
  bgColor?: string;
}

export const routes: Record<string, Route> = {
  A: {
    promo: "Service to/from Tandon in Brooklyn",
    borderColor: "border-pink-400",
    bgColor: "bg-pink-400",
  },
  B: {
    promo: "Points South of WSQ",
    borderColor: "border-purple-400",
    bgColor: "bg-purple-400",
  },
  C: {
    promo: "Stuyvesant Town & Points North of WSQ",
    borderColor: "border-blue-400",
    bgColor: "bg-blue-400",
  },
  E: {
    promo: "Points North of WSQ",
    borderColor: "border-brown-500",
    bgColor: "bg-brown-500",
  },
  F: {
    promo: "3rd Avenue Express",
    borderColor: "border-green-400",
    bgColor: "bg-green-400",
  },
  G: {
    promo: "Greenwich Hall",
    borderColor: "border-cyan-400",
    bgColor: "bg-cyan-400",
  },
  W: {
    promo: "Weekend Service Combining Routes B, E, & G",
    borderColor: "border-yellow-400",
    bgColor: "bg-yellow-400",
  },
};

interface RouteStop {
  route: string;
  location: string;
}

export interface StopRoute {
  [stop: string]: string[];
}

export async function getAllStops(): Promise<StopRoute> {
  const data: RouteStop[] = await getStopsData();

  const obj: { [key: string]: string[] } = {};
  if (data) {
    for (const entry of data) {
      for (const [key, value] of Object.entries(entry)) {
        if (value === "") {
          continue;
        }
        if (obj[value]) {
          obj[value].push(key);
        } else {
          obj[value] = [key];
        }
        obj[value].sort();
      }
    }
    //console.log(obj);
  }

  return obj;
}

async function getStopsData(): Promise<RouteStop[]> {
  let data: RouteStop[] = [];
  await fetch("/stops_data.csv")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((csvText) => {
      Papa.parse<{ stop: string; time: string }>(csvText, {
        header: true, // 如果 CSV 包含表头
        skipEmptyLines: true, // 跳过空行
        complete: (results) => {
          //console.log("Parsed CSV Data:", results.data);
          data = results.data as unknown as RouteStop[];
        },
        error: (error: Error) => {
          console.warn("Error parsing CSV:", error);
        },
      });
    })
    .catch((error) => {
      console.warn("Error fetching CSV:", error);
    });

  return data;
}

export async function getThisRouteStops(route: string): Promise<string[]> {
  const data: RouteStop[] = await getStopsData();
  const stops: string[] = [];
  if (data) {
    for (const entry of data) {
      for (const [key, value] of Object.entries(entry)) {
        if (key === route && value !== "") {
          stops.push(value);
        }
      }
    }
  }
  return stops;
}
