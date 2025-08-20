// components/MobileSimulator.tsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * MobileSimulator
 * - 在桌面端把你的移动端站点包进一个“手机外框”里，并自动缩放到可视区
 * - 在移动端则直接渲染 children，不做任何包裹
 * - 可通过 ?sim=0 关闭模拟器（方便真机/窄屏调试）
 * - 支持安全区内边距（可配合 Capacitor/Meta viewport 使用）
 */
export default function MobileSimulator({
  children,
  phoneWidth = 390, // iPhone 15 逻辑宽度
  phoneHeight = 844, // iPhone 15 逻辑高度
  border = 14,
}: {
  children: React.ReactNode;
  phoneWidth?: number;
  phoneHeight?: number;
  border?: number; // 设备边框厚度（视觉用）
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isDesktop, setIsDesktop] = useState(false);

  // 是否强制关闭模拟器
  const simOff = useMemo(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.get("sim") === "0";
  }, []);

  // 检测环境（尽量用能力而非 UA 判断）
  useEffect(() => {
    if (typeof window === "undefined") return;
    const pointerFine = window.matchMedia("(pointer: fine)").matches; // 通常为鼠标设备
    const minWidth = window.matchMedia("(min-width: 768px)").matches; // 传统桌面阈值
    setIsDesktop(pointerFine || minWidth);
  }, []);

  // 按照容器可用空间，等比缩放“手机屏幕”
  useEffect(() => {
    function recalc() {
      if (!rootRef.current) return;
      const { clientWidth: W, clientHeight: H } = rootRef.current;
      const targetW = phoneWidth + border * 2;
      const targetH = phoneHeight + border * 2 + 26; // 顶部听筒/刘海高度预留
      const s = Math.min(W / targetW, H / targetH);
      setScale(Number.isFinite(s) ? s : 1);
    }
    recalc();
    const ro = new ResizeObserver(recalc);
    if (rootRef.current) ro.observe(rootRef.current);
    window.addEventListener("orientationchange", recalc);
    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", recalc);
    };
  }, [phoneWidth, phoneHeight, border]);

  if (!isDesktop || simOff) {
    // 移动端或强制关闭 -> 直接渲染
    return <>{children}</>;
  }

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 bg-neutral-900/95 flex items-center justify-center"
    >
      {/* 设备外框 */}
      <div
        className="relative shadow-2xl rounded-[3rem] bg-black/60"
        style={{
          width: (phoneWidth + border * 2) * scale,
          height: (phoneHeight + border * 2 + 26) * scale,
        }}
      >
        {/* 顶部扬声器/刘海装饰 */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-2 rounded-full bg-black/70"
          style={{ width: 104 * scale, height: 10 * scale }}
        />

        {/* 屏幕区域（用 scale 缩放） */}
        <div
          ref={stageRef}
          className="absolute overflow-hidden rounded-[2.5rem] bg-white"
          style={{
            left: border * scale,
            top: (border + 20) * scale, // 下移一点，避开上方装饰
            width: phoneWidth * scale,
            height: phoneHeight * scale,
          }}
        >
          {/* 用 transform 缩放真实内容，使其视觉上匹配 phoneWidth x phoneHeight */}
          <div
            style={{
              width: phoneWidth,
              height: phoneHeight,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            {/* 安全区：把系统刘海/手势条留白交给内容决定 */}
            <div className="pt-safe-top pb-safe-bottom px-safe-left pr-safe-right w-full h-full">
              {children}
            </div>
          </div>
        </div>

        {/* 侧边按钮装饰（可选） */}
        <div
          className="absolute right-[-6px] top-[120px] w-[3px] rounded bg-neutral-700"
          style={{ height: 80 * scale }}
        />
        <div
          className="absolute left-[-6px] top-[160px] w-[3px] rounded bg-neutral-700"
          style={{ height: 50 * scale }}
        />
        <div
          className="absolute left-[-6px] top-[220px] w-[3px] rounded bg-neutral-700"
          style={{ height: 50 * scale }}
        />
      </div>
    </div>
  );
}
