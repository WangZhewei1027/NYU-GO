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

export async function getRemainingTime(
  route: string,
  stop: string
): Promise<number> {
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const dayOfWeek = date.getDay();

  let _dayOfWeek = "mt";
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    _dayOfWeek = "w";
  } else if (dayOfWeek === 5) {
    _dayOfWeek = "f";
  } else {
    _dayOfWeek = "mt";
  }

  const filename = `/route_${route}_${_dayOfWeek}.csv`;
  //console.log("Fetching file:", filename);

  type RouteStop = {
    [stop: string]: string;
  };
  let data: RouteStop[] = [];
  await fetch(filename)
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
          data = results.data;
        },
        error: (error: Error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    })
    .catch((error) => {
      console.error("Error fetching CSV:", error);
    });

  if (data.length > 0) {
    for (const entry of data) {
      for (const [key, value] of Object.entries(entry)) {
        //key是表里的站名，带departure或arrival
        //stop是手动传入的，不带departure或arrival
        let _stop = stop;
        if (specialStops.includes(stop)) {
          _stop = stop + " Departure";
        }
        if (key.toLowerCase().includes(_stop.toLowerCase())) {
          //console.log(value);
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
          // console.log(
          //   `Stop: ${stop}, Entry Time: ${entry.time}, Current Time: ${hour}:${minute}, Remaining Minutes: ${remainingMinutes}`
          // );
          if (remainingMinutes >= 0) {
            //console.log("Remaining Minutes:", remainingMinutes);
            return remainingMinutes;
          }
        }
      }
    }
  }
  console.log("No valid time found");
  return -1; // Return -1 if no valid time is found
}

export function getFromTime(route: string): string[] {
  return ["9:55 am", "10:00 am", "10:05 am"];
}

export function getToTime(route: string): string[] {
  return ["11:00 am", "11:05 am", "11:10 am"];
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
    borderColor: "border-amber-400",
    bgColor: "bg-amber-400",
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

export function getSchedule(
  route: string,
  stopFrom: string,
  stopTo: string,
  time: Date
): string[] {
  return ["9:55 am", "10:00 am", "10:05 am"];
}

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
          console.error("Error parsing CSV:", error);
        },
      });
    })
    .catch((error) => {
      console.error("Error fetching CSV:", error);
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
  console.log(stops);
  return stops;
}
