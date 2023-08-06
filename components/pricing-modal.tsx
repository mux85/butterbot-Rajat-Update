"use client";

// components/PricingTable.tsx

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";


const plans = [
  {
    name: 'ButterBot',
    price: 'Free',
    type: 'Lite',
    buttonText: 'Get Started with Lite', // New property
    href: '/sign-up',         
    features: [
      'Unlimited messages',
      'Create One ButterBot',
      'ButterBot branding',
      'Add unlimited files and links',
      'Share via embed'
    ]
  },
  {
    name: 'ButterBot',
    price: '$19.99/mo',
    type: 'Pro',
    buttonText: 'Go Pro',       // New property
    href: '/sign-up',     
    features: [
      'Unlimited Messages',
      'Create Unlimited ButterBots',
      'Use custom branding and logos',
      'Add unlimited files and links',
      'Share via link, embed, or API',
      'Monthly refresh of stored links',
      'Customise tone and answer style (coming soon)',
      'Analytics and conversation export (coming soon)'
    ]
  }
];
const buttonVariants: {
  [key in "Lite" | "Pro"]: "link" | "secondary" | "premium" | "default" | "destructive" | "outline" | "ghost";
} = {
  Lite: 'secondary',
  Pro: 'premium'
};


export const PricingTable = () => {
  return (
    <div className="px-10 pb-20">
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">Pricing</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.name}
            className={`relative bg-[#192339] border-none text-white hover:bg-opacity-90 transition-all duration-300 p-4 rounded-lg flex flex-col ${plan.type === 'Pro' ? 'shadow-2xl bg-gradient-to-br from-[#1b3c63] to-[#351c40]' : ''}`}
          >
            {plan.type === 'Pro' && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-sm py-1 px-2 rounded-full px-4 py-1">Recommended</span>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                {plan.name}
                {plan.type === 'Lite' 
                  ? <Badge variant="secondary" className="ml-2">Lite</Badge> 
                  : <Badge variant="premium" className="ml-2">Pro</Badge>}
              </h3>

              <p className="text-2xl font-bold mb-4">{plan.price}</p>
              <ul>
                {plan.features.map((feature) => (
                  <li className="mb-2 flex items-center" key={feature}>
                    <ChevronRight className="mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <Button 
              className="mt-4 w-full"
              variant={buttonVariants[plan.type as "Lite" | "Pro"]}
              onClick={() => window.location.href = plan.href}
            >
              {plan.buttonText}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
