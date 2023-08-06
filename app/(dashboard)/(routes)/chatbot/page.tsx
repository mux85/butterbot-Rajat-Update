"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link'; // make sure to import Link
import { Check, CheckCheck, Bot, ChevronRight, MessageSquare } from "lucide-react"
import { Heading } from "@/components/heading";
import { Badge } from "@/components/ui/badge"; // make sure to import the Badge component
import { Button } from "@/components/ui/button";
import * as z from "zod";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { Loader } from "@/components/loader";
import { BotAvatar } from "@/components/bot-avatar";
import { UserAvatar } from "@/components/user-avatar";
import axios from "axios";

const CHATBOT_API_URL = "https://gnoo.onrender.com/api/v1/prediction/1e32e22f-c9e9-46f2-a7cd-435b3580183f";

const YourNewPage = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [botName, setBotName] = useState(''); 

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const botNameFromUrl = urlParams.get('botName') || '';
    console.log('botNameFromUrl: ', botNameFromUrl);
    setBotName(botNameFromUrl);
  }, []);

  const sendUserMessage = async (data) => {
    if (data.message !== '') {
      setLoading(true);
      const payload = {
        "question": data.message,
        "overrideConfig": {
          "pineconeNamespace": botName,
        },
      };
      
      console.log('botName:', botName); 
      console.log('payload:', payload); 

      try {
        const res = await axios.post(CHATBOT_API_URL, payload);
        if (res.status === 200) {
          const botMessage = res.data;
          setMessages([...messages, {message: data.message, role: 'user'}, {message: botMessage, role: 'bot'}]);
          setLoading(false);
        } else {
          setLoading(false);
          console.error(`An error occurred while processing the message. Status code: ${res.status}`);
        }
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    }
  };

  return (
    <div>
        <div className="px-4 lg:px-8">
      {botName && (
        <Badge variant="outline" className="mx-auto mb-4">
          ButterBot Name: {botName}
        </Badge>
      )}
    </div>
    <Heading
      title="Customize Your Bot"
      description="Please enter the following details."
      icon={MessageSquare}
      iconColor="text-emerald-500"
      bgColor="bg-emerald-500/10"
    />
    <div className="px-4 lg:px-8">
      <div className="space-y-4 mt-4">
        {loading && (
          <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
            <Loader />
          </div>
        )}
        <div className="flex flex-col-reverse gap-y-4">
        {messages.map((message, index) => (
  <div 
    key={index}
    className="p-8 w-full flex items-start gap-x-8 rounded-lg bg-white border border-black/10"
  >
    {message.role === 'user' ? <UserAvatar /> : <BotAvatar />}
    <p className="text-sm">
      {message.message}
    </p>
  </div>
))}

          <AutoForm
  formSchema={z.object({ message: z.string() })}
  onSubmit={sendUserMessage}
  fieldConfig={{
    message: {
      inputProps: {
        placeholder: "Type your message...",
        disabled: loading
      }
    }
  }}
>
  <div className="flex justify-between items-center">
    <AutoFormSubmit disabled={loading}>Send</AutoFormSubmit>
    <Link href={`/customise?botName=${botName}`} passHref>
      <Button as="a" className="flex justify-between items-center bg-green-500 px-6 text-white hover:bg-green-600">
        <div className="flex items-center">
          <Bot className="mr-2 h-4 w-4" />
          Customize your bot
        </div>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </Link>
  </div>
</AutoForm>
        </div>
      </div>
    </div>
    </div>
  );
};

export default YourNewPage;
