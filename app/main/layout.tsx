import React from "react";
import BottomNav from "@/components/BottomNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col h-screen">
      {children}
      <BottomNav />
    </section>
  );
}
