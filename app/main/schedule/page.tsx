import React from "react";
import { Switch } from "@/components/ui/switch"; // 使用 ShadCN UI 的 Switch 组件
import { ChevronRight } from "lucide-react"; // 右箭头图标
import Image from "next/image";

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* 个人信息卡片 */}
      <div className="bg-white rounded-lg  p-4 mb-4">
        <div className="flex items-center">
          <Image
            src="https://picsum.photos/200" // 替换成你的头像路径
            alt="Avatar"
            width={60}
            height={60}
            className="rounded-full"
          />
          <div className="ml-4">
            <h2 className="text-xl font-bold">David Wang</h2>
            <p className="text-gray-500 text-sm">zw3636@nyu.edu</p>
          </div>
        </div>
      </div>

      {/* 设置列表 */}
      <div className="bg-white rounded-lg  divide-y">
        {/* 账户设置 */}
        <SettingItem title="Account" />
        <SettingItem title="Privacy" />
        <SettingItem title="Notifications" rightElement={<Switch />} />
        <SettingItem title="Appearance" />
      </div>

      {/* 其他设置 */}
      <div className="bg-white rounded-lg  divide-y mt-4">
        <SettingItem title="Support & Feedback" />
        <SettingItem title="About" />
      </div>

      <div className="bg-white rounded-lg  divide-y">
        <SettingItem title="Km/Miles" rightElement={<Switch />} />
      </div>

      {/* 退出按钮 */}
      <div className="mt-6 text-center">
        <button className="text-red-500 font-bold text-lg">Log Out</button>
      </div>
    </div>
  );
}

// 设置项组件
function SettingItem({
  title,
  rightElement,
}: {
  title: string;
  rightElement?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-4">
      <span className="text-lg">{title}</span>
      {rightElement ? (
        rightElement
      ) : (
        <ChevronRight className="w-5 h-5 text-gray-400" />
      )}
    </div>
  );
}
