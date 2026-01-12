"use client";

import { useRef, useState, useEffect } from "react";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import { MessageCircle } from "lucide-react";

interface ChatBubbleProps {
  onClick: () => void;
}

export default function ChatBubble({ onClick }: ChatBubbleProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const clickTimeRef = useRef(0);
  const [isMounted, setIsMounted] = useState(false);
  const [controlledPosition, setControlledPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isSnapping, setIsSnapping] = useState(false);

  // 等待组件挂载后再渲染
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 计算初始位置
  const getDefaultPosition = () => {
    if (typeof window === "undefined") return { x: 0, y: 0 };
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    return {
      x: windowWidth - 72, // right: 24px + button size 48px
      y: windowHeight - 176, // bottom: 128px + button size 48px
    };
  };

  const handleDragStart = (e: DraggableEvent, data: DraggableData) => {
    // 记录拖动起始位置和时间
    dragStartPosRef.current = { x: data.x, y: data.y };
    clickTimeRef.current = Date.now();
    isDraggingRef.current = false;
  };

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    // 计算移动距离，如果移动超过5px才算真正拖动
    const deltaX = Math.abs(data.x - dragStartPosRef.current.x);
    const deltaY = Math.abs(data.y - dragStartPosRef.current.y);

    if (deltaX > 5 || deltaY > 5) {
      isDraggingRef.current = true;
    }
  };

  const handleDragStop = (e: DraggableEvent, data: DraggableData) => {
    const wasDragging = isDraggingRef.current;
    const clickDuration = Date.now() - clickTimeRef.current;
    const deltaX = Math.abs(data.x - dragStartPosRef.current.x);
    const deltaY = Math.abs(data.y - dragStartPosRef.current.y);

    // 如果没有真正拖动且时间短、移动距离小，视为点击
    if (!wasDragging && clickDuration < 300 && deltaX < 5 && deltaY < 5) {
      isDraggingRef.current = false;
      onClick();
      return;
    }

    // 如果没有真正拖动，直接重置状态并返回
    if (!wasDragging) {
      isDraggingRef.current = false;
      return;
    }

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const buttonSize = 48;
    const margin = 8;

    // 计算按钮中心点
    const buttonCenterX = data.x + buttonSize / 2;
    const buttonCenterY = data.y + buttonSize / 2;

    // 确保按钮在可视区域内
    let finalX = data.x;
    let finalY = data.y;

    // 限制在垂直方向
    finalY = Math.max(
      margin,
      Math.min(windowHeight - buttonSize - margin, finalY)
    );

    // 判断靠近哪一边（左边还是右边）
    setIsSnapping(true);
    if (buttonCenterX < windowWidth / 2) {
      // 吸附到左边
      finalX = margin;
    } else {
      // 吸附到右边
      finalX = windowWidth - buttonSize - margin;
    }

    setControlledPosition({ x: finalX, y: finalY });

    // 动画完成后移除snapping状态
    setTimeout(() => {
      setIsSnapping(false);
      isDraggingRef.current = false;
    }, 300);
  };

  // 如果还没挂载，不渲染任何内容
  if (!isMounted) {
    return null;
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={getDefaultPosition()}
      position={controlledPosition || undefined}
      onStart={handleDragStart}
      onDrag={handleDrag}
      onStop={handleDragStop}
    >
      <div
        ref={nodeRef}
        className="fixed z-50"
        style={{
          transition: isSnapping ? "transform 0.3s ease-out" : "none",
        }}
      >
        <button
          className="h-12 w-12 rounded-full bg-egg-blue-500 text-white shadow-xl hover:shadow-2xl hover:scale-110 cursor-grab active:cursor-grabbing active:scale-110 flex items-center justify-center"
          aria-label="Open chat"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      </div>
    </Draggable>
  );
}
