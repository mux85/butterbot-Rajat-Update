"use client";

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link";
import Image from "next/image";
import { Montserrat } from 'next/font/google'
import { Code, ImageIcon, Bot,LayoutDashboard, MessageSquare, Music, Settings, UploadCloud, VideoIcon, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { FreeCounter } from "@/components/free-counter";

const poppins = Montserrat ({ weight: '600', subsets: ['latin'] });

const routes = [
  {
    label: 'Dashboard',
    icon: Sparkles,
    href: '/dashboard',
    color: "text-pink-500"
  },
  {
    label: 'Step 1 - Upload your Data',
    icon: UploadCloud,
    color: "text-violet-500",
    href: '/upload',
  },
  {
    label: 'Step 2 - Test your ButterBot',
    icon: MessageSquare,
    href: '/conversation',
    color: "text-green-500",
  },

  {
    label: 'Step 3 - Customise Bot',
    icon: Bot,
    color: "text-orange-700",
    href: '/customise',
  },
/*
  {
    label: 'Test',
    icon: MessageSquare,
    href: '/test',
    color: "text-violet-500",
  },
 
  {
    label: 'Integrate',
    icon: Code,
    color: "text-green-700",
    href: '/code',
  }, */
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
  },
];

export const Sidebar = ({
  apiLimitCount = 0,
  isPro = false
}: {
  apiLimitCount: number;
  isPro: boolean;
}) => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();  // add this line


  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative h-8 w-8 mr-4">
            <Image fill alt="Logo" src="/bblogo.png" />
          </div>
          <h1 className={cn("text-2xl font-bold", poppins.className)}>
            ButterBot
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href} 
              href={route.href}
              onClick={(e) => {
                if (['/upload', '/conversation', '/customise'].includes(route.href)) {
                  e.preventDefault();
                }
              }}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <FreeCounter 
      
        isPro={isPro} 
      />
    </div>
  );
};
