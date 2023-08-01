"use client";

import { ArrowRight, Link, Files, PlusCircle } from "lucide-react";
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

const bots = [
  {id: 1, name: "Moqono", urls: "url1.com, url2.com", files: "file1.pdf, file2.pdf"},
  {id: 2, name: "Habbit", urls: "url1.com, url2.com, url3.com", files: "file1.pdf"},
  {id: 3, name: "Butter", urls: "url1.com", files: "file1.pdf, file2.pdf, file3.pdf"},
];

export default function HomePage() {
  const router = useRouter();

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
                    <CardTitle className="text-lg">{bot.name}</CardTitle>
                  </div>
                  <Button className="text-xs bg-gray-200 hover:bg-gray-300 text-black" onClick={() => router.push(`/bots/${bot.id}`)}>
                    <Settings className="mr-2 h-4 w-4" /> Customise
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
                    {bot.urls.split(', ').map((url, index) => (
                      <p key={index} className="text-sm text-muted-foreground">
                        {url}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                  <Files className="w-6 h-6 text-primary" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Files Stored
                    </p>
                    {bot.files.split(', ').map((file, index) => (
                      <p key={index} className="text-sm text-muted-foreground">
                        {file}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="text-xs mr-2" onClick={() => router.push(`/bots/${bot.id}`)}>
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </Button>
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
