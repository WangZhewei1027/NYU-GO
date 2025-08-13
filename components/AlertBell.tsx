"use client";

import React, { useEffect, useState } from "react";
import { HiOutlineBell } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import clsx from "clsx";

type AlertMessage = {
  id: string;
  userId: string;
  created: string;
  name: string;
  html: string;
};

type AlertResponse = {
  error?: string;
  msgs?: AlertMessage[];
};

type Props = {
  className?: string;
};

export default function AlertBell({ className }: Props) {
  const [data, setData] = useState<AlertResponse | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAlerts = async () => {
      try {
        const res = await fetch(
          "https://nyu-go-backend-production.up.railway.app/alert-messages",
          { signal: controller.signal }
        );
        const json: AlertResponse = await res.json();
        setData(json);
      } catch (err: unknown) {
        // 静默处理 AbortError，其它错误打印即可
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("❌ 获取 alert 消息失败:", err);
        }
      }
    };

    fetchAlerts();
    const id = setInterval(fetchAlerts, 60_000); // 每 60s 刷新

    return () => {
      controller.abort();
      clearInterval(id);
    };
  }, []);

  const count = data?.msgs?.length ?? 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={clsx("rounded-full p-2 w-9 h-9 relative", className)}
          variant="outline"
        >
          <HiOutlineBell className="h-4 w-4" />
          {count > 0 && (
            <span className="absolute top-0 right-0 block w-2 h-2 rounded-full bg-red-600" />
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[90vw] rounded-lg">
        <DialogHeader>
          <DialogTitle>Alert Messages</DialogTitle>
          <DialogDescription />
          {count > 0 ? (
            <div className="text-left">
              {data!.msgs!.map((msg) => (
                <div key={msg.id} className="my-4">
                  <div className="text-sm text-gray-500">{msg.created}</div>
                  <div className="font-bold">{msg.name}</div>
                  <div dangerouslySetInnerHTML={{ __html: msg.html }} />
                </div>
              ))}
            </div>
          ) : (
            <div>No alert messages</div>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
