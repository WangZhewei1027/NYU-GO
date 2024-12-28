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

interface Route {
  promo: string;
  borderColor?: string;
  bgColor?: string;
}

export const routes: Record<string, Route> = {
  A: {
    promo: "Service to/from Tandon in Brooklyn",
    borderColor: "border-pink-400",
    bgColor: "bg-pink-200",
  },
  B: {
    promo: "Points South of WSQ (Residence Halls: Lafayette & Broome)",
    borderColor: "border-purple-400",
    bgColor: "bg-purple-200",
  },
  C: {
    promo:
      "Stuyvesant Town & Points North of WSQ (Residence Halls: Coral, Founders, Palladium, Third North, UHall)",
    borderColor: "border-blue-400",
    bgColor: "bg-blue-400",
  },
  E: {
    promo:
      "Points North of WSQ (1st Ave Medical Corridor & Residence Halls: Gramercy Green, Palladium, Third North, UHall)",
    borderColor: "border-amber-600",
    bgColor: "bg-amber-200",
  },
  F: {
    promo:
      "3rd Avenue Express (Residence Halls: Coral, Founders, Gramercy Green, Palladium, Third North)",
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
