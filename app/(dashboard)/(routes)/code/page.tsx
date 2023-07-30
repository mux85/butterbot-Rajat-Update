"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Trash, PlusSquare } from "lucide-react";  // import the icon components
import { Separator } from '@/components/ui/separator';

const bots = [
  {id: 1, name: "Moqono", urls: "url1.com, url2.com", files: "file1.pdf, file2.pdf"},
  {id: 2, name: "Habbit", urls: "url1.com, url2.com", files: "file1.pdf"},
  {id: 3, name: "ButterBot", urls: "url1.com", files: "file1.pdf, file2.pdf, file3.pdf"},
];


export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="px-4 lg:px-8 space-y-4 mb-8">
      <h2 className="text-2xl font-semibold my-4">Saved Bots</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bots.map((bot) => (
          <Card key={bot.id} className="w-full mb-4 shadow-md hover:shadow-lg transition-shadow duration-200 ease-in">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Bot className="w-6 h-6 text-primary" />  {/* icon component */}
                <CardTitle>{bot.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
  <div className="flex items-start">
    <div className="flex-1">
      <h4 className="font-medium">URLs in memory:</h4>
      <p>{bot.urls}</p>
    </div>
    <div className="border-l border-gray-200 mx-4 w-px"></div>
    <div className="flex-1">
      <h4 className="font-medium">Files in memory:</h4>
      <p>{bot.files}</p>
    </div>
  </div>
</CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push(`/bots/${bot.id}`)}>
                <Trash className="mr-2 h-4 w-4" /> Delete
              </Button>
              <Button onClick={() => router.push(`/bots/${bot.id}`)}>
                <PlusSquare className="mr-2 h-4 w-4" /> Add to memory
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
