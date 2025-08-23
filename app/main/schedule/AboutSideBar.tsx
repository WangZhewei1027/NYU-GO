"use client";
import * as React from "react";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface UpdateLogSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function AboutSidebar({ open, onClose }: UpdateLogSidebarProps) {
  const asideRef = useRef<HTMLDivElement | null>(null);

  // Prevent background scroll when open (also handles iOS/Safari)
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
    const id = window.setTimeout(() => {
      // try focus close button first, fallback to container
      const closeBtn = asideRef.current?.querySelector<HTMLButtonElement>(
        'button[aria-label="Close"]'
      );
      if (closeBtn) closeBtn.focus();
      else asideRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(id);
  }, [open]);

  // Simple focus trap inside the sidebar
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
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
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
  }, [open, onClose]);

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
            className="fixed top-0 right-0 h-full w-[100vw] max-w-md bg-white shadow-xl z-50 flex flex-col overscroll-contain"
            role="dialog"
            aria-label="About Sidebar"
            aria-modal="true"
            ref={asideRef}
            tabIndex={-1}
          >
            {/* 顶部标题 & 关闭按钮 */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
              <h2 className="text-xl font-bold">About</h2>
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
              <div className="space-y-6 text-sm leading-6 text-gray-700 mt-6">
                <section>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    About This App
                  </h3>
                  <p>
                    This app provides real-time shuttle tracking and scheduling
                    information for NYU students. Our goal is to enhance your
                    campus experience by making shuttle information fast,
                    reliable, and easy to access.
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    Features
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 marker:text-gray-400">
                    <li>Real-time shuttle tracking</li>
                    <li>Detailed route &amp; stop information</li>
                    <li>Mobile-first, accessible UI</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    Contact Us
                  </h3>
                  <p>
                    Have questions or feedback? Email us at{" "}
                    <a
                      className="text-[#1DADAF] hover:underline"
                      href={`mailto:${
                        process.env.NEXT_PUBLIC_SUPPORT_EMAIL ??
                        "zw3636@nyu.edu"
                      }`}
                    >
                      {process.env.NEXT_PUBLIC_SUPPORT_EMAIL ??
                        "zw3636@nyu.edu"}
                    </a>
                    .
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    Privacy
                  </h3>
                  <p>
                    We store minimal data in your browser (localStorage/cache)
                    to improve performance. You can clear it anytime in{" "}
                    <strong>Settings → Developer → “Clear Local Data”</strong>.
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    Credits
                  </h3>
                  <p>
                    This app was developed by{" "}
                    <span className="font-medium">David Zhewei Wang</span> (Full
                    Stack Development) and{" "}
                    <span className="font-medium">Chanel Shuya Feng</span>{" "}
                    (UI/UX Design).
                  </p>
                </section>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
