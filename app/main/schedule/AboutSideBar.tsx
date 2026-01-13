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
      asideRef.current?.focus();
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
          {/* Background Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.aside
            key="sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-[100vw] max-w-md bg-gradient-to-b from-gray-50 to-white shadow-2xl z-50 flex flex-col overscroll-contain"
            role="dialog"
            aria-label="About Sidebar"
            aria-modal="true"
            ref={asideRef}
            tabIndex={-1}
          >
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1DADAF] to-[#4cb5b7] bg-clip-text text-transparent">
                    About
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Learn more about NYU GO
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="space-y-5">
                {/* App Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0 }}
                  className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1DADAF] to-[#4cb5b7] flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-2">
                        About This App
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        This app provides real-time shuttle tracking and
                        scheduling information for NYU students. Our goal is to
                        enhance your campus experience by making shuttle
                        information fast, reliable, and easy to access.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Features Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1DADAF] to-[#4cb5b7] flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-3">
                        Features
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1DADAF] mt-1.5 flex-shrink-0" />
                          <span>Real-time shuttle tracking</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1DADAF] mt-1.5 flex-shrink-0" />
                          <span>Detailed route &amp; stop information</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1DADAF] mt-1.5 flex-shrink-0" />
                          <span>Mobile-first, accessible UI</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Contact Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1DADAF] to-[#4cb5b7] flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-2">
                        Contact Us
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Have questions or feedback? Email us at{" "}
                        <a
                          className="text-[#1DADAF] hover:text-[#4cb5b7] font-medium transition-colors"
                          href={`mailto:${
                            process.env.NEXT_PUBLIC_SUPPORT_EMAIL ??
                            "zw3636@nyu.edu"
                          }`}
                        >
                          {process.env.NEXT_PUBLIC_SUPPORT_EMAIL ??
                            "zw3636@nyu.edu"}
                        </a>
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Privacy Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1DADAF] to-[#4cb5b7] flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-2">
                        Privacy
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        We store minimal data in your browser
                        (localStorage/cache) to improve performance. You can
                        clear it anytime in{" "}
                        <span className="font-medium text-gray-700">
                          {`Settings → Developer → "Clear Local Data"`}
                        </span>
                        .
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Credits Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1DADAF] to-[#4cb5b7] flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-3">
                        Credits
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#1DADAF] to-[#4cb5b7]" />
                          <span className="text-sm text-gray-600">
                            <span className="font-semibold text-gray-900">
                              David Zhewei Wang
                            </span>{" "}
                            - Full Stack Development
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#1DADAF] to-[#4cb5b7]" />
                          <span className="text-sm text-gray-600">
                            <span className="font-semibold text-gray-900">
                              Chanel Shuya Feng
                            </span>{" "}
                            - UI/UX Design
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
