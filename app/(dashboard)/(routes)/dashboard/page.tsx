"use client";

import React, { useEffect, useState } from 'react';
import { ArrowRight, Link, Files, PlusCircle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogCancel, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bot, Trash, PlusSquare, Settings } from "lucide-react";  // import the icon components
import { tools } from "@/constants";



export default function HomePage() {
  const [bots, setBots] = useState([]);
  const router = useRouter();
  // State to track whether the delete confirmation dialog is open
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // State to track the ID of the bot to delete
  const [botToDelete, setBotToDelete] = useState(null);
  

  useEffect(() => {
    fetch("/api/getbot", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setBots(data);
    })
    .catch((error) => console.error(error));
  }, []);

  // Add deleteBot function here
  const deleteBot = async (botId) => {
    try {
      const response = await fetch('/api/deletebot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botId,
        }),
      });
  
      if (response.ok) {
        // Remove the deleted bot from the state
        setBots(prevBots => prevBots.filter(bot => bot.id !== botId));
      } else {
        throw new Error('Failed to delete bot');
      }
    } catch (error) {
      console.error('Failed to delete bot:', error);
    }
  };


  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Welcome to ButterBot
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Create your own bot with your own data
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool) => (
          <Card onClick={() => router.push(tool.href)} key={tool.href} className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer">
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)} />
              </div>
              <div className="font-semibold">
                {tool.label}
              </div>
            </div>
            <PlusCircle className="w-9 h-9" />
          </Card>
        ))}
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4 mb-8">
        <h2 className="text-2xl font-semibold my-4">Saved Bots</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bots.map((bot) => (
            <Card key={bot.id} className="w-full mb-4 shadow-md hover:shadow-lg transition-shadow duration-200 ease-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Bot className="w-6 h-6 text-primary" />
                    <CardTitle className="text-lg">{bot.botName}</CardTitle>
                  </div>
                  <Button className="text-xs bg-gray-200 hover:bg-gray-300 text-black" onClick={() => router.push(`/customise?botName=${bot.botName}`)}>
  <Settings className="mr-2 h-4 w-4" /> Edit
</Button>

                </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center space-x-4 rounded-md border p-4">
                  <Link className="w-6 h-6 text-primary" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      URLs Stored
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {bot.url || "No URLs stored"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                  <Files className="w-6 h-6 text-primary" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Files Stored
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {bot.file || "No files stored"}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-xs mr-2">
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this bot and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteBot(bot.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button className="text-xs" onClick={() => router.push(`/bots/${bot.id}`)}>
                  <PlusSquare className="mr-2 h-4 w-4" /> Add memory
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}