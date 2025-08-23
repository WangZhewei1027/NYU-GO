"use client";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import updateLog from "@/app/main/schedule/updateLog.json" assert { type: "json" };

export interface UpdateLogSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function UpdateLogSidebar({
  open,
  onClose,
}: UpdateLogSidebarProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 半透明遮罩 */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          {/* 右侧抽屉 */}
          <motion.aside
            key="sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
            className="fixed top-0 right-0 h-full w-[100vw] max-w-md bg-white shadow-xl z-50 flex flex-col"
            role="dialog"
            aria-label="Update Log Sidebar"
          >
            {/* 顶部标题 & 关闭按钮 */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold">Update Log</h2>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
                onClick={onClose}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* 内容区域 */}
            <div className="p-4 overflow-y-auto flex-1">
              {updateLog.length > 0 ? (
                <div className="relative">
                  {/* 时间线竖线 */}
                  <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200" />
                  <ul className="space-y-6">
                    {updateLog
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime()
                      )
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      .map((log: any, index: number) => (
                        <li key={index} className="relative pl-10">
                          {/* 时间线节点 */}
                          <span className="absolute left-0 top-1.5 h-6 w-6 rounded-full bg-white ring-2 ring-[#1DADAF] flex items-center justify-center">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#4cb5b7]" />
                          </span>

                          {/* 卡片 */}
                          <div className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between p-3 border-b">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold">
                                  v{log.version}
                                </span>
                              </div>
                              <time className="text-xs text-gray-500">
                                {log.date}
                              </time>
                            </div>
                            <ul className="p-4 list-disc list-inside space-y-1 text-gray-700 text-sm">
                              {log.content.map((item: string, idx: number) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              ) : (
                <div className="text-gray-600">No updates yet.</div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
