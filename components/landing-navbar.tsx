"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const font = Montserrat({ weight: '600', subsets: ['latin'] });

export const LandingNavbar = () => {
  const { isSignedIn } = useAuth();

  const smoothScroll = (targetId) => {
    document.querySelector(targetId).scrollIntoView({ 
      behavior: 'smooth' 
    });
  }



  return (
    <nav className="p-4 bg-transparent flex items-center justify-between">
      <Link href="/">
        <div className="flex items-center cursor-pointer">
          <div className="relative h-8 w-8 mr-4">
            <Image fill alt="Logo" src="/bblogo.png" />
          </div>
          <h1 className={cn("text-2xl font-bold text-white", font.className)}>
            ButterBot
          </h1>
        </div>
      </Link>
      <div className="flex items-center gap-x-8">
        <span 
          onClick={() => smoothScroll('#features')}
          className="text-white cursor-pointer px-6 py-1 border-2 border-transparent hover:border-green-600 hover:rounded-full transition-all duration-100"
        >
          Features
        </span>
        <span 
          onClick={() => smoothScroll('#pricing')}
          className="text-white cursor-pointer px-6 py-1 border-2 border-transparent hover:border-purple-600 hover:rounded-full transition-all duration-100 mr-5"
        >
          Pricing
        </span>

        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button variant="outline" className="rounded-full">
            Get Started
          </Button>
        </Link>
      </div>
    </nav>
  );
}