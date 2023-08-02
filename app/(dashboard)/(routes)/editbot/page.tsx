"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/loader";
import { Label } from "@/components/ui/label";
import { Heading } from "@/components/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CheckCheck, Bot, ChevronRight, UploadCloud, MessageSquare } from "lucide-react"
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { Switch } from "@/components/ui/switch";

const EditBotPage = ({ botNameFromUrl }) => {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [file, setFile] = useState(null);
  const [bots, setBots] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [botName, setBotName] = useState(botNameFromUrl);  // Add this line

  const { user } = useUser();

  const SCRAPING_API_URL = "https://gnoo.onrender.com/api/v1/prediction/1b5ba2b2-40a4-4413-b75c-012609b5e7fb";
  const PDF_API_URL = "https://butterbot-ml2y.onrender.com/api/v1/prediction/88e6f717-db04-40bc-a3d5-753a7582b37d";
  
  console.log(botName);

  // New useEffect hook
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const botName = urlParams.get('botName');
      console.log("Bot name from URL parameters: ", botName);
      if (botName) {
        setBotName(botName);
      }
    }
  }, []);
  
  function isValidURL(string) {
    if (!string) return false;
    var res = string.match(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/);
    return (res !== null);
  };

  const handleFileChange = (event) => {
    const chosenFile = event.target.files[0];
    if (chosenFile && chosenFile.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      setFile(null);
    } else {
      setFile(chosenFile);
    }
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
    setUrlError('');
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!botName) {
      console.error("botName is undefined");
      return;
    }
    const userId = user.id;
    setFormSubmitted(false);
  
    if ((url === '' || !isValidURL(url)) && file === null) {
      setUrlError("Either a valid URL or a file is required");
      return;
    }
  
    if (url !== '' || file !== null) {
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
          formData.append("pineconeNamespace", botName); 
          res = await axios.post(PDF_API_URL, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }
  
        if (res.status === 200) {
          setBots(prevBots => [...prevBots, { botName: botName, url: url, file: file }]);
          setLoading(false);
          setUrl("");
          setFile(null);
          setFormSubmitted(true);
  
          try {
            const botRes = await fetch(`/api/editbot`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                botName: botName, 
                url,
                file: file ? file.name : '',
                userId,
               }),
            });
  
            console.log(botRes);
  
            if (botRes.ok) {
              toast.success("Bot updated successfully!");
            } else {
              const errorMessage = await botRes.text();
              toast.error(`Failed to update bot: ${errorMessage}`);
            }
          } catch (error) {
            console.error('Failed to update bot:', error);
            toast.error('Failed to update bot');
          }
  
        } else {
          setLoading(false);
          console.error(`An error occurred while processing the input. Status code: ${res.status}`);
        }
      } catch (error) {
        console.error(error);
  
        if (error.response && error.response.data.includes("Vector dimension 0 does not match the dimension of the index 1536")) {
          setBots(prevBots => [...prevBots, { botName: botName, url: url, file: file }]);
          setUrl("");
          setFile(null);
          setFormSubmitted(true);
        } else {
          toast.error("Invalid URL details. Please check your submission again.");
        }
      } finally {
        setLoading(false);
      }
    }
  };
  console.log("Bot name from URL: ", botName);  // Change this line
  return (
    <div className="px-4 lg:px-8 space-y-4">
     {formSubmitted && (
  <Badge variant="outline" className="mx-auto mb-4">
    ButterBot Name: {botName}  // Change this line
  </Badge>
)}
      
      <form className="grid w-full ml-0 items-start space-y-6" onSubmit={onSubmit}>
        <div className="space-y-2">
        <Label htmlFor="botName" className="font-bold">Bot Name</Label>
          <div id="botName" className="font-bold">{botName}</div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="url" className="font-bold">Enter Website Address</Label>
          <Input 
            id="url"
            type="text" 
            onChange={handleUrlChange} 
            placeholder="Enter website URL : https://"
            className="w-full"
            value={url}  // set the input's value to the bot's current url
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


export default EditBotPage;
