"use client";

import React, { useEffect, useState, useMemo, useCallback, use } from "react";
import Card from "@/components/Card/Card";
import Add from "@/components/Add";
import Location from "@/components/LocationDrawer/Location";
import { useStore, StoreState } from "@/app/store";
import { memo } from "react";
import { HiOutlineBell } from "react-icons/hi";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const routes = [
  { name: "A", time: "4", color: "pink" },
  { name: "B", time: "5", color: "purple" },
  { name: "C", time: "8", color: "yellow" },
  { name: "E", time: "8", color: "yellow" },
  { name: "F", time: "3", color: "green" },
  { name: "G", time: "6", color: "cyan" },
  { name: "W", time: "7", color: "amber" },
];

const MemoizedCard = memo(Card);

export default function TrackPage() {
  const [visibleRoutes, setVisibleRoutes] = useState<string[]>([]);
  const [alertData, setAlertData] = useState<{
    error: string;
    msgs: Array<{
      id: string;
      userId: string;
      created: string;
      name: string;
      html: string;
      // 其它字段...
    }>;
  } | null>(null);

  const store: StoreState = useStore() as StoreState;

  // 只在 localStorage 变化时更新 visibleRoutes
  const visibleRoutesMemo = useMemo(() => {
    return routes
      .map((route) => route.name)
      .filter((name) => localStorage.getItem(name) === "true");
  }, [visibleRoutes]);

  // 用 useCallback 避免 setState 触发多次渲染
  const updateVisibleRoutes = useCallback(() => {
    const visible = routes
      .map((route) => route.name)
      .filter((name) => localStorage.getItem(name) === "true");

    setVisibleRoutes((prev) =>
      JSON.stringify(prev) === JSON.stringify(visible) ? prev : visible
    );
  }, []);

  // ① 仅负责获取 alert 消息（首轮一次 + 每 60s 刷新），与本地状态无关
  useEffect(() => {
    const controller = new AbortController();
    const fetchAlerts = async () => {
      try {
        const res = await fetch(
          "https://nyu-go-backend-production.up.railway.app/alert-messages",
          { signal: controller.signal }
        );
        const data = await res.json();
        setAlertData(data);
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("❌ 获取 alert 消息失败:", error);
        }
      }
    };

    fetchAlerts();
    const alertIntervalId = setInterval(fetchAlerts, 60000); // 每 60s 刷新一次

    return () => {
      controller.abort();
      clearInterval(alertIntervalId);
    };
  }, []);

  // ② 仅负责本地 visibleRoutes 的轮询检查
  useEffect(() => {
    updateVisibleRoutes();
    const intervalId = setInterval(updateVisibleRoutes, 500);
    return () => clearInterval(intervalId);
  }, [updateVisibleRoutes]);

  const MemoizedLocation = useMemo(() => <Location />, []);

  const insets = useStore((state) => state.insets);

  return (
    <div
      className="p-4 h-screen overflow-y-auto"
      style={{ marginTop: insets?.top ?? 0 }}
    >
      {/* Header */}
      <div className="flex mb-6 items-center">
        <h1 className="text-3xl font-bold">Track</h1>
        {/* 使用 shadcn 的 AlertDialog 替换原来的按钮 */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="ml-auto rounded-full p-2 w-9 h-9 relative"
              variant="outline"
            >
              <HiOutlineBell className="h-4 w-4" />
              {alertData?.msgs && alertData.msgs.length > 0 && (
                <span className="absolute top-0 right-0 block w-2 h-2 rounded-full bg-red-600" />
              )}
            </Button>
          </DialogTrigger>

          <DialogContent className="w-[90vw] rounded-lg">
            <DialogHeader>
              <DialogTitle>Alert Messages</DialogTitle>
              <DialogDescription></DialogDescription>
              {alertData?.msgs && alertData.msgs.length > 0 ? (
                <div className="text-left">
                  {alertData.msgs.map((msg) => (
                    <div key={msg.id} className="my-4">
                      <div className="text-sm text-gray-500">{msg.created}</div>
                      <div className="font-bold">{msg.name}</div>
                      <div>{msg.html}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>No alert messages</div>
              )}
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      {/* Location */}
      <div className="mb-8 text-base">
        Departing from &nbsp;
        <div className="max-w-48 inline-block">{MemoizedLocation}</div>
        &nbsp; in
      </div>

      {/* Routes List */}
      <div className="space-y-6">
        {routes.map(
          (route, index) =>
            visibleRoutesMemo.includes(route.name) && (
              <MemoizedCard name={route.name} key={index} />
            )
        )}
        <div className="flex justify-center items-center">
          <div className="w-32">
            <Add />
          </div>
        </div>
        <div className="w-full h-16"></div>
      </div>
    </div>
  );
}
