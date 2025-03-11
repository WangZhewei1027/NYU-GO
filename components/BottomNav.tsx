"use client";
import React from "react";
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
    <div className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-50 backdrop-blur-md border-t flex justify-around py-4 shadow-md rounded-t-3xl w-[100vw]">
      {navItems.map((item) => (
        <Link key={item.name} href={item.href} className="flex-1">
          <div className={`flex flex-col items-center`}>
            <item.icon
              className={`text-3xl  transition-all duration-500 ${
                pathname === item.href
                  ? "text-egg-blue-500 translate-y-0"
                  : "text-gray-400 translate-y-2"
              }`}
            />
            {/* 图标部分 */}

            <span
              className={`transition-all duration-500 
                ${
                  pathname === item.href
                    ? "opacity-100 visible"
                    : "opacity-0 invisible"
                } 
                ${
                  pathname === item.href ? "text-egg-blue-500" : "text-gray-400"
                } 
                text-sm font-sans`}
            >
              {item.name}
            </span>
            {/* 文字部分 */}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;
