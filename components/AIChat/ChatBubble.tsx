/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef } from "react";
import { MessageCircle } from "lucide-react";

interface ChatBubbleProps {
  onClick: () => void;
}

export default function ChatBubble({ onClick }: ChatBubbleProps) {
  const bubbleRef = useRef<HTMLButtonElement>(null);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ bottom: 128, right: 24 });
  const rafIdRef = useRef<number | null>(null);

  const updatePosition = (clientX: number, clientY: number) => {
    if (!bubbleRef.current) return;

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      if (!bubbleRef.current) return;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const buttonSize = 48;

      let newRight = windowWidth - clientX - dragOffsetRef.current.x;
      let newBottom = windowHeight - clientY - dragOffsetRef.current.y;

      newRight = Math.max(8, Math.min(windowWidth - buttonSize - 8, newRight));
      newBottom = Math.max(
        8,
        Math.min(windowHeight - buttonSize - 8, newBottom)
      );

      positionRef.current = { bottom: newBottom, right: newRight };
      bubbleRef.current.style.bottom = `${newBottom}px`;
      bubbleRef.current.style.right = `${newRight}px`;
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!bubbleRef.current) return;

    const rect = bubbleRef.current.getBoundingClientRect();
    dragOffsetRef.current = {
      x: e.clientX - rect.right,
      y: e.clientY - rect.bottom,
    };
    isDraggingRef.current = true;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (!isDraggingRef.current) return;
      updatePosition(e.clientX, e.clientY);
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      isDraggingRef.current = false;
      snapToEdge();
      document.removeEventListener("mousemove", handleMouseMove, {
        capture: true,
      } as any);
      document.removeEventListener("mouseup", handleMouseUp, {
        capture: true,
      } as any);
    };

    document.addEventListener("mousemove", handleMouseMove, {
      passive: false,
      capture: true,
    });
    document.addEventListener("mouseup", handleMouseUp, { capture: true });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!bubbleRef.current) return;

    const rect = bubbleRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    dragOffsetRef.current = {
      x: touch.clientX - rect.right,
      y: touch.clientY - rect.bottom,
    };
    isDraggingRef.current = true;

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (!isDraggingRef.current || !e.touches[0]) return;
      updatePosition(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      isDraggingRef.current = false;
      snapToEdge();
      document.removeEventListener("touchmove", handleTouchMove, {
        capture: true,
      } as any);
      document.removeEventListener("touchend", handleTouchEnd, {
        capture: true,
      } as any);
    };

    document.addEventListener("touchmove", handleTouchMove, {
      passive: false,
      capture: true,
    });
    document.addEventListener("touchend", handleTouchEnd, { capture: true });
  };

  const snapToEdge = () => {
    if (!bubbleRef.current) return;

    const windowWidth = window.innerWidth;
    const buttonCenterX = windowWidth - positionRef.current.right - 24;

    let newRight: number;
    if (buttonCenterX < windowWidth / 2) {
      newRight = windowWidth - 56;
    } else {
      newRight = 8;
    }

    positionRef.current.right = newRight;
    bubbleRef.current.style.transition = "right 0.3s ease-out";
    bubbleRef.current.style.right = `${newRight}px`;

    setTimeout(() => {
      if (bubbleRef.current) {
        bubbleRef.current.style.transition = "";
      }
    }, 300);
  };

  const handleBubbleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDraggingRef.current) {
      onClick();
    }
  };

  return (
    <button
      ref={bubbleRef}
      onClick={handleBubbleClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        bottom: `${positionRef.current.bottom}px`,
        right: `${positionRef.current.right}px`,
        willChange: "bottom, right",
      }}
      className="fixed z-50 h-12 w-12 rounded-full bg-egg-blue-500 text-white shadow-xl hover:shadow-2xl hover:scale-110 cursor-grab active:cursor-grabbing active:scale-110 flex items-center justify-center"
      aria-label="Open chat"
    >
      <MessageCircle className="h-5 w-5" />
    </button>
  );
}
