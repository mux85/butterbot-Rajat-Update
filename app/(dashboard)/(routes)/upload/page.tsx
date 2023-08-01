"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/loader";
import { Label } from "@/components/ui/label";
import { Heading } from "@/components/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CheckCheck, Bot, ChevronRight, UploadCloud } from "lucide-react"
import axios from "axios";
import { useUser } from "@clerk/nextjs"; // import auth from Clerk


const BotCreationPage = () => {
  const [loading, setLoading] = useState(false);
  const [botName, setBotName] = useState("");
  const [botNameError, setBotNameError] = useState("");
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [file, setFile] = useState(null);
  const [bots, setBots] = useState([]);
  const [submittedBotName, setSubmittedBotName] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);  // new state variable
  const { user } = useUser();

  const SCRAPING_API_URL = "https://gnoo.onrender.com/api/v1/prediction/1b5ba2b2-40a4-4413-b75c-012609b5e7fb";
  const PDF_API_URL = "https://butterbot-ml2y.onrender.com/api/v1/prediction/88e6f717-db04-40bc-a3d5-753a7582b37d";


  function isValidURL(string) {
    var res = string.match(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/);
    return (res !== null);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleBotNameChange = (event) => {
    setBotName(event.target.value);
    setBotNameError('');  
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
    setUrlError('');
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const userId = user.id;
    setFormSubmitted(false);
    setSubmittedBotName(botName);  

    if (botName === '') {
      setBotNameError("Bot name is required");
      return;
    }

    if (url === '' && file === null) {
      setUrlError("Either a URL or a file is required");
      return;
    }

    // URL validation
    if (url !== '' && !isValidURL(url)) {
      setUrlError("Invalid URL");
      return;
    }

    if (botName !== '' && (url !== '' || file !== null)) {
      setLoading(true);
      const payload = {
        "question": "Hey, how are you?",
        "overrideConfig": {
          "url": url,
          "pineconeNamespace": botName,
          "pineconeIndex": "keeko",
          "pineconeEnv": "northamerica-northeast1-gcp",
          "webScrap": true,
        },
      };

      try {
        let res;
        if (url !== '') {
          res = await axios.post(SCRAPING_API_URL, payload);
        } else if (file !== null) {
          const formData = new FormData();
          formData.append("files", file);
          formData.append("pineconeNamespace", botName);  // Use the bot name from the form data
          res = await axios.post(PDF_API_URL, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }

        if (res.status === 200) {
          setBots(prevBots => [...prevBots, { botName: botName, url: url, file: file }]);
          setLoading(false);
          setBotName(botName);
          setUrl("");
         setFile(null);
         setFormSubmitted(true); 
        } else {
          setLoading(false);
          console.error(`An error occurred while processing the input. Status code: ${res.status}`);
        }
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    }
  };

  return (
    <div className="px-4 lg:px-8 space-y-4">
     {formSubmitted && (
  <Badge variant="outline" className="mx-auto mb-4">
    ButterBot Name: {submittedBotName}
  </Badge>
)}

      <Heading
        title="Upload your data"
        description="add your files ButterBot to learn"
        icon={UploadCloud}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <form className="grid w-full ml-0 items-start space-y-6" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="botName" className="font-bold">Enter Bot Name*</Label>
          <Input 
            id="botName"
            type="text" 
            onChange={handleBotNameChange} 
            placeholder="Enter a unique name for your bot"
            className="w-full"
            disabled={formSubmitted}
          />
          {botNameError && <p className="text-xs font-bold text-red-500">{botNameError}</p>}

        </div>
        <div className="space-y-2">
          <Label htmlFor="url" className="font-bold">Enter Website Address</Label>
          <Input 
            id="url"
            type="text" 
            onChange={handleUrlChange} 
            placeholder="Enter website URL : https://"
            className="w-full"
          />
          {urlError && <p className="text-xs font-bold text-red-500">{urlError}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="pdfFile" className="font-bold">Upload PDF file</Label>
          <Input 
            id="pdfFile"
            type="file"
            onChange={handleFileChange}
            accept=".pdf"
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full mt-4">{loading ? "Processing..." : "Submit"}</Button>
      </form>
      {loading && (
        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
          <Loader />
        </div>
      )}
      {bots.length > 0 && bots.map((bot, index) => (
        <Card key={index} className="mt-4">
          <CardHeader className="flex justify-between items-start py-2"> 
            <div className="flex items-center">
              <CardTitle className="text-green-600 text-left font-bold text-2xl">Analysis Complete</CardTitle>  
              <Check className="text-green-600 ml-2"/>  
            </div>
            <Link href={`/conversation?botName=${bot.botName}`} passHref>
            <Button as="a" className="flex justify-between items-center bg-green-500 px-6 text-white hover:bg-green-600">
                <div className="flex items-center">
                  <Bot className="mr-2 h-4 w-4" />
                  Test the bot
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-white shadow-md">
              <p className="text-blue-700 font-semibold text-md">Bot Name:</p> 
              <p className="text-gray-600 text-sm">{bot.botName}</p>
            </div>
            <div className="p-4 bg-white shadow-md">
              <p className="text-blue-700 font-semibold text-md">Website analysed:</p>
              <p className="text-gray-600 text-sm">{bot.url}</p>
            </div>
            <div className="p-4 bg-white shadow-md">
              <p className="text-blue-700 font-semibold text-md">PDF analysed:</p>
              <p className="text-gray-600 text-sm">{bot.file ? bot.file.name : "No file uploaded"}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
  };
  
  export default BotCreationPage;
  