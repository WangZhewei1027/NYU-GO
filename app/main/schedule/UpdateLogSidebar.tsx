"use client";
import * as React from "react";
import { useEffect, useRef } from "react";
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
  const asideRef = useRef<HTMLDivElement | null>(null);

  // Prevent background scroll when open (handles iOS/Safari too)
  useEffect(() => {
    if (!open) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [open]);

  // Move focus into the sidebar on open
  useEffect(() => {
    if (!open) return;
    // Delay to ensure the node is in the DOM
    const id = window.setTimeout(() => {
      asideRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(id);
  }, [open]);

  // Simple focus trap within the sidebar
  useEffect(() => {
    if (!open) return;
    const el = asideRef.current;
    if (!el) return;

    const selector = [
      "a[href]",
      "button:not([disabled])",
      "textarea:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ].join(",");

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (!el) return;
      const focusables = Array.from(el.querySelectorAll<HTMLElement>(selector));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* 侧边栏 */}
          <motion.aside
            key="sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-[100vw] max-w-md bg-gradient-to-b from-gray-50 to-white shadow-2xl z-50 flex flex-col overscroll-contain"
            role="dialog"
            aria-label="Update Log Sidebar"
            aria-modal="true"
            ref={asideRef}
            tabIndex={-1}
          >
            {/* 顶部区域 */}
            <div className="relative px-6 pt-6 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1DADAF] to-[#4cb5b7] bg-clip-text text-transparent">
                    Update Log
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    View latest features and improvements
                  </p>
                </div>
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {updateLog.length > 0 ? (
                <div className="relative">
                  {/* 时间线 */}
                  <div className="absolute left-[13px] top-3 bottom-0 w-0.5 bg-gradient-to-b from-[#1DADAF]/30 via-[#4cb5b7]/20 to-transparent" />

                  <ul className="space-y-6">
                    {updateLog
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime()
                      )
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      .map((log: any, index: number) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="relative pl-12"
                        >
                          {/* 时间线节点 */}
                          <div className="absolute left-2 top-6">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#1DADAF] to-[#4cb5b7] shadow-lg shadow-[#1DADAF]/30 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                          </div>

                          {/* 卡片 */}
                          <div className="group relative bg-white rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-gray-100">
                            {/* 版本和日期 */}
                            <div className="flex items-center justify-between mb-3">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#1DADAF]/10 to-[#4cb5b7]/10 text-[#1DADAF] font-semibold text-sm">
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                v{log.version}
                              </span>
                              <time className="text-xs text-gray-400 font-medium">
                                {log.date}
                              </time>
                            </div>

                            {/* 更新内容 */}
                            <ul className="space-y-2">
                              {log.content.map((item: string, idx: number) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 text-sm text-gray-700"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DADAF] mt-1.5 flex-shrink-0" />
                                  <span className="flex-1">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.li>
                      ))}
                  </ul>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <svg
                    className="w-16 h-16 mb-4 opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-sm">No updates yet</p>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
