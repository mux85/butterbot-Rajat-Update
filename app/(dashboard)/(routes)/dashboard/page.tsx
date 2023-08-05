"use client";

import React, { useEffect, useState } from 'react';
import { ArrowRight, Link, Files, PlusCircle, X } from "lucide-react";
import axios from 'axios';
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
import { Bot, Trash, PlusSquare, Settings, MessageSquare, Loader, CheckCircle } from "lucide-react";  // import the icon components
import { tools } from "@/constants";
import { Badge } from '@/components/ui/badge';
import { Input } from "@/components/ui/input";


export default function HomePage() {
  const [bots, setBots] = useState([]);
  const router = useRouter();
  // State to track whether the delete confirmation dialog is open
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // State to track the ID of the bot to delete
  const [botToDelete, setBotToDelete] = useState(null);
  const [isAddDataModalOpen, setIsAddDataModalOpen] = useState(false);
  const [newData, setNewData] = useState({ botId: '', type: '', value: '' });
  const [newDataError, setNewDataError] = useState('');
  const [chosenFileName, setChosenFileName] = useState('');
  const [urlUploaded, setUrlUploaded] = useState(false);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const SCRAPING_API_URL = "https://gnoo.onrender.com/api/v1/prediction/1b5ba2b2-40a4-4413-b75c-012609b5e7fb";
  const PDF_API_URL = "https://butterbot-ml2y.onrender.com/api/v1/prediction/88e6f717-db04-40bc-a3d5-753a7582b37d";

  
  useEffect(() => {
    fetch("/api/getbot", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    })
    .then(response => response.json())
    .then(data => {
      console.log("Fetched bots:", data);  // <-- Add this line
      // Change bot.id to bot.botName
      setBots(data.map(bot => ({ ...bot, id: bot.id })));
    })
    .catch((error) => console.error(error));
  }, []);

  // Add deleteBot function here
  const deleteBot = async (botId) => {
    try {
      console.log('Bot ID to delete:', botId);
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
  const isValidURL = (string) => {
    if (typeof string !== 'string') {
      return false;
    }
    var res = string.match(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/);
    return (res !== null);
  };

  const handleNewDataChange = (event) => {
    const { name, value } = event.target;
    setNewData(prevData => ({ ...prevData, [name]: value }));
    setNewDataError('');
  };

  const handleFileChange = (event) => {
    const chosenFile = event.target.files[0];
    // file size is in bytes, so we convert 5mb to bytes
    if (chosenFile && chosenFile.size > 5 * 1024 * 1024) {
      setNewDataError("File size must be less than 5MB");
    } else {
      setNewData(prevData => ({ ...prevData, value: chosenFile, url: '' }));
      setChosenFileName(chosenFile.name);  // Set the file name here
    }
  };
  

  const addData = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    if (newData.value === '') {
      setNewDataError("Either a URL or a file is required");
      return;
    }
  
    // URL validation
    if (newData.type === 'URL' && !isValidURL(newData.value)) {
      setNewDataError("Oops, invalid URL! Make sure your URL starts with \"http\" or \"https\", includes a domain and for best results, just copy it straight from your address bar.");
      return;
    }
  
    console.log("New data to add:", newData);
    const bot = bots.find(b => b.id === newData.botId); 
    console.log("Selected bot:", bot);
    const formData = new FormData();
    formData.append('botId', bot.id); // Keep as bot.id
  
    let response;
    if (newData.type === 'URL') {
      const payload = {
        "question": "Hey, how are you?",
        "overrideConfig": {
          "url": newData.value,
          "pineconeNamespace": bot.botName, 
          "pineconeIndex": "keeko",
          "pineconeEnv": "northamerica-northeast1-gcp",
          "webScrap": true,
        },
      };
      try {
        response = await axios.post(SCRAPING_API_URL, payload);
      } catch (error) {
        console.error('Failed to add URL:', error);
      }
    } else if (newData.type === 'PDF') {
      formData.append('files', newData.value);
      formData.append('pineconeNamespace', bot.botName); 
      try {
        response = await axios.post(PDF_API_URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (error) {
        console.error('Failed to upload PDF:', error);
      }
    }
  
    if (response && response.status === 200) {
      setBots(prevBots => prevBots.map(b => b.botName === newData.botId ? {...b, [newData.type.toLowerCase()]: newData.value} : b));
      setSuccess(true);
      if(newData.type === 'URL') {
        setUrlUploaded(true);
        setPdfUploaded(false);
      } else if(newData.type === 'PDF') {
        setPdfUploaded(true);
        setUrlUploaded(false);
      }
  
      try {
        console.log("Bots array:", bots);
        console.log("newData.botId:", newData.botId); 
        const bot = bots.find(b => b.id === newData.botId);
        console.log("Selected bot:", bot);
        // New console.log statements
        console.log("Bot object:", bot);
        console.log("Bot ID:", bot.id);
        console.log("Bot name:", bot.botName);
        const updatedValue = newData.value;
        console.log("Updated bot:", bot, "Updated value:", updatedValue); 
    
        // Paste the new code here
        let updateData = {
          botId: bot.id,
        };
    
        if (newData.type === 'URL') {
          updateData.url = updatedValue;  // only change the url if adding a URL
        }
    
        if (newData.type === 'PDF') {
          updateData.file = chosenFileName;  // only change the file if adding a PDF
        }
    
        await fetch('/api/editbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });  
    
      } catch (error) {
        console.error('Failed to update bot:', error);
      }
    } else {
      throw new Error('Failed to add data');
    }
    setLoading(false);
    
    
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
        bots.length < 1 ? (
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
        ) : (
          <Card key={tool.href} onClick={() => alert("You can't create more than one bot in free tier.")} className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer">
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
        )
      ))}
      {isAddDataModalOpen && (
  <div className="fixed z-10 inset-0 overflow-y-auto">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center">
      <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:w-1/2 sm:max-w-lg sm:my-8 sm:align-middle sm:p-6">
        <div className="flex justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
            Add data
          </h3>
          <button onClick={() => setIsAddDataModalOpen(false)}>
            <X className="h-6 w-6" /> {/* This is the X icon from lucide-react */}
          </button>
        </div>
        <div className="mt-2">
        <form onSubmit={addData} className="space-y-4">
        <div className="flex items-center justify-start space-x-4">
  <div className="flex items-center space-x-2">
    <label className="flex items-center">
      <input type="radio" name="type" value="URL" checked={newData.type === 'URL'} onChange={handleNewDataChange} />
      <span className="ml-2">URL</span>
    </label>
    {urlUploaded && 
      <div className="flex items-center space-x-1 text-green-500 text-xs font-bold">
        <CheckCircle className="h-5 w-5" />
        <span>ADDED</span>
      </div>
    }
  </div>
  <div className="flex items-center space-x-2">
    <label className="flex items-center">
      <input type="radio" name="type" value="PDF" checked={newData.type === 'PDF'} onChange={handleNewDataChange} />
      <span className="ml-2">PDF</span>
    </label>
    {pdfUploaded && 
      <div className="flex items-center space-x-1 text-green-500 text-xs font-bold">
        <CheckCircle className="h-5 w-5" />
        <span>ADDED</span>
      </div>
    }
  </div>
</div>



  {newData.type === 'URL' ? (
  <div className="flex items-center space-x-4">
    <Input
      type="text"
      name="value"
      onChange={handleNewDataChange}
      placeholder="Enter website URL : https://"
      className="w-full py-2"
    />
  </div>
) : (
  <div className="flex items-center space-x-4">
    <Input
      type="file"
      name="value"
      onChange={handleFileChange}
      accept=".pdf"
      className="w-full py-2"
    />
  </div>
)}


  {newDataError && <p className="text-xs font-bold text-red-500">{newDataError}</p>}
  <Button type="submit" className="w-full mt-4">
  {loading ? <Loader /> : "Submit"}
</Button>
</form>
          </div>
        </div>
      </div>
    </div>
  )}

      </div>
      <div className="pt-8 px-4 md:px-20 lg:px-32 space-y-4 mb-8">
        <h2 className="text-2xl font-semibold my-4">Saved Bots</h2>
        {bots.length === 0 ? (
          <p className="text-muted-foreground font-light text-xs md:text-sm">
            Your saved bots will appear here when you create them.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bots.map((bot) => (
              <Card key={bot.id} className="w-full mb-4 shadow-md hover:shadow-lg transition-shadow duration-200 ease-in">
                <CardHeader>
  <div className="flex items-center justify-between">
  <Badge variant="secondary" className="text-base">
  {bot.botName}
</Badge>

    <div className="flex items-center space-x-2">
      <Button variant="outline" size="icon" onClick={() => router.push(`/customise?botName=${bot.botName}`)}>
        <Bot className="h-4 w-4 text-orange-500" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => router.push(`/conversation?botName=${bot.botName}`)}>
        <MessageSquare className="h-4 w-4 text-green-500" />
      </Button>
    </div>
  </div>
</CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center space-x-4 rounded-md border p-4">
                    <Link className="w-6 h-6 text-primary" />
                    <div className="flex-1 space-y-1 flex flex-wrap">
                      <p className="text-sm font-medium leading-none">
                        URLs Stored
                      </p>
                      <p className="text-xs text-muted-foreground overflow-wrap break-all">
                        {bot.url ? bot.url.replace(/,/g, ', ') : "No URLs stored"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 rounded-md border p-4">
                    <Files className="w-6 h-6 text-primary" />
                    <div className="flex-1 space-y-1 flex flex-wrap">
                      <p className="text-sm font-medium leading-none">
                        Files Stored
                      </p>
                      <p className="text-xs text-muted-foreground overflow-wrap break-all">
                        {bot.file ? bot.file.replace(/,/g, ', ') : "No files stored"}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-xs text-red-500 mr-2">
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
                        <AlertDialogAction style={{backgroundColor: 'red', color: 'white'}} onClick={() => deleteBot(bot.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button className="text-xs" onClick={() => { setNewData({ botId: bot.id, type: '', value: '' }); setIsAddDataModalOpen(true); }}>
  <PlusSquare className="mr-2 h-4 w-4" /> Add data
</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
