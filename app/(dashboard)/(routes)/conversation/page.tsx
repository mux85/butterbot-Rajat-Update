"use client";

import { useState, useEffect } from "react";
import { FullPageChat } from "flowise-embed-react";
import { Heading } from "@/components/heading";
import { MessageSquare, Bot, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const YourNewPage = () => {
  const [botName, setBotName] = useState(''); 

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const botNameFromUrl = urlParams.get('botName') || '';
    console.log('botNameFromUrl: ', botNameFromUrl);
    setBotName(botNameFromUrl);
  }, []);

  return (
    <div>
      <div className="px-4 lg:px-8">
        {botName && (
          <Badge variant="outline" className="mx-auto mb-4">
            ButterBot Name: {botName}
          </Badge>
        )}
      </div>
      <div className="px-4 lg:px-8 flex justify-between items-center">
        <div>
          <Heading
            title="Test Your ButterBot"
            description="Speak to your personal information assistant"
            icon={MessageSquare}
            iconColor="text-emerald-500"
            bgColor="bg-emerald-500/10"
          />
        </div>
        <div>
          <Link href={`/customise?botName=${botName}`} passHref>
            <Button as="a" className="bg-orange-500 px-6 text-white hover:bg-orange-600">
              <div className="flex items-center">
                <Bot className="mr-2 h-4 w-4" />
                Customize your bot
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="px-4 lg:px-8 relative">

        <FullPageChat
          chatflowid="1e32e22f-c9e9-46f2-a7cd-435b3580183f"
          apiHost="https://gnoo.onrender.com"
          theme={{
            chatWindow: {
              height: 500,
              welcomeMessage: "Welcome to Butterbot! As part of this demo, we may only use part of your data. However, rest assured, you'll get a comprehensive sense of Butterbot's capabilities. Let's get started, how can I assist you today!",
              backgroundColor: "#ffffff",
              fontSize: 14,
              poweredByTextColor: "#ffffff",
              botMessage: {
                backgroundColor: "#f7f8ff",
                textColor: "#303235",
                showAvatar: true,
                avatarSrc: "https://cdn.shopify.com/s/files/1/0793/8418/3092/files/bblogo.png?v=1690918654",
              },
              userMessage: {
                backgroundColor: "#3a80f6",
                textColor: "#ffffff",
                showAvatar: true,
                avatarSrc: "https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png",
              },
              textInput: {
                placeholder: "test out ButterBot...",
                backgroundColor: "#ffffff",
                textColor: "#303235",
                sendButtonColor: "#d9c4ff",
              }
            }
          }}
          chatflowConfig={{
            pineconeNamespace: botName,
          }}
        />
        <div style={{
    position: 'absolute', 
    bottom: '0', 
    left: '0', 
    right: '0', 
    height: '10%', 
    zIndex: 9999,
    backgroundColor: 'transparent',
  }}></div>
</div>
      </div>
      
    
  );
};

export default YourNewPage;
