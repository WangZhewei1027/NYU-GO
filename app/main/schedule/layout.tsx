import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Shuttle Schedules",
  description:
    "Browse NYU Shanghai shuttle timetables by route, including weekday, weekend, and term schedules.",
  path: "/main/schedule",
});

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
