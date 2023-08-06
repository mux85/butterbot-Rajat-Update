"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FastForward, Zap, Settings2, MessagesSquare, Lightbulb, UserPlus, MessageCircle, UploadCloud } from "lucide-react"

const features = [
  {
    icon: <FastForward />,
    title: "No-code easy install",
    description: "Deploy AI support bots effortlessly without any coding."
  },
  {
    icon: <Zap />,
    title: "Instant responses",
    description: "Provide real-time answers 24/7 to all customer inquiries."
  },
  {
    icon: <Settings2 />,
    title: "Customizable widget",
    description: "Personalize the bot's appearance to fit your brand."
  },
  {
    icon: <MessagesSquare />,
    title: "Omnichannel",
    description: "Engage customers across multiple platforms seamlessly."
  },
  {
    icon: <Lightbulb />,
    title: "Instant answers",
    description: "AI-powered answers to the most common questions."
  },
  {
    icon: <UserPlus />,
    title: "Smart transfer",
    description: "Connect users to human agents when AI can't answer."
  },
  {
    icon: <MessageCircle />,
    title: "Chat widget",
    description: "Embed a chat widget on any platform with ease."
  },
  {
    icon: <UploadCloud />,
    title: "Importers",
    description: "Easily import data and get started in minutes."
  }
  // ... Add other features similarly
];

export const FeaturesContent = () => {
  return (
    <div className="px-10 pb-20"> {/* Slightly different background for the entire section */}
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <Card 
            key={feature.title} 
            className="bg-[#21304b] border-none text-white hover:bg-[#1a2438] transition-all duration-300 p-4 rounded-lg shadow-md" // Changed background and added shadow
          >
            <div className="flex items-start gap-x-4">
              <div className="text-5xl">{feature.icon}</div>
              <div>
                <p className="text-xl font-bold mb-2">{feature.title}</p>
                <p className="text-zinc-200 text-sm">{feature.description}</p> {/* Updated text color */}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
