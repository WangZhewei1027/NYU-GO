"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineDirectionsBus } from "react-icons/md";
import { MdOutlineLocationOn } from "react-icons/md";
import { MdOutlinePerson } from "react-icons/md";

const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Track", href: "/main/track", icon: MdOutlineDirectionsBus },
    { name: "Map", href: "/main/map", icon: MdOutlineLocationOn },
    { name: "Schedule", href: "/main/schedule", icon: MdOutlinePerson },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-4 shadow-md">
      {navItems.map((item) => (
        <Link key={item.name} href={item.href} className="flex-1">
          <div
            className={`flex flex-col items-center ${
              pathname === item.href ? "text-gray-800" : "text-gray-400"
            }`}
          >
            <item.icon className="text-3xl" /> {/* 图标部分 */}
            <span className="text-sm font-sans">{item.name}</span>{" "}
            {/* 文字部分 */}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;
