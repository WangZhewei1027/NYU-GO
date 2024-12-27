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

export function getRemainingTime(route: string): number {
  return Math.floor(Math.random() * 10) + 1;
}

export function getFromTime(route: string): string[] {
  return ["9:55 am", "10:00 am", "10:05 am"];
}

export function getToTime(route: string): string[] {
  return ["11:00 am", "11:05 am", "11:10 am"];
}
